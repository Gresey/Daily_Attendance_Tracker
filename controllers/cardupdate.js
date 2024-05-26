import { db } from '../db.js';

export async function handleCardUpdateDetails(req, res) {
    try {
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0];
        let bunkCount = 0;
        let csit601PresentCount = 0;
        let csit601AbsentCount = 0;
        let csit601TotalCount = 0;

        // Fetch attendance counts for CSIT601
        const [rows] = await db.query(`
            SELECT
                SUM(CASE WHEN CSIT601 = 'P' THEN 1 ELSE 0 END) AS csit601_present_count,
                SUM(CASE WHEN CSIT601 = 'A' THEN 1 ELSE 0 END) AS csit601_absent_count,
                COUNT(*) AS csit601_total_count
            FROM student_attendance
            WHERE DATE(date) = ?
        `, [currentDate]);

        // Fetch all rows for the current date to check for mismatched attendance
        const [attendanceRows] = await db.query(`
            SELECT id, name, CSIT601, CSIT602, CSIT603
            FROM student_attendance
            WHERE DATE(date) = ?
        `, [currentDate]);

        const mismatchedRows = attendanceRows.map(row => {
            const isMismatched = row.CSIT601 !== row.CSIT602 || row.CSIT601 !== row.CSIT603 || row.CSIT602 !== row.CSIT603;
            if (isMismatched) {
                bunkCount++;
            }
            return {
                ...row,
                isMismatched
            };
        });

        // Extract counts from the result
        if (rows.length > 0) {
            csit601PresentCount = rows[0].csit601_present_count;
            csit601AbsentCount = rows[0].csit601_absent_count;
            csit601TotalCount = rows[0].csit601_total_count;
        }

        // Log the counts for debugging
        console.log('Bunk count:', bunkCount);
        console.log('Attendance count for CSIT-1 (Present):', csit601PresentCount);
        console.log('Attendance count for CSIT-1 (Absent):', csit601AbsentCount);
        console.log('Total Attendance count for CSIT-1:', csit601TotalCount);
        const name=req.user.name;
        const userRole=req.user.role;

        // Pass the counts and mismatched rows to the dashboard template
        res.render('dashboard', {
            name,
            userRole,
            bunk: bunkCount,
            presentcount: csit601PresentCount,
            absentcount: csit601AbsentCount,
            totalcount: csit601TotalCount,
            mismatchedRows,
          
        });
    } catch (error) {
        // Log any errors that occur during the execution of the function
        console.error('Error fetching attendance counts:', error);
        // Send an error response to the client
        res.status(500).send('Error fetching attendance counts');
    }
}
