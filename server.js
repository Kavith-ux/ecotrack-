// ================= IMPORTS =================
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DB CONNECTION =================
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) {
    console.log("❌ DB Error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// ================= ADD REQUEST =================
app.post("/request", (req, res) => {
  console.log("Incoming:", req.body);

  const { name, wasteType, location } = req.body;

  const sql = `
    INSERT INTO requests (name, wasteType, location)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, wasteType, location], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.json({ success: false });
    }

    res.json({ success: true });
  });
});


app.get("/getRequests", (req, res) => {
  db.query("SELECT * FROM requests", (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    console.log("DATA:", result);
    res.json(result);
  });
});

// ================= GET REQUESTS =================
app.get("/getRequests", (req, res) => {
  db.query("SELECT * FROM requests", (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }
    res.json(result);
  });
});

// ================= DELETE =================
app.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM requests WHERE id=?", [req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

// ================= UPDATE =================
app.put("/update/:id", (req, res) => {
  const { name, wasteType, location } = req.body;

  const sql = "UPDATE requests SET name=?, wasteType=?, location=? WHERE id=?";

  db.query(sql, [name, wasteType, location, req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

// ================= RECYCLE =================
app.put("/recycle/:id", (req, res) => {
  db.query(
    "UPDATE requests SET status='Recycled', points=10 WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }
      res.json({ success: true });
    }
  );
});


// ================= SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on https://ecotrack-q9wt.onrender.com");
});
app.get("/", (req, res) => {
    res.send("🚀 EcoTrack Backend is Running!");
});
const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});