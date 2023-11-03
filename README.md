# api

![image](https://img.shields.io/badge/Digital_Ocean-Active-blue?logo=digitalocean&logoColor=white)

Esta API está disponível remotamente em [https://api-production-c82a.up.railway.app/](https://api-6hcvm.ondigitalocean.app/) ✨

---


Este projeto contém o código da API RESTful para comunicação da aplicação cliente do rolê com a base de dados SQL. Ele utiliza o framework [Express](https://expressjs.com/pt-br/) para a criação do servidor em uma instância do [Node.js](https://nodejs.org/en/) que se comunica com o banco de dados através do [mysql2](https://github.com/sidorares/node-mysql2).

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
DATABASE_URL= "mysql://USUARIO:SENHA@localhost:3306/role"

# A chave secreta para assinar o JWT – pode ser literalmente qualquer coisa
API_SECRET= "abcdef"
```

Para utilizar a API, basta enviar requisições HTTP para o endereço `http://localhost:3000/` com os parâmetros necessários para cada rota.

Abaixo está uma lista das rotas implementadas:

## Rotas

Para informações sobre autenticação, veja [Autenticação](#autenticação).

### `/user`

- ** GET`/user`** – Retorna os usuários cadastrados. Requer autenticação. Parâmetros:
    - q (string): Filtra os usuários por meio de uma string de busca
    - eventId (int): Inclui um campo indicando se o usuário está associado ao evento do ID especificado
- ** GET`/user/{event_id}`** – Retorna os usuários associados ao evento de ID `event_id`. Requer autenticação.
- ** PUT`/user`** – Atualiza os dados do usuário autenticado. Requer autenticação. Parâmetros de corpo:
    - nome (string): O novo nome do usuário
    - email (string): O novo email do usuário
- ** DELETE`/user`** – Deleta o usuário autenticado. Requer autenticação.

- ** POST`/user/image`** – Atualiza a imagem do usuário autenticado. Requer autenticação. Parâmetros de corpo:
    - image: A nova imagem do usuário, em formato multipart/form-data

- ** GET`/user/login`** – Retorna os dados do usuário autenticado. Requer autenticação.
- ** POST`/user/signin`** – Cria uma nova conta do usuário ou tenta realizar um login. Quando executada, manda um código de verificação para o email do usuário. Parâmetros de corpo:
    - email (string): O email do usuário
- ** POST`/user/verify`** – Verifica o código de verificação enviado para o email do usuário. Parâmetros de corpo:
    - email (string): O email do usuário
    - code (string): O código de verificação enviado para o email do usuário

### `/event`

- ** GET`/event/{event_id?}`** – Retorna os eventos cadastrados, ou o evento de ID `event_id` se especificado. Requer autenticação.
- ** GET`/event/{event_id}/items`** – Retorna os insumos associados ao evento de ID `event_id`. Requer autenticação.
- ** POST`/event`** – Cria um novo evento. Requer autenticação. Parâmetros de corpo:
    - name (string): O nome do evento
    - emoji (string): O emoji do evento
    - color1 (string): A cor primária do evento
    - color2 (string): A cor secundária do evento
- ** PUT`/event`** – Atualiza os dados do evento especificado. Requer autenticação. Parâmetros de corpo:
    - eventId (int): o ID do evento a ser atualizado
    - name (string): O novo nome do evento
    - emoji (string): O novo emoji do evento
    - color1 (string): A nova cor primária do evento
    - color2 (string): A nova cor secundária do evento
    - startDate (string): A nova data de início do evento
    - endDate (string): A nova data de fim do evento
- ** DELETE`/event/{event_id}`** – Deleta o evento de ID `event_id`. Requer autenticação.


### `/item`

router.get('/:item_id', verifyToken, getItem);
router.get('/:item_id/transactions', verifyToken, getTransactions);
router.post('/', verifyToken, postItem);
router.put('/', verifyToken, putItem);
router.delete('/:item_id', verifyToken, deleteItem);

- ** GET`/item/{item_id}`** – Retorna os dados do insumo de ID `item_id`. Requer autenticação.
- ** GET`/item/{item_id}/transactions`** – Retorna as transações associadas ao insumo de ID `item_id`. Requer autenticação.
- ** POST`/item`** – Cria um novo insumo. Requer autenticação. Parâmetros de corpo:
    - category (int): A categoria do insumo
    - name (string): O nome do insumo
    - notes (string): As notas do insumo
- ** PUT`/item`** – Atualiza os dados do insumo especificado. Requer autenticação. Parâmetros de corpo:
    - itemId (int): o ID do insumo a ser atualizado
    - category (int): A nova categoria do insumo
    - name (string): O novo nome do insumo
    - notes (string): As novas notas do insumo
- ** DELETE`/item/{item_id}`** – Deleta o insumo de ID `item_id`. Requer autenticação.


### `/transaction`

- ** GET`/transaction/{transaction_id}`** – Retorna os dados da transação de ID `transaction_id`. Requer autenticação.
- ** POST`/transaction`** – Cria uma nova transação. Requer autenticação. Parâmetros de corpo:
    - amount (double): O valor da transação
    - date (string): A data da transação
    - itemId (int): O ID do insumo associado à transação
    - newUserId (int): O ID do usuário associado à transação
- ** PUT`/transaction`** – Atualiza os dados da transação especificada. Requer autenticação. Parâmetros de corpo:
    - transactionId (int): o ID da transação a ser atualizada
    - amount (double): O valor da transação
    - date (string): A data da transação
    - newUserId (int): O ID do usuário associado à transação
- ** DELETE`/transaction/{transaction_id}`** – Deleta a transação de ID `transaction_id`. Requer autenticação.

## Autenticação

Para autenticar-se, é necessário enviar um token JWT no cabeçalho da requisição. Para obter um token, é necessário enviar uma requisição POST para a rota `/user/signin` com o email do usuário. Isso enviará um código de verificação para o email do usuário. Para verificar o código, é necessário enviar uma requisição POST para a rota `/user/verify` com o email e o código de verificação. Isso retornará um token JWT que pode ser utilizado para autenticar-se nas rotas que requerem autenticação.''

O cabeçalho deverá ter o seguinte formato:

```http
Content-Type: application/json
Authorization: Bearer <token>
```
