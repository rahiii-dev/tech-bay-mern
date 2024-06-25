import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import dotenv from 'dotenv';
import serverConfig from './config/serverConfig.js';
import { DbConnect } from './config/dbConfig.js';
if(process.env.NODE_ENV != 'production'){
    dotenv.config(); 
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.get('/', (req, res) => res.json('Server is ready'));

// DB
DbConnect()

app.listen(serverConfig.port, serverConfig.host, () => console.log(`Server started on port http://${serverConfig.hostname()}/`));