import express from 'express';
import dotenv from 'dotenv';

import usuario from './routes/usuario.js';
import evento from './routes/evento.js';
import insumo from './routes/insumo.js';


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

app.use('/usuario', usuario);
app.use('/evento', evento);
app.use('/insumo', insumo);