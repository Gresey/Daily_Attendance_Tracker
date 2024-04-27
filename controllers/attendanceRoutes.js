import { db } from '../sqlserver.js';

export async function handleSearchattendace(req,res){
    try {
        const { year, section, date } = req.query;
        const sql = 'SELECT * FROM student_attendance WHERE year = ? AND section = ? AND date = ?';
        const values = [year, section, date];
    
        const result = await db.query(sql, values);
    
        if (result.length === 0) {
          res.status(404).json({ error: 'Attendance data not found' });
        } else {
          res.json(result);
        }
      }catch(err) {
        console.error('Error fetching total attendance data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
export async function handleSubmitAttendance(req,res){
    const { date, subject, enrollments, year, section } = req.body;
      // Copy student data if student_attendance is empty for the given year and section
    const checkStudentAttendanceQuery = `
      SELECT COUNT(*) as count FROM student_attendance WHERE year = ? AND section = ?;
    `;
    const countResult = await db.query(checkStudentAttendanceQuery, [year, section]);
    if(countResult[0].count === 0) {
      const copyStudentDataQuery = `
        INSERT INTO student_attendance (date, enrollment, name, year, section)
        SELECT ?, enrollment, name, ?, ? FROM students WHERE year = ? AND section = ?;
      `;
      await db.query(copyStudentDataQuery, [date, year, section, year, section]);
    }
       // Loop through enrollments and construct the SQL query
    const sqlValues = enrollments.map(({ enrollment, name, attendanceType }) => {
      return `('${date}', '${enrollment}', '${name}', '${year}', '${section}', '${attendanceType}')`;
    }).join(',');
       //  parameterized query for the subject column
    const sql = `
      INSERT INTO student_attendance (date, enrollment, name, year, section, ${db.escapeId(subject)})
      VALUES ${sqlValues}
      ON DUPLICATE KEY UPDATE ${db.escapeId(subject)} = VALUES(${db.escapeId(subject)})
    `;
    try{
      await db.query(sql);
      console.log('Attendance data submitted successfully:', { date, year, section, subject });
      const fetchDataQuery = `
        SELECT * FROM student_attendance WHERE date = ? AND year = ? AND section = ?;
      `;
      const fetchDataResult = await db.query(fetchDataQuery, [date, year, section]);
      console.log('Fetched data from student_attendance:', fetchDataResult[0]);
      res.status(200).send('Attendance submitted successfully');
    }catch (err) {
      console.error('Error submitting attendance:', err);
      res.status(500).send('Error in submitting attendance');
    }
}