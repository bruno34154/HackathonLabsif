// config.js

module.exports = {
  database: {
    host: "localhost",
    user: "root",
    password: "sua-senha",
    database: "hackathondb",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
  jwtSecret: "sua-secrret-jwt",
};
