const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "Ovdje unijeti korisnika",
  host: "localhost",
  database: "proba",
  password: "Ovdje unijeti lozinku",
  port: 5432,
});

app.use(express.static(path.join(__dirname, "build")));

// Get all flights
app.get("/letovi", async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT 
      let.let_id, 
      let.vrijeme_polaska, 
      let.trajanje, 
      let.cijena, 
      zrakoplov.model AS zrakoplov_model, 
      pista.pista_id, 
      odrediste.grad AS odrediste_grad
    FROM let
    JOIN zrakoplov ON let.zrakoplov_id = zrakoplov.zrakoplov_id
    JOIN pista ON let.pista_id = pista.pista_id
    JOIN odrediste ON let.odrediste_id = odrediste.odrediste_id;
  `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get a specific flight by ID
app.get("/let/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM let WHERE let_id = $1", [
      id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all aircraft
app.get("/zrakoplovi", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM zrakoplov");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all destinations
app.get("/odredista", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM odrediste");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all runways
app.get("/piste", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pista");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Create a new flight
app.post("/let", async (req, res) => {
  try {
    const {
      vrijeme_polaska,
      trajanje,
      cijena,
      zrakoplov_id,
      pista_id,
      odrediste_id,
      administrator_id,
    } = req.body;
    const result = await pool.query(
      "INSERT INTO let (vrijeme_polaska, trajanje, cijena, zrakoplov_id, pista_id, odrediste_id, administrator_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        vrijeme_polaska,
        trajanje,
        cijena,
        zrakoplov_id,
        pista_id,
        odrediste_id,
        administrator_id,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update a flight
app.put("/let/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vrijeme_polaska,
      trajanje,
      cijena,
      zrakoplov_id,
      pista_id,
      odrediste_id,
      administrator_id,
    } = req.body;
    const result = await pool.query(
      "UPDATE let SET vrijeme_polaska = $1, trajanje = $2, cijena = $3, zrakoplov_id = $4, pista_id = $5, odrediste_id = $6, administrator_id = $7 WHERE let_id = $8 RETURNING *",
      [
        vrijeme_polaska,
        trajanje,
        cijena,
        zrakoplov_id,
        pista_id,
        odrediste_id,
        administrator_id,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete a flight
app.delete("/let/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting flight with id: ${id}`);

    const result = await pool.query(
      "DELETE FROM let WHERE let_id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
