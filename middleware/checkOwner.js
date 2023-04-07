const pool = require('../dbconfig');

const checkOwner = async(req,res,next)=>{
    const { challenge_id } = req.body;
    const { email } = req.headers;

    if( !email || !challenge_id ){
        res.status(400).json({
            message : "email and challenge_id are required"
        });
        return;
    }
    // console.log(challenge_id);
    try {
        const result = await pool.query(`
            SELECT OWNER
            FROM CHALLENGE
            WHERE ID = $1;
        `,[challenge_id]);
        // console.log(result.rows);
        if( result?.rows[0]?.owner != email ){
            res.status(400).json({
                message : "You are not allowed to perform action on this challenge"
            });
            return;
        }
        next();
    } catch (error) {
        res.status(400).json({
            message : "some error occured here",
            error
        })
    }
}

module.exports = checkOwner;