import { db } from '../sqlserver.js';
export async function handleCardUpdateDetails(req,res){
    try {
        //const currentDate = moment().format('YYYY-MM-DD'); 
        // SQL query to calculate counts
        const attendanceCounts = await db.query(`
          SELECT 
            COUNT(CASE WHEN CSIT601 = 'P' THEN 1 END) AS csit601_present_count,
            COUNT(CASE WHEN CSIT601 = 'A' THEN 1 END) AS csit601_absent_count,
            COUNT(CASE WHEN CSIT601 IS NOT NULL THEN 1 END) AS csit601_total_count
          FROM student_attendance
          
        `);
    
        res.render('dashboard', { attendanceCounts });
      } catch (error) {
        console.error('Error fetching attendance counts:', error);
        res.status(500).send('Error fetching attendance counts');
      }
}
