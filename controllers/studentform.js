import { db } from '../db.js';
 export async function handleSubmissionofStudentEntries(req,res){
    try {
        const { name, email, enrollment, department, year, section } = req.body;
    
        const sql = 'INSERT INTO entries (name, email, enrollment, department, year, section) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [name, email, enrollment, department, year, section];
    
        await db.query(sql, values);
        res.status(200).send("Added Student Entry");
      } catch (err) {
        console.error('Error adding entry:', err);
        res.status(500).send('Error in adding entry');
      }
    }