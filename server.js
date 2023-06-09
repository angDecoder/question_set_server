const express = require('express');
const cors = require('cors');
const pool = require('./dbconfig');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/check',async(req,res)=>{
    try {
        const result = await pool.query(`
        insert into challenge values('93q9jhei','angshudas012@gmail.com',50,'some new title');
        `);
        res.json({ msg : "done" });
    } catch (error) {
        console.log(error?.stack?.message);
        res.json({ error });
    }
});

app.use('/user',require('./routes/User'));
app.use('/challenge',require('./routes/Challenge'));
app.use('/question',require('./routes/Question'));

const startServer = async()=>{

    try {
        const res = await pool.query(`select 'connected to db' as sum`);
        app.listen(3500,async()=>{
            console.log(res.rows[0].sum);
            console.log('listening to port 3500');
        })
    } catch (error) {
        console.log(error);
        console.log('some error occured');
    }
}

startServer();