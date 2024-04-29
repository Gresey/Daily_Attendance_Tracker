import { db } from "../sqlserver.js";


export async function handleSearchattendace(req, res) {
  
  try {
    const { year, section, date } = req.query;
    const sql =
      "SELECT * FROM student_attendance WHERE year = ? AND section = ? AND date = ?";
    const values = [year, section, date];

    const result = await db.query(sql, values);

    if (result.length === 0) {
      res.status(404).json({ error: "Attendance data not found" });
    } else {
      res.json(result);
    }
  } catch (err) {
    console.error("Error fetching total attendance data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}




export async function handleSubmitAttendance(req, res) {
  const { date, subject, enrollments, year, section } = req.body;

  try {
   
    for (const { enrollment, name, attendanceType } of enrollments) {
      const sql = `
        INSERT INTO student_attendance (date, enrollment, name, year, section, ${db.escapeId(subject)})
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE ${db.escapeId(subject)} = VALUES(${db.escapeId(subject)})
      `;
      await db.query(sql, [date, enrollment, name, year, section, attendanceType]);
    }

    console.log("Attendance data submitted successfully");
    res.status(200).send("Attendance submitted successfully");
  } catch (err) {
    console.error("Error submitting attendance:", err);
    res.status(500).send("Error in submitting attendance");
  }
}
