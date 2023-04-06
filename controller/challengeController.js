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
            SELECT C.ID,C.TITLE,C.TOTAL,U.SOLVED,C.OWNER
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
    const { email } = req.headers;
    const { title } = req.body;

    if( !email || !title ){
        res.status(400).json({ message : "email and title are required" });
        return;
    }

    try {
        const result = await pool.query(`
            INSERT INTO CHALLENGE(ID,OWNER,TITLE)
            VALUES($1,$2,$3)
            RETURNING *;
        `,[randomUUID(),email,title]);

        res.status(201).json({
            message : "new challenge added",
            challenge : result?.rows[0]
        });
    } catch (error) {
        res.status(400).json({ message : "some error occured",error });
    }
}

const deleteChallenge = async(req,res)=>{
    const { email } = req.headers;
    const id = req?.params?.id;
    
    if( !id || !email ){
        res.status(200).json({ message : "email and challenge id are required" });
        return;
    }

    try {
        await pool.query(`      
            DELETE
            FROM USER_TO_CHALLENGE
            WHERE USER_ID = $1
            AND CHALLENGE_ID = $2;
        `,[email,id]);

        res.json({ message : "challenge deleted successfully" });
    } catch (error) {
        res.json({ message : "some error occured",error });
    }
}

module.exports = {
    addNewChallenge,
    getAllChallenges,
    deleteChallenge
}