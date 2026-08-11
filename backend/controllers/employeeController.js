const { Op, fn, col } = require("sequelize");
const Employee = require("../models/Employee");

const employeeFields = ["name", "email", "department", "salary", "status"];

const getPayload = (body) =>
  employeeFields.reduce((payload, field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
    return payload;
  }, {});

exports.getEmployees = async (req, res) => {
  const { search = "" } = req.query;
  const where = search
    ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { department: { [Op.like]: `%${search}%` } },
        ],
      }
    : {};

  const employees = await Employee.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });

  return res.json({ employees });
};

exports.getEmployee = async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  return res.json({ employee });
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, department, salary } = req.body;
    if (!name || !email || !department || salary === undefined) {
      return res.status(400).json({ message: "Name, email, department and salary are required" });
    }

    const employee = await Employee.create(getPayload(req.body));
    return res.status(201).json({ employee });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Employee email already exists" });
    }
    return res.status(500).json({ message: "Unable to create employee" });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.update(getPayload(req.body));
    return res.json({ employee });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Employee email already exists" });
    }
    return res.status(500).json({ message: "Unable to update employee" });
  }
};

exports.deleteEmployee = async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  await employee.destroy();
  return res.json({ message: "Employee deleted" });
};

exports.getStats = async (req, res) => {
  const totalEmployees = await Employee.count();
  const activeEmployees = await Employee.count({ where: { status: "active" } });
  const departments = await Employee.count({ distinct: true, col: "department" });
  const salaryResult = await Employee.findOne({
    attributes: [[fn("COALESCE", fn("SUM", col("salary")), 0), "totalSalary"]],
    raw: true,
  });

  return res.json({
    totalEmployees,
    departments,
    activeEmployees,
    totalSalary: Number(salaryResult.totalSalary || 0),
  });
};
