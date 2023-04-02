const { Pool } = require('pg');

// const pool = new Pool({
//     user : 'postgres',
//     password : 'MNTRuiP8xDukDpGsVBfQ',
//     host : 'containers-us-west-21.railway.app',
//     port : 5626,
//     database : 'railway'
// })
const pool = new Pool({
    user : 'postgres',
    password : '1234',
    host : 'localhost',
    port : 5432,
    database : 'question_set'
})

module.exports = pool;

// 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