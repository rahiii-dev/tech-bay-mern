import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import dotenv from 'dotenv';
if(process.env.NODE_ENV == 'developement'){
    dotenv.config(); 
}

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.get('/', (req, res) => res.json('Server is ready'));

app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}/`));