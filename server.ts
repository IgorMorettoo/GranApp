import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import type { RowDataPacket, OkPacket } from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

// ==== Configuração do banco ====
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "grupagem",
});

// ==== Rotas GRUPOS ====
app.get("/api/grupos", async (_req, res) => {
  const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM grupos");
  res.json(rows);
});

app.get("/api/grupos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM grupos WHERE id = ?",
    [id]
  );
  res.json(rows[0]);
});

app.post("/api/grupos", async (req, res) => {
  const { nome } = req.body;
  const [result] = await db.query<OkPacket>(
    "INSERT INTO grupos (nome) VALUES (?)",
    [nome]
  );
  res.status(201).json({ id: result.insertId, nome });
});

app.put("/api/grupos/:id", async (req, res) => {
  const { nome } = req.body;
  const id = Number(req.params.id);
  await db.query(
    "UPDATE grupos SET nome = ? WHERE id = ?",
    [nome, id]
  );
  res.json({ id, nome });
});

app.delete("/api/grupos/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.query("DELETE FROM grupos WHERE id = ?", [id]);
  res.sendStatus(204);
});

// ==== Rotas PESSOAS ====
app.get("/api/pessoas", async (req, res) => {
  const grupo_id = Number(req.query.grupo_id);
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM pessoas WHERE grupo_id = ?",
    [grupo_id]
  );
  res.json(rows);
});

app.post("/api/pessoas", async (req, res) => {
  const { nome, grupo_id } = req.body;
  const [result] = await db.query<OkPacket>(
    "INSERT INTO pessoas (nome, grupo_id) VALUES (?, ?)",
    [nome, grupo_id]
  );
  res.status(201).json({ id: result.insertId, nome, grupo_id });
});

app.put("/api/pessoas/:id", async (req, res) => {
  const { nome } = req.body;
  const id = Number(req.params.id);
  await db.query(
    "UPDATE pessoas SET nome = ? WHERE id = ?",
    [nome, id]
  );
  res.json({ id, nome });
});

app.delete("/api/pessoas/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.query("DELETE FROM pessoas WHERE id = ?", [id]);
  res.sendStatus(204);
});

// ==== Rotas DESPESAS ====
app.get("/api/despesas", async (req, res) => {
  const grupo_id = Number(req.query.grupo_id);
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM despesas WHERE grupo_id = ?",
    [grupo_id]
  );
  res.json(rows);
});

app.post("/api/despesas", async (req, res) => {
  const { descricao, valor, responsavel_id, grupo_id } = req.body;
  const [result] = await db.query<OkPacket>(
    "INSERT INTO despesas (descricao, valor, responsavel_id, grupo_id) VALUES (?, ?, ?, ?)",
    [descricao, valor, responsavel_id, grupo_id]
  );
  res.status(201).json({ id: result.insertId, descricao, valor, responsavel_id, grupo_id });
});

app.put("/api/despesas/:id", async (req, res) => {
  const { descricao, valor } = req.body;
  const id = Number(req.params.id);
  await db.query(
    "UPDATE despesas SET descricao = ?, valor = ? WHERE id = ?",
    [descricao, valor, id]
  );
  res.json({ id, descricao, valor });
});

app.delete("/api/despesas/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.query("DELETE FROM despesas WHERE id = ?", [id]);
  res.sendStatus(204);
});

// ==== Rotas PAGAMENTOS ====
app.get("/api/pagamentos", async (req, res) => {
  const grupo_id = Number(req.query.grupo_id);
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM pagamentos WHERE grupo_id = ?",
    [grupo_id]
  );
  res.json(rows);
});

app.post("/api/pagamentos", async (req, res) => {
  const { de, para, valor, grupo_id } = req.body;
  const [result] = await db.query<OkPacket>(
    "INSERT INTO pagamentos (de, para, valor, grupo_id) VALUES (?, ?, ?, ?)",
    [de, para, valor, grupo_id]
  );
  res.status(201).json({ id: result.insertId, de, para, valor, grupo_id });
});

app.delete("/api/pagamentos/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.query("DELETE FROM pagamentos WHERE id = ?", [id]);
  res.sendStatus(204);
});

// ==== Inicialização ====
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});