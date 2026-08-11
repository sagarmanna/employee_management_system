const express = require("express");
const employeeController = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/stats", employeeController.getStats);
router.get("/", employeeController.getEmployees);
router.post("/", requireRole("admin"), employeeController.createEmployee);
router.get("/:id", employeeController.getEmployee);
router.put("/:id", requireRole("admin"), employeeController.updateEmployee);
router.delete("/:id", requireRole("admin"), employeeController.deleteEmployee);

module.exports = router;
