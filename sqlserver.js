import express from 'express';
import { createPool } from 'mysql2';
import  pkgg  from 'body-parser';
const {urlencoded}=pkgg;
const app = express();
const port = process.env.PORT || 3000;
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from './routes/authroutes.js'; 
import { restrictToLoggedinUserOnly } from './middleware/auth.js';


const __dirname = dirname(fileURLToPath(import.meta.url));
import { readFileSync } from "fs";

import pageRenderRoutes from "./routes/pageRenderRoutes.js";
import StudentData from "./routes/StudentForm.js";
import AttendanceRoutes from "./routes/attendanceRoutes.js";
import searchEntries from "./routes/SearchEntries.js";

import { name } from 'ejs';

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.json());

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(join(__dirname, 'Dashboard', 'assets')));



const pool = createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'gresey',
  database: 'StudentAttendance',
});

const db = pool.promise();
app.use(cookieParser());
export { db };

// Including MySQL table files
const studentData=readFileSync(join(__dirname,'tables','studentdata.sql'),'utf8');
const student_attendance=readFileSync(join(__dirname,'tables','attendance.sql'),'utf8');
const user=readFileSync(join(__dirname,'tables','user.sql'),'utf8');
async function createTables(){
  try{
    await db.query(user);
    console.log('user table created');
    await db.query(studentData);
    console.log('Students table created successfully');
    await db.query(student_attendance);
    console.log('Attendance table created');

  }
  catch(err){
    console.error('Error creating tables:',err);
  }
}
createTables();

 
app.use('/auth', authRoutes);
//app.use('/dashboard', restrictToLoggedinUserOnly, pageRenderRoutes);
app.use('/',pageRenderRoutes);

// Endpoint to handle add student form submissions
app.use('/submitForm',StudentData);

// Endpoint to handle searchEntries
app.use('/searchEntries',searchEntries);

// Endpoint to handle attendance submissions
app.use('/attendance',AttendanceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port no ${port}`);
});




