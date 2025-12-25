import express from 'express';
import { db } from '../db.js';
const router = express.Router();

// GET universities with filters
router.get('/', async (req, res) => {
  try {
    const { country, degree, tuitionMax, search } = req.query;

    let sql = "SELECT * FROM universities WHERE 1=1";
    const params = [];

    if (country && country !== "All") { sql += " AND country=?"; params.push(country); }
    if (degree && degree !== "All") { sql += " AND degree_level=?"; params.push(degree); }
    if (tuitionMax) { sql += " AND tuition_fee<=?"; params.push(tuitionMax); }
    if (search) { sql += " AND name LIKE ?"; params.push(`%${search}%`); }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
