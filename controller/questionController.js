const pool = require('../dbconfig');
const { randomUUID } = require('crypto');

const getAllQuestion = async(req,res)=>{
    let { id,offset } = req.query;
    let { email } = req.headers;
    if( !id ){
        res.status(400).json({ message : "challenge_id are requried" });
        return;
    }

    if( !offset || typeof offset !== 'number' )
        offset = 0;

    console.log(email,id,offset);
    try {
        const result = await pool.query(`
            SELECT Q.ID,Q.TITLE,Q.TAGS,Q.LINK,
            (
                CASE
                    WHEN U.SOLVED is NULL THEN FALSE
                    ELSE U.SOLVED
                END
            ) AS SOLVED
            FROM QUESTION Q
            LEFT JOIN (
                SELECT SOLVED,QUESTION_ID FROM USER_TO_QUESTION
                WHERE USER_ID = '${email}'
            ) U
            ON Q.ID = U.QUESTION_ID
            WHERE Q.CHALLENGE_ID = '${id}'
            ORDER BY Q.CREATED_AT, Q.ID
            OFFSET ${offset}
        `,[])

        res.json({
            message : "successful",
            questions : result?.rows
        });
    } catch (error) {
        res.json({ message : "some error occured",error });
    }
}

const addNewQuestion = async(req,res)=>{
    const { title,tags,link } = req.body;
    const { id } = req.query;
    const unique_id = randomUUID();

    if( !title || !tags || !link || !id ){
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
        VALUES('${unique_id}','${title}','${id}',${tagval},'${link}');
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

const solveQuestion = async(req,res)=>{
    const { email } = req.headers;
    const id = req?.params?.id;
    const { language,solution } = req.body;

    if( !language || !solution || !id ){
        res.status(400).json({
            message : "language,solution and question_id are required"
        });

        return;
    }

    try {
        await pool.query(`
            INSERT INTO USER_TO_QUESTION
            VALUES ($1,$2,$3,$4,$5)
            ON CONFLICT( USER_ID,QUESTION_ID )
            DO
            UPDATE SET SOLVED = TRUE,
            LANGUAGE = $4,
            SOLUTION = $5;
        `,[email,id,true,language,solution]);

        res.json({message : "question solved"});
    } catch (error) {
        res.status(400).json({ message : "some error occured" });
    }    
}

const toggleCheck = async(req,res)=>{
    const { email } = req.headers;
    const { id } = req.query;

    if( !email || !id ){
        return res.json({ message : 'email and question_id are required' });
    }

    // console.log('toggleCheck',id,email);
    try {
        await pool.query(`
            UPDATE USER_TO_QUESTION 
            set solved = not solved
            WHERE USER_ID = 'test@gmail.com' 
            AND QUESTION_ID = '26c7bc0e-8539-4946-bb58-db7bfc4fd1e2'
        `,[]);

        return res.json({ message : "success" });
    } catch (error) {
        return res.status(500).json({ message : 'some error occured',error }) ;
    }
}

module.exports = {
    getAllQuestion,
    addNewQuestion,
    deleteQuestion,
    solveQuestion,
    toggleCheck
}