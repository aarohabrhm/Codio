import express from 'express';
import {router} from "./route.js";
import cors  from 'cors';
import mongoose from 'mongoose';
import { register,login } from './controllers/authcontroller.js';
import authRoutes from './routes/auth.js'
import path from 'path'; 
import { fileURLToPath } from 'url';
import projectsRouter from './routes/projects.js';
import { setupWebSocket } from './websocket/collaborationServer.js';
import http from 'http';
import projectRoutes from "./routes/projectRoutes.js";
import executeRouter from './routes/execute.js';
import chatRoutes from "./routes/chatRoutes.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const mongoURI ='mongodb://localhost:27017/'
mongoose.connect(mongoURI,{
    useNewUrlParser:true,useUnifiedTopology:true}).then(()=>console.log('mongodb Connected')).catch(err=>console.error('connection error'))

const app = express();

const PORT=8000
const server = http.createServer(app);
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use("/api/chat", chatRoutes);

app.use(express.json());
app.use("/api/execute", executeRouter);
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use('/avatar', express.static(path.join(__dirname, 'avatar')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/',(req,res)=>{
    res.send({message:'Hello from server side'});
});
app.use('/project-covers', express.static(path.join(__dirname, 'project-covers')));

setupWebSocket(server);
app.use('/',router);
app.use('/api/auth',authRoutes)
app.use('/api/projects', projectsRouter);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`WebSocket server ready at ws://localhost:${PORT}/ws/collab`);
});
/*app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}\n`);
})*/