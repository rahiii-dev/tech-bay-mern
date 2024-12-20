import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import dotenv from 'dotenv';
import serverConfig from './config/serverConfig.js';
import { DbConnect } from './config/dbConfig.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
if(process.env.NODE_ENV != 'production'){
    dotenv.config(); 
}
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import morgan from 'morgan';

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

const allowedOrigins = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(',')
  : ['http://localhost:3000'];

console.log("Allowed Origins: ", allowedOrigins);

app.use(cors({
    origin : allowedOrigins,
    credentials : true,
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth/', authRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/admin/', adminRoutes);

app.get('/', (req, res) => res.json('TechBay server is ready for actions 🚀'));

app.use(notFoundHandler);
app.use(errorHandler)

// DB
DbConnect()

app.listen(serverConfig.port, () => console.log(`Server started on port http://${serverConfig.hostname()}/`));