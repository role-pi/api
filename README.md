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
DATABASE_URL= "mysql://USUARIO:SENHA@localhost:3306/role"

# A chave secreta para assinar o JWT – pode ser literalmente qualquer coisa
API_SECRET= "abcdef"
```

Para utilizar a API, basta enviar requisições HTTP para o endereço `http://localhost:3000/` com os parâmetros necessários para cada rota.

Abaixo está uma lista das rotas implementadas:

## Rotas

- **/** – Retorna uma mensagem de boas-vindas.

### `/user`

- GET **`/user`** – Retorna os usuários cadastrados. Requer autenticação. Parâmetros:
    - q: Filtra os usuários por meio de uma string de busca
    - eventId: Inclui um campo indicando se o usuário está associado ao evento do ID especificado
- GET **`/user/{event_id}`** – Retorna os usuários associados ao evento de ID `event_id`. Requer autenticação.
- PUT **`/user`** – Atualiza os dados do usuário autenticado. Requer autenticação. Parâmetros de corpo:
    - nome: O novo nome do usuário
    - email: O novo email do usuário
- DELETE **`/user`** – Deleta o usuário autenticado. Requer autenticação.

- POST **`/user/image`** – Atualiza a imagem do usuário autenticado. Requer autenticação. Parâmetros de corpo:
    - image: A nova imagem do usuário, em formato multipart/form-data

- GET **`/user/login`** – Retorna os dados do usuário autenticado. Requer autenticação.
- POST **`/user/signin`** – Cria uma nova conta do usuário ou tenta realizar um login. Quando executada, manda um código de verificação para o email do usuário. Parâmetros de corpo:
    - email: O email do usuário
- POST **`/user/verify`** – Verifica o código de verificação enviado para o email do usuário. Parâmetros de corpo:
    - email: O email do usuário
    - code: O código de verificação enviado para o email do usuário

### `/event`

router.get('/:id_evento?', verifyToken, getEvents);
router.get('/:id_evento/insumos', verifyToken, getItems);
router.post('/', verifyToken, postEvent);
router.put('/', verifyToken, putEvent);
router.delete('/:id_evento', verifyToken, deleteEvent);

- GET **`/event/{event_id?}`** – Retorna os eventos cadastrados, ou o evento de ID `event_id` se especificado. Requer autenticação.
- GET **`/event/{event_id}/items`** – Retorna os insumos associados ao evento de ID `event_id`. Requer autenticação.
- POST **`/event`** – Cria um novo evento. Requer autenticação. Parâmetros de corpo:
    - nome: O nome do evento
    - emoji: O emoji do evento
    - cor1: A cor primária do evento
    - cor2: A cor secundária do evento
- PUT **`/event`** – Atualiza os dados do evento especificado. Requer autenticação. Parâmetros de corpo:
    - eventId: o ID do evento a ser atualizado
    - nome: O novo nome do evento
    - emoji: O novo emoji do evento
    - cor1: A nova cor primária do evento
    - cor2: A nova cor secundária do evento
    - dataInicio: A nova data de início do evento
    - dataFim: A nova data de fim do evento
- DELETE **`/event/{event_id}`** – Deleta o evento de ID `event_id`. Requer autenticação.


Se a API foi inicializada corretamente, você poderá, por exemplo, listar todos os usuários do primeiro evento com `http://localhost:3000/usuarios?eventId=1` no próprio navegador.
