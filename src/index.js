import express from 'express';
import dotenv from 'dotenv';

import user from './routes/user.js';
import event from './routes/event.js';
import item from './routes/item.js';
import transaction from './routes/transaction.js';

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const port = process.env.PORT || 3000;

app.listen(port);
console.log('API funcionando em '+port);

app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

app.use('/user', user);
app.use('/event', event);
app.use('/item', item);
app.use('/transaction', transaction);