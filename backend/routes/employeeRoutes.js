const express = require("express");
const employeeController = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/stats", employeeController.getStats);
router.get("/", employeeController.getEmployees);
router.post("/", employeeController.createEmployee);
router.get("/:id", employeeController.getEmployee);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
