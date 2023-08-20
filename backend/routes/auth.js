const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const config = require("../config");

const router = express.Router();
const connection = mysql.createConnection(config.database);

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Verificar se o usuário já existe
    console.log(username);
    const [existingUser] = await connection
      .promise()
      .query("SELECT id FROM Users WHERE username = ?", [username]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash da senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir usuário no banco de dados, incluindo o email
    await connection
      .promise()
      .query("INSERT INTO Users (username, password, email) VALUES (?, ?, ?)", [
        username,
        hashedPassword,
        email,
      ]);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar se o usuário existe
    const [user] = await connection
      .promise()
      .query("SELECT id, password FROM Users WHERE username = ?", [username]);

    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Gere um token JWT e envie-o como resposta
    const payload = {
      user: {
        id: user[0].id,
      },
    };

    jwt.sign(payload, config.jwtSecret, { expiresIn: "24h" }, (err, token) => {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "Login successful", token });
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar se o usuário com o e-mail fornecido existe
    const [user] = await connection
      .promise()
      .query("SELECT id FROM Users WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Gerar um token de redefinição de senha e inseri-lo na tabela ResetTokens
    const token = crypto.randomBytes(20).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // Token válido por 1 hora
    await connection
      .promise()
      .query(
        "INSERT INTO ResetTokens (user_id, token, expires_at) VALUES (?, ?, ?)",
        [user[0].id, token, expiresAt]
      );

    // Enviar um e-mail com o link de redefinição contendo o token
    // Aqui você pode usar um serviço de envio de e-mails como o Nodemailer

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error during password reset request:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verificar se o token é válido e não expirou
    const [resetToken] = await connection
      .promise()
      .query("SELECT user_id, expires_at FROM ResetTokens WHERE token = ?", [
        token,
      ]);

    if (
      !resetToken ||
      resetToken.length === 0 ||
      resetToken[0].expires_at < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar a senha do usuário
    await connection
      .promise()
      .query("UPDATE Users SET password = ? WHERE id = ?", [
        hashedPassword,
        resetToken[0].user_id,
      ]);

    // Remover o token de redefinição
    await connection
      .promise()
      .query("DELETE FROM ResetTokens WHERE token = ?", [token]);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
