const pool = require('../dbconfig');

const getAllQuestion = async(req,res)=>{
    const id = req?.params?.id;
    // console.log(id);
    if( !id ){
        res.status(400).json({ message : "challenge_id are requried" });
        return;
    }

    try {
        const result = await pool.query(`
            SELECT Q.ID,Q.TITLE,Q.DESCRIPTION,Q.TAGS,
            (
                CASE
                    WHEN U.SOLVED is NULL THEN FALSE
                    ELSE U.SOLVED
                END
            ) AS SOLVED
            FROM QUESTION Q
            LEFT JOIN (
                SELECT SOLVED,QUESTION_ID FROM USER_TO_QUESTION
                WHERE USER_ID = 'test1@gmail.com'
            ) U
            ON Q.ID = U.QUESTION_ID
            WHERE Q.CHALLENGE_ID = $1;
        `,[id])

        res.json({
            message : "successful",
            questions : result?.rows
        });
    } catch (error) {
        res.json({ message : "some error occured",error });
    }
}

const addNewQuestion = async(req,res)=>{

}

const deleteQuestion = async(req,res)=>{

}

const updateQuestion = async(req,res)=>{

}

module.exports = {
    getAllQuestion,
    addNewQuestion,
    deleteQuestion,
    updateQuestion
}