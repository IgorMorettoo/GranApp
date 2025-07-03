// server.ts
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import type { RowDataPacket, OkPacket } from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "grupagem",
});

// ==== GRUPOS ====
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

// ==== PESSOAS ====
app.get("/api/pessoas", async (req, res) => {
  const grupo_id = Number(req.query.grupo_id);
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM pessoas WHERE grupo_id = ?",
    [grupo_id]
  );
  res.json(rows);
});

app.get("/api/todas-pessoas", async (_req, res) => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, nome FROM pessoas"
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

// ==== DESPESAS ====
app.get("/api/despesas", async (req, res) => {
  const grupo_id = Number(req.query.grupo_id);
  const [despesas] = await db.query<RowDataPacket[]>(
    `SELECT id, descricao, valor, responsavel_id AS responsavelId, grupo_id
     FROM despesas WHERE grupo_id = ?`,
    [grupo_id]
  );

  const despesasComDivisao = await Promise.all(
    despesas.map(async (d) => {
      const [divisoes] = await db.query<RowDataPacket[]>(
        `SELECT pessoa_id AS pessoaId, valor
         FROM divisao_despesas WHERE despesa_id = ?`,
        [d.id]
      );
      return { ...d, divisao: divisoes };
    })
  );

  res.json(despesasComDivisao);
});

app.post("/api/despesas", async (req, res) => {
  const { descricao, valor, responsavel_id, grupo_id, divisao } = req.body;
  const [result] = await db.query<OkPacket>(
    `INSERT INTO despesas (descricao, valor, responsavel_id, grupo_id)
     VALUES (?, ?, ?, ?)`,
    [descricao, valor, responsavel_id, grupo_id]
  );

  const despesaId = result.insertId;

  if (Array.isArray(divisao)) {
    for (const div of divisao) {
      await db.query(
        `INSERT INTO divisao_despesas (despesa_id, pessoa_id, valor)
         VALUES (?, ?, ?)`,
        [despesaId, div.pessoaId, div.valor]
      );

      // Só cria saldo se não for ele mesmo
      if (div.pessoaId !== responsavel_id) {
        await db.query(
          `INSERT INTO saldos (grupo_id, devedor_id, credor_id, saldo)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE saldo = saldo + VALUES(saldo)`,
          [grupo_id, div.pessoaId, responsavel_id, div.valor]
        );
      }
    }
  }

  res.status(201).json({
    id: despesaId,
    descricao,
    valor,
    responsavelId: responsavel_id,
    grupo_id,
    divisao: divisao ?? [],
  });
});

// ==== PAGAMENTOS ====
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

  await db.query(
    `INSERT INTO saldos (grupo_id, devedor_id, credor_id, saldo)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE saldo = saldo - VALUES(saldo)`,
    [grupo_id, de, para, valor]
  );

  res.status(201).json({
    id: result.insertId,
    de,
    para,
    valor,
    grupo_id,
  });
});

// ==== SALDOS ====
app.get("/api/saldos", async (req, res) => {
  const grupo_id = Number(req.query.grupo_id);
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT devedor_id AS devedor, credor_id AS credor, saldo
     FROM saldos
     WHERE grupo_id = ? AND ABS(saldo) > 0.01`,
    [grupo_id]
  );
  res.json(rows);
});

// ==== Inicialização ====
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
