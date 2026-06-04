const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "Me$$iM10",
  insecureAuth: true,
  database: "std",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// ============================================================
// CRUD API for table Std (Id, Name, University, Email, Major, GPA)
// ============================================================

// --- ViewAll: GET all students ---
app.get("/students", function (req, res) {
  const sql = "SELECT * FROM Std ORDER BY Id ASC";
  con.query(sql, function (err, results) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, count: results.length, data: results });
  });
});

// --- Search: GET students by Name (must be BEFORE /students/:id) ---
// Example: /students/search?name=John
app.get("/students/search", function (req, res) {
  const name = `%${req.query.name || ""}%`;
  const sql = "SELECT * FROM Std WHERE Name LIKE ? ORDER BY Id ASC";
  con.query(sql, [name], function (err, results) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, count: results.length, data: results });
  });
});

// --- Details: GET a single student by Id ---
app.get("/students/:id", function (req, res) {
  const sql = "SELECT * FROM Std WHERE Id = ?";
  con.query(sql, [req.params.id], function (err, results) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.length === 0)
      return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, data: results[0] });
  });
});

// --- Create: POST a new student ---
app.post("/students", function (req, res) {
  const { Id, Name, University, Email, Major, GPA } = req.body;
  if (!Id || !Name || !University || !Email) {
    return res
      .status(400)
      .json({ success: false, message: "Id, Name, University and Email are required" });
  }
  const sql =
    "INSERT INTO Std (Id, Name, University, Email, Major, GPA) VALUES (?, ?, ?, ?, ?, ?)";
  con.query(sql, [Id, Name, University, Email, Major || null, GPA || null], function (err) {
    if (err) {
      if (err.code === "ER_DUP_ENTRY")
        return res.status(409).json({ success: false, message: "Id already exists" });
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ success: true, message: "Student created", data: req.body });
  });
});

// --- Update: PUT an existing student by Id ---
app.put("/students/:id", function (req, res) {
  const { Name, University, Email, Major, GPA } = req.body;
  const sql =
    "UPDATE Std SET Name = ?, University = ?, Email = ?, Major = ?, GPA = ? WHERE Id = ?";
  con.query(
    sql,
    [Name, University, Email, Major || null, GPA || null, req.params.id],
    function (err, result) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ success: false, message: "Student not found" });
      res.json({ success: true, message: "Student updated", data: { Id: req.params.id, ...req.body } });
    }
  );
});

// --- Delete: DELETE a student by Id ---
app.delete("/students/:id", function (req, res) {
  const sql = "DELETE FROM Std WHERE Id = ?";
  con.query(sql, [req.params.id], function (err, result) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, message: "Student deleted", id: req.params.id });
  });
});

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Toyz backend listening at http://%s:%s", host, port);
});
