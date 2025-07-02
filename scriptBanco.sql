CREATE DATABASE grupagem DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;
USE grupagem;
-- Grupos
CREATE TABLE grupos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

-- Pessoas
CREATE TABLE pessoas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  grupo_id INT NOT NULL,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
);

-- Despesas
CREATE TABLE despesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  responsavel_id INT NOT NULL,
  grupo_id INT NOT NULL,
  FOREIGN KEY (responsavel_id) REFERENCES pessoas(id) ON DELETE CASCADE,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
);

-- Pagamentos (SEM despesa_id, AGORA com grupo_id)
CREATE TABLE pagamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  de INT NOT NULL,
  para INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  grupo_id INT NOT NULL,
  FOREIGN KEY (de) REFERENCES pessoas(id) ON DELETE CASCADE,
  FOREIGN KEY (para) REFERENCES pessoas(id) ON DELETE CASCADE,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
);