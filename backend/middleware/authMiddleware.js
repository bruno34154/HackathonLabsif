const jwt = require('jsonwebtoken');
const config = require('../config'); 

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token'); // Obtenha o token do header da solicitação

  if (!token) {
    return res.status(401).json({ message: 'Token not found, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret); // Verifique o token usando a chave secreta do JWT
    req.user = decoded.user; // Defina as informações do usuário em req.user
    next(); // Continue para a próxima função de middleware ou rota
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
