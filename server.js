const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.get('/check',(req,res)=>{
    res.json({ msg : "done" });
});

app.route('/user',require('./routes/User'));


app.listen(3000,()=>{
    console.log('listening to port 3000');
})