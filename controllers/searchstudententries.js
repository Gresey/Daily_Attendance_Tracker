import { db } from '../sqlserver.js';
export async function handleSearchStudentEntries(req,res){
    try {
        const { year, section } = req.query;
  
        //  MySQL query based on the provided parameters
        const query = `SELECT * FROM entries WHERE year = ? AND section = ?`;
  
        // Execution of MySQL query using the promise-based API
        const [results] = await db.query(query, [year, section]);
  
        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}