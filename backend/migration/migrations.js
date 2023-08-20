async function criarTabelas(pool) {
    try {
      const tabelas = [
        {
          nome: 'Users',
          query: `
          CREATE TABLE Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL
          )
          `,
          params: []
        },
        {
          nome: 'Flowcharts',
          query: `
          CREATE TABLE Flowcharts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            subject VARCHAR(100) NOT NULL,
            file_path VARCHAR(255) NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(id)
          )
          `,
          params: []
        },
        {
          nome: 'ResetTokens',
          query: `
          CREATE TABLE ResetTokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(id)
          )
          `,
          params: []
        }
      ];
  
      for (let i = 0; i < tabelas.length; i++) {
        const tabela = tabelas[i];
        try {
          await pool.query(tabela.query, tabela.params);
          console.log(`Tabela ${tabela.nome} criada com sucesso`);
        } catch (error) {
          console.log(`Erro ao criar tabela ${tabela.nome}: ${error}`);
        }
      }
    } catch (error) {
      console.log(`Erro ao criar tabelas: ${error}`);
    }
  }
  
  module.exports = criarTabelas;
  