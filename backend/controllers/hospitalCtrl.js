const hospitalModel = require("../models/hospitalModel");
const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret"; // store this securely in .env

// Register Hospital
const registerHospitalController = async (req, res) => {
  try {
    const { userId, name, email, password, phone, address, departments } = req.body;

    // Check if hospital already exists
    const existingHospital = await hospitalModel.findOne({ email });
    if (existingHospital) {
      return res.status(400).send({
        success: false,
        message: "Hospital already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newHospital = new hospitalModel({
      userId,
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      departments,
    });

    await newHospital.save();

    res.status(201).send({
      success: true,
      message: "Hospital registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in hospital registration",
      error,
    });
  }
};

// Login Hospital
const loginHospitalController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hospital = await hospitalModel.findOne({ email });
    if (!hospital) {
      return res.status(404).send({
        success: false,
        message: "Hospital not found",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: hospital.userId, role: "hospital" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({
      success: true,
      message: "Hospital login successful",
      token,
      hospital,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in hospital login",
      error,
    });
  }
};

// Get Hospital Info
const getHospitalInfoController = async (req, res) => {
  try {
    const hospital = await hospitalModel.findOne({ userId: req.body.userId }).populate("doctors");
    res.status(200).send({
      success: true,
      message: "Hospital data fetched successfully",
      data: hospital,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching hospital details",
      error,
    });
  }
};

// Update Hospital Profile
const updateHospitalProfileController = async (req, res) => {
  try {
    const { userId } = req.body;
    const hospital = await hospitalModel.findOneAndUpdate({ userId }, req.body, { new: true });
    res.status(200).send({
      success: true,
      message: "Hospital profile updated",
      data: hospital,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating hospital profile",
      error,
    });
  }
};

// Add Doctor to Hospital (same as earlier)
const addDoctorToHospitalController = async (req, res) => {
  try {
    const { hospitalId, doctorId, department } = req.body;

    const doctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      {
        isHospitalDoctor: true,
        hospitalId,
        department,
      },
      { new: true }
    );

    await hospitalModel.findByIdAndUpdate(
      hospitalId,
      { $push: { doctors: doctorId } },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Doctor added to hospital successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error adding doctor to hospital",
      error,
    });
  }
};

module.exports = {
  registerHospitalController,
  loginHospitalController,
  getHospitalInfoController,
  updateHospitalProfileController,
  addDoctorToHospitalController,
};
