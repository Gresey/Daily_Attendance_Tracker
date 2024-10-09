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


router.get("/ADDSTUDENT", restrictToLoggedinUserOnly,(req, res) => {
  const name=req.user.name;
  const userRole=req.user.role;
  res.render("ADDSTUDENT.ejs",{name,userRole});
});

router.get("/AddSubject", restrictToLoggedinUserOnly,(req, res) => {
  res.render("AddSubject.ejs");
});

router.get("/StudentList", restrictToLoggedinUserOnly,(req, res) => {
  res.render("StudentList.ejs");
});

router.get("/take_attendance",restrictToLoggedinUserOnly,(req, res) => {
  const name=req.user.name;
  const userRole=req.user.role;
  res.render("take_attendance.ejs",{name,userRole});
});

router.get('/TimeTable',restrictToLoggedinUserOnly,(req, res) => {
  const name=req.user.name;
  const userRole=req.user.role;
  res.render('TimeTable' ,{name,userRole});
});

router.get('/users-profile',(req, res) => {
  const name=req.user.name;
  const userRole=req.user.role;
  res.render('users-profile.ejs',{name,userRole});
});
router.get('/bunklist',restrictToLoggedinUserOnly,restrictTo(['Personal Assistant','HOD']),(req, res) => {
  const name=req.user.name;
  const userRole=req.user.role;
  res.render('bunklist.ejs',{name,userRole});
});
 router.get('/errorpage',(req,res)=>{
   res.render('errorpage.ejs',{name,userRole});
 });

router.get("/Attendancereport",restrictToLoggedinUserOnly,(req, res) =>{
  const name=req.user.name;
  const userRole=req.user.role;
  res.render("Attendance_report.ejs",{name,userRole});
});
router.get("/contact-LandingPage", (req, res) => {
  res.render("contact-LandingPage.ejs");
});

export default router;
