import { Icon } from "./Icons";
import { navigateTo, routes } from "../routes";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const avatarColors = ["#dbebff", "#dcfce7", "#fee2e2", "#fef3c7", "#ede9fe"];

const EmployeeTable = ({ employees, onDelete }) => (
  <div className="table-shell">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Salary</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee, index) => (
          <tr key={employee.id}>
            <td>
              <span
                className="avatar"
                style={{ background: avatarColors[index % avatarColors.length] }}
              >
                {employee.name?.charAt(0)?.toUpperCase() || "E"}
              </span>
              {employee.name}
            </td>
            <td>{employee.email}</td>
            <td>{employee.department}</td>
            <td>{money.format(Number(employee.salary || 0))}</td>
            <td>
              <div className="action-row">
                <button
                  className="icon-button edit"
                  type="button"
                  onClick={() => navigateTo(routes.editEmployee(employee.id))}
                  title="Edit employee"
                >
                  <Icon name="edit" size={16} />
                </button>
                <button
                  className="icon-button delete"
                  type="button"
                  onClick={() => onDelete(employee.id)}
                  title="Delete employee"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EmployeeTable;
