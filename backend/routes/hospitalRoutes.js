const express = require("express");
const {
  registerHospitalController,
  loginHospitalController,
  getHospitalInfoController,
  updateHospitalProfileController,
  addDoctorToHospitalController,
} = require("../controllers/hospitalCtrl");
const authMiddleware = require("../middlewares/authMiddleware"); // add JWT verification middleware if needed

const router = express.Router();

// Registration & Login
router.post("/register", registerHospitalController);
router.post("/login", loginHospitalController);

// Protected Routes (require authentication)
router.post("/getHospitalInfo", authMiddleware, getHospitalInfoController);
router.put("/updateProfile", authMiddleware, updateHospitalProfileController);
router.post("/addDoctor", authMiddleware, addDoctorToHospitalController);

module.exports = router;
