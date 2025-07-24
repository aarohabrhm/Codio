import express from 'express';

const app = express();

const PORT=8000

app.get('/',(req,res)=> {
    res.send('Hello W')
});
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}\n`);
})