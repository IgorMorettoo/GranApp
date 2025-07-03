-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS grupagem
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE grupagem;

-- Tabela de grupos
CREATE TABLE IF NOT EXISTS grupos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

-- Tabela de pessoas
CREATE TABLE IF NOT EXISTS pessoas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  grupo_id INT NOT NULL,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
);

-- Tabela de despesas
CREATE TABLE IF NOT EXISTS despesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  responsavel_id INT NOT NULL,
  grupo_id INT NOT NULL,
  FOREIGN KEY (responsavel_id) REFERENCES pessoas(id) ON DELETE CASCADE,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
);

-- Tabela de divisão de despesas
CREATE TABLE IF NOT EXISTS divisao_despesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  despesa_id INT NOT NULL,
  pessoa_id INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (despesa_id) REFERENCES despesas(id) ON DELETE CASCADE,
  FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  de INT NOT NULL,
  para INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  grupo_id INT NOT NULL,
  FOREIGN KEY (de) REFERENCES pessoas(id) ON DELETE CASCADE,
  FOREIGN KEY (para) REFERENCES pessoas(id) ON DELETE CASCADE,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
);

-- Tabela de saldos
CREATE TABLE IF NOT EXISTS saldos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grupo_id INT NOT NULL,
  devedor_id INT NOT NULL,
  credor_id INT NOT NULL,
  saldo DECIMAL(10,2) NOT NULL,
  UNIQUE KEY uq_saldo (grupo_id, devedor_id, credor_id),
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (devedor_id) REFERENCES pessoas(id) ON DELETE CASCADE,
  FOREIGN KEY (credor_id) REFERENCES pessoas(id) ON DELETE CASCADE
);
