# Desafio Técnico - AlfamaWeb (Landing Page)

Este repositório contém a solução para o teste técnico de **Desenvolvedor**, consistindo no desenvolvimento de uma Landing Page responsiva com formulário de contato funcional.

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido seguindo estritamente os requisitos técnicos solicitados:

* **HTML5 & CSS3** (Semântico e organizado)
* **Bootstrap 5.x** (Framework CSS principal)
* **JavaScript** (Manipulação do DOM, máscaras e requisições AJAX)
* **PHP** (Backend para processamento de e-mail)
* **PHPMailer** (Biblioteca para envio seguro de e-mails via SMTP)

## 🐳 Como rodar o projeto

Este projeto utiliza Docker para garantir compatibilidade e facilidade de execução.

### Passo a passo

1.  **Configuração de Ambiente:**
    Para que o formulário de contato funcione (envio de e-mail), é necessário configurar as credenciais SMTP.
    
    ```bash
    cp .env.example .env
    # Abra o arquivo .env e adicione seu e-mail e senha de app do Gmail.
    ```

2.  **Executar:**
    Na raiz do projeto, execute:
    ```bash
    docker-compose up --build
    ```
    ou
    ```bash
    docker compose up --build
    ```

3.  **Acessar:**
    Abra o navegador em: [http://localhost:8080](http://localhost:8080)

## 📂 Estrutura do Projeto

A organização de pastas segue o padrão solicitado na especificação:

```text
/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js (Lógica do formulário e máscaras)
│   ├── images/
│   └── libs/
│       ├── bootstrap/
│       └── bootstrap-icons-1.13.1/
├── mail/
│   ├── mail.php (Script de envio)
│   └── PHPMailer/ (Dependências do PHPMailer)
└── index.html