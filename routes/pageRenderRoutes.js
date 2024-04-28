import { Router } from 'express';
const router = Router();
import { handleCardUpdateDetails } from '../controllers/cardupdate.js';



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


router.get('/dashboard',handleCardUpdateDetails);


router.get("/ADDSTUDENT", (req, res) => {
  res.render("ADDSTUDENT.ejs");
});

router.get("/AddSubject", (req, res) => {
  res.render("AddSubject.ejs");
});

router.get("/StudentList", (req, res) => {
  res.render("StudentList.ejs");
});

router.get("/take_attendance", (req, res) => {
  res.render("take_attendance.ejs");
});

router.get("/TimeTable", (req, res) => {
  res.render("TimeTable.ejs");
});

router.get("/users-profile", (req, res) => {
  res.render("users-profile.ejs");
});

router.get("/Attendancereport", (req, res) => {
  res.render("Attendance_report.ejs");
});
router.get("/contact-LandingPage", (req, res) => {
  res.render("contact-LandingPage.ejs");
});

export default router;
