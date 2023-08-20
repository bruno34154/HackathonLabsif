const express = require("express");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql2/promise");
const config = require("./config");
const authRoutes = require("./routes/auth");
const flowchartRoutes = require("./routes/flowchartRoutes");
const criarTabela = require("./migration/migrations");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Configuração do MySQL
const pool = mysql.createPool(config.database);

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database");
    connection.release();
    //await criarTabela(pool); // Chama a função criarTabela após a conexão ser estabelecida

    // Rotas de autenticação
    app.use("/auth", authRoutes);

    // Passe a conexão para as rotas de fluxograma
    app.use("/flowcharts", flowchartRoutes(connection));

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
})();
