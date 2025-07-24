import express from 'express';
import {router} from "./route.js";

const app = express();

const PORT=8000


app.get('/',(req,res)=>{
    res.send('This is HomePage');
});


app.use('/',router)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}\n`);
})