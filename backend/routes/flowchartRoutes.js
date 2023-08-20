const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const upload = multer({ dest: 'uploads/' });

module.exports = (connection) => {
  // Endpoint de upload de fluxograma
  router.post('/upload', authMiddleware, upload.single('flowchartImage'), (req, res) => {
    // Extrair informações da solicitação
    const userId = req.user.id; // Supondo que o usuário esteja autenticado e você tenha o ID do usuário na req.user
    const subject = req.body.subject; // Matéria associada ao fluxograma
    const filePath = req.file.path; // Caminho da imagem no servidor

    // Salvar as informações na tabela de fluxogramas
    const sql = 'INSERT INTO Flowcharts (user_id, subject, file_path) VALUES (?, ?, ?)';
    connection.query(sql, [userId, subject, filePath], (err, result) => {
      if (err) {
        console.error('Error uploading flowchart:', err);
        res.status(500).json({ error: 'Error uploading flowchart' });
      } else {
        res.status(200).json({ message: 'Flowchart uploaded successfully' });
      }
    });
  });

  return router;
};
