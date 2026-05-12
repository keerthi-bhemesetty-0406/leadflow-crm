const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// --- ROUTES ---

// 1. Add Lead
// 1. Add Lead
app.post('/api/leads', async (req, res) => {
  const { name, phone, source } = req.body;

  // 1. Structural Validation (Requirement: Form validation)
  if (!name || !phone || !source) {
    return res.status(400).json({ error: "Name, Phone, and Source are mandatory." }); [cite: 33]
  }

  // 2. Data Integrity (Requirement: Problem-solving approach)
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length !== 10) {
    return res.status(400).json({ error: "A valid 10-digit phone number is required." }); [cite: 33]
  }

  try {
    // 3. Database Check (Requirement: Database design)
    const existing = await pool.query("SELECT id FROM leads WHERE phone = $1", [cleanPhone]); [cite: 25]
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "This lead already exists." });
    }

    // 4. Success Case
    const result = await pool.query(
      "INSERT INTO leads (name, phone, source, status) VALUES ($1, $2, $3, 'New') RETURNING *",
      [name.trim(), cleanPhone, source]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" }); [cite: 34]
  }
});

// 2. Get All Leads
app.get('/api/leads', async (req, res) => {
  try {
    const allLeads = await pool.query("SELECT * FROM leads ORDER BY created_at DESC");
    res.json(allLeads.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 3. Update Lead Status (Interested / Not Interested / Converted)
app.put('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query("UPDATE leads SET status = $1 WHERE id = $2", [status, id]);
    res.json("Status updated!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}); 


// 4. Delete Lead
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM leads WHERE id = $1", [id]);
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// START SERVER (Keep this at the bottom)
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});