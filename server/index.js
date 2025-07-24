import express from 'express';
import {router} from "./route.js";
import cors  from 'cors';

const app = express();

const PORT=8000


app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send({message:'Hello from server side'});
});


app.use('/',router);

console.log("hai from server side");

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}\n`);
})