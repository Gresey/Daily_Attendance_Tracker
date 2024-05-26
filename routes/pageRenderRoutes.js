import { Router } from 'express';
import { restrictToLoggedinUserOnly,restrictTo } from '../middleware/auth.js';
const router = Router();


// Define GET endpoints
router.get('/', (req, res) => {
  res.render('LandingPage');
});

 router.get("/login", (req, res) => {
   res.render("login");
 });

router.get("/contact", (req, res) => {
  res.render("contact");
});


//router.get('/dashboard',handleCardUpdateDetails);


router.get("/ADDSTUDENT", (req, res) => {
  res.render("ADDSTUDENT.ejs");
});

router.get("/AddSubject", (req, res) => {
  res.render("AddSubject.ejs");
});

router.get("/StudentList", (req, res) => {
  res.render("StudentList.ejs");
});

router.get("/take_attendance",(req, res) => {
  
  res.render("take_attendance.ejs");
});

router.get('/TimeTable',restrictToLoggedinUserOnly,(req, res) => {
  const name=req.user.name;
  const userRole=req.user.role;
  res.render('TimeTable' ,{name,userRole});
});

router.get('/users-profile',(req, res) => {
  
  res.render('users-profile.ejs');
});
router.get('/bunklist',restrictToLoggedinUserOnly,restrictTo(['Personal Assistant','HOD']),(req, res) => {
  
  res.render('bunklist.ejs');
});
 router.get('/errorpage',(req,res)=>{
   res.render('errorpage.ejs');
 });

router.get("/Attendancereport",(req, res) => {
  res.render("Attendance_report.ejs");
});
router.get("/contact-LandingPage", (req, res) => {
  res.render("contact-LandingPage.ejs");
});

export default router;
