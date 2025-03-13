const db = require("./db");
const PDFDocument = require("pdfkit");
const fs = require("fs");

// Create CV
exports.createCV = (req, res) => {
  console.log("1111111111111", req.body);
  
  const { name, email, phone, summary, workExperience, education, skills } = req.body;
  const sql = `INSERT INTO cvs (name, email, phone, summary, experience, education, skills) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [name, email, phone, summary, JSON.stringify(workExperience), JSON.stringify(education), JSON.stringify(skills)], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log("result",result);
    
    res.status(201).json({ message: "CV created successfully", id: result.insertId });
  });
};

// Get all CVs
exports.getAllCVs = (req, res) => {
  db.query("SELECT id, name, email, phone, summary, created_at FROM cvs", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get CV by ID
exports.getCVById = (req, res) => {
  db.query("SELECT * FROM cvs WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "CV not found" });
    res.json(result[0]);
  });
};

// Update CV
exports.updateCV = (req, res) => {
  const { name, email, phone, summary, workExperience, education, skills } = req.body;
  const sql = `UPDATE cvs SET name=?, email=?, phone=?, summary=?, experience=?, education=?, skills=? WHERE id=?`;
  db.query(sql, [name, email, phone, summary, JSON.stringify(workExperience), JSON.stringify(education), JSON.stringify(skills), req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
 
    res.json({ message: "CV updated successfully" });
  });
};

// Delete CV
exports.deleteCV = (req, res) => {
  db.query("DELETE FROM cvs WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "CV deleted successfully" });
  });
};

// Generate PDF
exports.generatePDF = (req, res) => {
  db.query("SELECT * FROM cvs WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "CV not found" });

    const cv = result[0];
    const doc = new PDFDocument();
    const fileName = `cv_${cv.id}.pdf`;
    const filePath = `./pdfs/${fileName}`;

    doc.pipe(fs.createWriteStream(filePath));
    doc.pipe(res);

    doc.fontSize(20).text(cv.name, { align: "center" });
    doc.fontSize(14).text(`Email: ${cv.email}`);
    doc.text(`Phone: ${cv.phone}`);
    doc.moveDown();

    doc.fontSize(16).text("Professional Summary", { underline: true });
    doc.fontSize(12).text(cv.summary);
    doc.moveDown();

    doc.fontSize(16).text("Work Experience", { underline: true });
    cv.experience.forEach(exp => {
      doc.fontSize(12).text(`${exp.company} - ${exp.role}`);
      doc.text(`${exp.startDate} to ${exp.endDate}`);
      doc.text(exp.description);
      doc.moveDown();
    });
    

    doc.fontSize(16).text("Education", { underline: true });
    cv.education.forEach(edu => {
      doc.fontSize(12).text(`${edu.institution} - ${edu.degree}`);
      doc.text(`${edu.startDate} to ${edu.endDate}`);
      doc.moveDown();
    });
    
    doc.fontSize(16).text("Skills", { underline: true });
    doc.fontSize(12).text(cv.skills);
    doc.end();
  });
};
