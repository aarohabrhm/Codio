import express from 'express';
import {router} from "./route.js";
import cors  from 'cors';
import mongoose from 'mongoose';
import { register,login } from './controllers/authcontroller.js';
import authRoutes from './routes/auth.js'
import path from 'path'; c
import { fileURLToPath } from 'url';
import projectsRouter from './routes/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const mongoURI ='mongodb://localhost:27017/'
mongoose.connect(mongoURI,{
    useNewUrlParser:true,useUnifiedTopology:true}).then(()=>console.log('mongodb Connected')).catch(err=>console.error('connection error'))

const app = express();

const PORT=8000


app.use(cors());
app.use(express.json());

app.use('/avatar', express.static(path.join(__dirname, 'avatar')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/',(req,res)=>{
    res.send({message:'Hello from server side'});
});
app.use('/project-covers', express.static(path.join(__dirname, 'project-covers')));


app.use('/',router);
app.use('/api/auth',authRoutes)
app.use('/api/projects', projectsRouter);


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}\n`);
})