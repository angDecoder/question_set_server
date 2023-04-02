const express = require('express');
const cors = require('cors');
const pool = require('./dbconfig');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/check',(req,res)=>{
    res.json({ msg : "done" });
});

app.use('/user',require('./routes/User'));

const startServer = async()=>{

    try {
        const res = await pool.query(`select 'connected to db' as sum`);
        app.listen(3500,async()=>{
            console.log(res.rows[0].sum);
            console.log('listening to port 3500');
        })
    } catch (error) {
        console.log('some error occured');
    }
}

startServer();