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

    const gpaNum = parseFloat(gpa);
    const ieltsNum = parseFloat(ielts);

    if (gpaNum < university.min_gpa || ieltsNum < university.min_ielts) {
      return res.status(400).json({ error: "You do not meet GPA/IELTS requirement" });
    }

    // ✅ Step 1.5: Check for duplicate application
    const [existing] = await db.query(
      "SELECT * FROM applications WHERE email=? AND university_id=?",
      [email, universityId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "You already applied to this university" });
    }

    // Step 2: Save application
    await db.query(
      `INSERT INTO applications
       (student_name, email, gpa, ielts, university_id, applied_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, email, gpaNum, ieltsNum, universityId]
    );

    res.json({ success: true, message: "Application submitted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
