import { db } from '../sqlserver.js';
export async function handleCardUpdateDetails(req, res) {
    try {
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0];
        // SQL query to calculate counts
        const [rows] = await db.query(`
            SELECT 
                SUM(CASE WHEN CSIT601 = 'P' THEN 1 ELSE 0 END) AS csit601_present_count,
                SUM(CASE WHEN CSIT601 = 'A' THEN 1 ELSE 0 END) AS csit601_absent_count,
                COUNT(*) AS csit601_total_count
            FROM student_attendance
            WHERE DATE(date) = ?
            `, [currentDate]);

        // Extract the counts from the result
        const csit601PresentCount = rows[0].csit601_present_count;
        const csit601AbsentCount = rows[0].csit601_absent_count;
        const csit601TotalCount = rows[0].csit601_total_count;

        // Log the attendance counts for debugging
        console.log('Attendance count for CSIT-1 (Present):', csit601PresentCount);
        console.log('Attendance count for CSIT-1 (Absent):', csit601AbsentCount);
        console.log('Total Attendance count for CSIT-1:', csit601TotalCount);

        // Pass the counts to the dashboard template
        res.render('dashboard', { 
            presentcount: csit601PresentCount, 
            absentcount: csit601AbsentCount,
            totalcount: csit601TotalCount
        });
    } catch (error) {
        // Log any errors that occur during the execution of the function
        console.error('Error fetching attendance counts:', error);
        // Send an error response to the client
        res.status(500).send('Error fetching attendance counts');
    }
}