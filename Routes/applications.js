import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, degree, gpa, ielts, universityId } = req.body;

    // Step 1: Check eligibility
    const [uniRows] = await db.query(
      "SELECT * FROM universities WHERE id=?",
      [universityId]
    );

    const university = uniRows[0];
    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }

    if (
      parseFloat(gpa) < university.minGPA ||
      parseFloat(ielts) < university.minIELTS
    ) {
      return res
        .status(400)
        .json({ error: "You do not meet GPA/IELTS requirement" });
    }

    // Step 2: Save application
    await db.query(
      `INSERT INTO applications 
      (name, email, phone, degree, gpa, ielts, universityId, status, createdAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Submitted', NOW())`,
      [name, email, phone, degree, gpa, ielts, universityId]
    );

    res.json({ success: true, message: "Application submitted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
