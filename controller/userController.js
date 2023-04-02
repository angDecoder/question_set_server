const pool = require('../dbconfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async (req,res)=>{
    const { email,password,username } = req.body;

    if( !email || !password || !username ){
        res.status(401).json({ message : 'email, username and password are required' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password,10);
        await pool.query(`
            INSERT INTO USERS(USERNAME,EMAIL,PASSWORD)
            VALUES ($1,$2,$3);
        `,[username,email,hashedPassword]);

        res.status(201).json({ message : 'new user created' });
    } catch (error) {
        // console.log(error);
        res.status(400).json({ message : 'user not created',error });
    }
}

const loginUser = async (req,res)=>{
    const { email,password } = req.body;
    // console.log('here');
    if( !email || !password ){
        res.status(401).json({ message : 'email and password are required' });
        return;
    }

    try {
        const result = await pool.query(`
            SELECT PASSWORD,USERNAME FROM USERS
            WHERE EMAIL = $1
        `,[email]);
        const hash = result?.rows[0]?.password;
        const compare = await bcrypt.compare(password,hash);

        if( compare ){
            const refreshToken = jwt.sign(
                {email},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn : '30 days' }
            );
            const accessToken = jwt.sign(
                {email},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn : '1h' }
            );

            await pool.query(`
                UPDATE USERS SET
                REFRESH_TOKEN = '${refreshToken}' 
                WHERE EMAIL = '${email}'
            `,[]);

            res.json({ 
                message : 'user logged in',
                username : result.rows[0].username,
                refreshToken,
                accessToken            
            });
        }
        else 
            res.status(401).json({ message : 'wrong password, try again' });
    } catch (error) {
        res.status(400).json({ message : 'some error occured',error });
    }
}

const autoLogin = async (req,res)=>{

}

const refresh = async (req,res)=>{

}

const logout = async (req,res)=>{

}

module.exports = {
    registerUser,
    loginUser,
    autoLogin,
    refresh,
    logout
};