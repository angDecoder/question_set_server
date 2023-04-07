const pool = require('../dbconfig');
const { randomUUID } = require('crypto');

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
    const { title,tags,link,challenge_id } = req.body;
    const id = randomUUID();

    if( !title || !tags || !link || !challenge_id ){
        req.status(400).json({ message : "title,challenge_id, tags and link are required" });
        return;
    }

    let tagval = tags.reduce((tagval,elem)=>{
        return tagval + ',"' + elem + '"';
    },'');

    tagval = "'{" + tagval.substring(1) + "}'";
    // console.log();
    try {
        const result = await pool.query(`
        INSERT INTO QUESTION
        VALUES('${id}','${title}','${challenge_id}',${tagval},'${link}');
    `,[]);

        res.status(201).json({
            message : "new question added"
        });
    } catch (error) {
        res.status(400).json({
            message : "some error occured",
            error
        })
    }
}

const deleteQuestion = async(req,res)=>{
    const id = req?.params?.id;

    if( !id ){
        res.status(400).json({ message : "id is required" });
        return;
    }

    try {
        await pool.query(`
            DELETE FROM QUESTION
            WHERE ID = $1
        `,[id]);

        res.json({ message : 'question deleted successfully' });
    } catch (error) {
        res.status(400).json({
            message : "some error occured",
            error
        })
    }
}

const updateQuestion = async(req,res)=>{

}

module.exports = {
    getAllQuestion,
    addNewQuestion,
    deleteQuestion,
    updateQuestion
}