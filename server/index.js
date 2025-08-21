import express from 'express';
import {router} from "./route.js";
import cors  from 'cors';
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
const mongoURI ='mongodb://localhost:27017/'
mongoose.connect(mongoURI,{
    useNewUrlParser:true,useUnifiedTopology:true}).then(()=>console.log('mongodb Connected')).catch(err=>console.error('connection error'))

const app = express();

const PORT=8000


app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send({message:'Hello from server side'});
});


app.use('/',router);
app.use('/api/auth',authRoutes)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}\n`);
})