import express from 'express';
import mysql from 'mysql2/promise';
import  pkgg  from 'body-parser';
const {urlencoded}=pkgg;
const app = express();
const port = process.env.PORT || 3000;
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from './routes/authroutes.js'; 
import { restrictToLoggedinUserOnly , restrictTo} from './middleware/auth.js';
import multer from 'multer';
import { db } from './db.js';

const upload = multer({ storage: multer.memoryStorage() });


const __dirname = dirname(fileURLToPath(import.meta.url));
import { readFileSync } from "fs";

import pageRenderRoutes from "./routes/pageRenderRoutes.js";
import StudentData from "./routes/StudentForm.js";
import AttendanceRoutes from "./routes/attendanceRoutes.js";
import searchEntries from "./routes/SearchEntries.js";
import dashboard from "./routes/dashboard.js";
import weeklyattendance from "./routes/weeklyattendance.js";

import { name } from 'ejs';

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.json());

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(join(__dirname, 'Dashboard', 'assets')));



app.use(cookieParser());


// Including MySQL table files
const studentData=readFileSync(join(__dirname,'tables','studentdata.sql'),'utf8');
const student_attendance=readFileSync(join(__dirname,'tables','attendance.sql'),'utf8');
const user=readFileSync(join(__dirname,'tables','user.sql'),'utf8');
const timetable=readFileSync(join(__dirname,'tables','timetable.sql'),'utf8');
const facultytimetable=readFileSync(join(__dirname,'tables','facultytimetable.sql'),'utf8');
async function createTables(){
  try{
    await db.query(user);
    console.log('user table created');
    await db.query(studentData);
    console.log('Students table created successfully');
    await db.query(student_attendance);
    console.log('Attendance table created');
    await db.query(timetable);
    console.log('Class Timetable table created');
    await db.query(facultytimetable);
    console.log('Faculty Timetable table created');
  }
  catch(err){
    console.error('Error creating tables:',err);
  }
}
createTables();

 





app.use('/auth',authRoutes);
app.use(restrictToLoggedinUserOnly,(req, res, next) => {
  // Assuming req.user contains the user information
  res.locals.userRole = req.user.role;
  res.locals.name = req.user.name;
  next();
});
// Endpoint to handle add student form submissions
app.use('/submitForm',StudentData);
app.use('/dashboard', restrictToLoggedinUserOnly,dashboard);

app.use('/',pageRenderRoutes);

// Endpoint to handle searchEntries
app.use('/searchEntries',searchEntries);

// Endpoint to handle attendance submissions
app.use('/attendance',AttendanceRoutes);
app.use('/weeklyattendance',weeklyattendance);

app.post('/upload-class',restrictToLoggedinUserOnly, restrictTo(['Coordinator','Personal Assistant']),upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { year, section } = req.body;
    const file = req.file;
    const image = file.buffer;


    await db.query(
      'INSERT INTO images (image, year, section) VALUES (?, ?, ?)',
      [image, year, section]
    );

    res.status(200).send('File uploaded and saved to database.');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while uploading the file.');
  }
});
app.post('/upload-faculty',restrictToLoggedinUserOnly, restrictTo(['Personal Assistant']),upload.single('image'),async (req,res)=>{
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  const {facultyname}=req.body;
  const file = req.file;
  const image = file.buffer;
  await db.query('INSERT INTO facultytimetable (image,facultyname) VALUES (?, ?)',
  [image, facultyname]);
  res.status(200).send('File uploaded and saved to database.');
} catch (error) {
  console.error(error);
  res.status(500).send('An error occurred while uploading the file.');
}
});
app.get('/retrivetimetable', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT image, year, section FROM images');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching images.');
  }
});
app.get('/retrivefacultytimetable',async (req,res)=>{
  try{
const [rows]=await db.query('SELECT image,facultyname FROM facultytimetable');
res.json(rows);
  }catch(error){
    console.error(error);
    res.status(500).send('An error occurred while fetching timetables.');
  }
});

app.get('/retrieveparticularfacultytt', restrictToLoggedinUserOnly, async (req, res) => {
  try {
    const facultyname = req.user.name; // Get the user's name from the token payload
    const [timetable] = await db.query('SELECT image FROM facultytimetable WHERE facultyname = ?', [facultyname]);

    if (timetable.length === 0) {
      return res.status(404).send('No timetable found for this faculty.');
    }

    res.json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).send('An error occurred while fetching timetables.');
  }
});
//card update at dashboard
app.get('/fetchAttendanceData', async (req, res) => {
  try {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
    const attendanceData = [];

    const years = ['2', '3'];
    const sections = ['CSIT 1', 'CSIT 2', 'CSIT 3'];
    const subjects = ['CSIT601', 'CSIT602', 'CSIT603'];

    for (const year of years) {
      for (const section of sections) {
        for (const subject of subjects) {
          const [rows] = await db.query(`
          SELECT
            SUM(CASE WHEN ${subject} = 'P' THEN 1 ELSE 0 END) AS present_count,
            SUM(CASE WHEN ${subject}= 'A' THEN 1 ELSE 0 END) AS absent_count,
            COUNT(*) AS total_count
          FROM student_attendance
          WHERE DATE(date) = ? AND year = ? AND section = ?
        `, [currentDate, year, section]);

        
       
        console.log(rows);
          const presentCount = rows[0].present_count || 0;
          const totalCount = rows[0].total_count || 0;
          const bunkCount = totalCount - presentCount;

          attendanceData.push({
            year,
            section,
            subject,
            totalcount: totalCount,
            presentcount: presentCount,
            bunk: bunkCount
          });
        }
      }
    }

    console.log('Attendance Data:', attendanceData);
    res.json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).send('Error fetching attendance data');
  }
});

app.get('/api/userinfo', (req, res) => {
  if (req.session.userId) {
    const userId = req.session.userId;

    db.query('SELECT username, role FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database query failed' });
      }
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port no ${port}`);
});

