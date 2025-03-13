const express = require("express");
const router = express.Router();
const cvController = require("./cvController");

// API Endpoints
router.post("/cv", cvController.createCV);
router.get("/cvs", cvController.getAllCVs);
router.get("/cv/:id", cvController.getCVById);
router.put("/cv/:id", cvController.updateCV);
router.delete("/cv/:id", cvController.deleteCV);
router.get("/cv/:id/pdf", cvController.generatePDF);

module.exports = router;
