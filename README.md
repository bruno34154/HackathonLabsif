# Frontend

O front-end dessa aplicação permite o registro, login e gerenciamento de usuários, além do cadastro de posts em nossa home sendo separados pelos mais variados topico. Além disso ele possui integração com a api deste projeto e uma API do supabase para cadastro de posts.

## Pré-requisitos

Antes de executar o front desta aplicação verifique se você possui o seguinte instalado:

- Node.js
- alem de uma conta no site supabase.

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/bruno34154/Hackathon-labsif
```

2. Acesse a pasta do projeto no terminal e execute os seguintes comandos para instalar as dependências necessárias ao projeto

   ```bash
   npm install
   ```

## Configuração

1. Crie um arquivo .env e configure-o da seguinte forma:
   `REACT_APP_SUPERBASE_KEY=`

2- Para ter a superbasekey voçê teve pega-la no site [superbase.com](https://supabase.com/)

3. Execute o comando abaixo para iniciar a Aplicação (é necessario que antes de iniciar o frontend se inicie o backend da aplicação tambem)

```bash
    npm start
```

4. Acesse a aplicação em http://localhost:3000

# Backend

Bem-vindo à API do sistema Hackaton! Esta API permite o registro, login e gerenciamento de usuários, além de upload de fluxogramas. Além disso, oferece funcionalidades para redefinição de senha em caso de perda.

## Sumário

- [Minha API Hackaton](#minha-api-hackaton)
  - [Sumário](#sumário)
  - [Visão Geral](#visão-geral)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração](#configuração)
  - [Endpoints](#endpoints)
    - [Registro do usuário](#registro-do-usuário)
    - [Resposta de Sucesso:](#resposta-de-sucesso)
    - [Login do usuário](#login-do-usuário)
    - [Resposta de Sucesso:](#resposta-de-sucesso-1)

## Visão Geral

A API Hackaton é uma aplicação backend que fornece funcionalidades de autenticação, gerenciamento de usuários e upload de fluxogramas para um sistema Hackaton. Ela permite que os usuários se registrem, façam login, enviem fluxogramas e redefinam suas senhas em caso de esquecimento.

## Pré-requisitos

Antes de executar a API, verifique se você possui o seguinte instalado:

- Node.js
- MySQL

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/T3lo5/hackaton
```

2. Acesse a pasta do projeto no terminal e execute os seguintes comandos para instalar as dependências necessárias ao projeto

   ```bash
   npm install
   ```

## Configuração

1. Configure o banco de dados MySQL em "config.js"

```javascript
// config.js

module.exports = {
  database: {
    host: "localhost",
    user: "root",
    password: "sua-senha",
    database: "hackaton-db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
  jwtSecret: "seu-segredo-jwt",
};
```

2. Execute o script "database.sql" para criar o banco de dados e as tabelas necessárias
3. Execute o comando abaixo para iniciar a API

```bash
    npm start
```

4. Acesse a API em http://localhost:3001

## Endpoints

### Registro do usuário

- URL: /auth/register
- Método: POST
- Parâmetros do Corpo:
- username (string): Nome de usuário do novo usuário.
- password (string): Senha do novo usuário.
- email (string): Email do novo usuário.

### Resposta de Sucesso:

Status: 201

```json
    message: 'User registered successfully'
```

### Login do usuário

- URL: /auth/login
- Metodo: POST
- Parâmetros do Corpo:

1. username (string): Nome de usuário do usuário.
2. password (string): Senha do usuário.

### Resposta de Sucesso:

- Status: 200
  ```json
   message: 'Login successful', token: 'seu-token-jwt'
  ```

## Redefinir senha

- URL: /auth/forgot-password
- Metodo: POST
- Parametros do corpo
  1. email (string): Email do usuário que esqueceu a senha.

### Resposta de Sucesso:

Status: 200

```json
    message: 'Password reset email sent'
```
