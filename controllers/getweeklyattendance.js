import { db } from '../db.js';

export async function handleWeeklySearchattendance(req, res) {
    try {
        const { year, section } = req.query;
        const sql = `
            SELECT
                day_of_week,
                COUNT(DISTINCT enrollment) AS total_present_count
            FROM (
                SELECT
                    enrollment,
                    DAYNAME(date) AS day_of_week
                FROM student_attendance
                WHERE YEARWEEK(date, 1) = YEARWEEK(CURDATE(), 1)
                  AND year = ?
                  AND section = ?
                  AND DAYOFWEEK(date) BETWEEN 2 AND 6 -- From Monday (2) to Friday (6)
                  AND (
                      CSIT601 = 'P' OR
                      CSIT602 = 'P' OR
                      CSIT603 = 'P'
                  )
            ) AS attendance_subquery
            GROUP BY day_of_week
            ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
        `;
        const values = [year, section];
        const [result] = await db.query(sql, values);
        
        if (result.length === 0) {
            console.log("Attendance data not found");
            const data = {
                Monday: 0,
                Tuesday: 0,
                Wednesday: 0,
                Thursday: 0,
                Friday: 0
            };
            res.json(data);
        } else {
            // Format the data to match the chart's requirements
            const data = {
                Monday: 0,
                Tuesday: 0,
                Wednesday: 0,
                Thursday: 0,
                Friday: 0
            };
            result.forEach(row => {
                data[row.day_of_week] = row.total_present_count;
            });
            console.log("Weekly attendance data:", data);
            res.json(data);
        }
    } catch (err) {
        console.error("Error fetching total attendance data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
