# api

![image](https://img.shields.io/badge/Railway-Active-success?logo=railway&logoColor=white)

**✨ Esta API está disponível remotamente em https://api-production-c82a.up.railway.app/.**

---


Esse projeto contém o código da API RESTful para comunicação da aplicação cliente do rolê com a base de dados SQL. Ele utiliza o framework [Express](https://expressjs.com/pt-br/) para a criação do servidor em uma instância do [Node.js](https://nodejs.org/en/) que se comunica com o banco de dados através do [mysql2](https://github.com/sidorares/node-mysql2).

## Instalação

Antes de clonar este repositório, é necessário ter instalado o [Node.js](https://nodejs.org/en/) e o [npm](https://www.npmjs.com/) em sua máquina. Explicando essencialmente, o node é uma plataforma que permite a execução de código JavaScript fora do navegador, e o npm é um gerenciador de pacotes para o node. Para instalar o node, basta baixar o instalador no site oficial e seguir as instruções. O npm já vem instalado junto com o node.

Após clonar, para instalar as dependências do projeto, basta executar o comando `npm install` na pasta raiz do projeto.

Para executar o projeto, basta executar o comando `npm start` na pasta raiz do projeto.

## Uso

O mysql2 utiliza os dados já existentes das instâncias do MySQL locais em sua máquina para se conectar ao banco de dados. Para que a API funcione corretamente, é necessário que o MySQL esteja instalado e que as instâncias estejam rodando – além disso, certifique-se que o banco de dados esteja criado e configurado corretamente de acordo com o repositório [sql](https://github.com/role-pi/sql).

Antes de executá-lo, crie um arquivo [.env] no diretório raíz do projeto com as seguintes informações, substituindo USUARIO, SENHA e PORTA com as suas credenciais e porta da instância do MySQL.

```env
# A porta para a API
PORT= 3000
 
# O endereço da base de dados
DATABASE= "mysql://USUARIO:SENHA@localhost:PORTA/role"
```

Para utilizar a API, basta enviar requisições HTTP para o endereço `http://localhost:3000/` com os parâmetros necessários para cada rota.

Abaixo está uma lista das rotas já implementadas e seus respectivos parâmetros, junto de rotas que ainda serão implementadas:

### GET
- [x] **/** – Retorna uma mensagem de boas-vindas.
- [x] **/usuarios** – Retorna todos os usuários cadastrados. Parâmetros:
    - idEvento: retorna usuários associados ao evento
- [x] **/eventos** – Retorna todos os eventos cadastrados. Parâmetros:
    - idUsuario: retorna eventos associados ao usuário

Se a API foi inicializada corretamente, você poderá, por exemplo, listar todos os usuários do primeiro evento com `http://localhost:3000/usuarios?idEvento=1` no próprio navegador.
