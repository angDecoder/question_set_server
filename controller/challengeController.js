const pool = require('../dbconfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
require('dotenv').config();

const getAllChallenges = async(req,res)=>{
    const { email } = req.headers;
    
    if( !email ){
        res.status(400).json({ message : "email is required" });
        return;
    }

    try {
        const result = await pool.query(`
            SELECT C.TITLE,C.TOTAL,C.ID
            FROM USER_TO_CHALLENGE U
            INNER JOIN CHALLENGE C ON C.ID = U.CHALLENGE_ID
            WHERE U.USER_ID = $1;
        `,[email]);

        res.status(200).json({
            result : result.rows
        })
    } catch (error) {
        res.status(400).json({ message : "some error occured" });
    }
}

const addNewChallenge = async(req,res)=>{
    res.json({ msg : 'ok' });
    const { owner,title } = req.body;
    if( !owner || !title ){
        res.status(400).json({ message : "owner and title is required" });
        return;
    }
}

module.exports = {
    addNewChallenge,
    getAllChallenges
}