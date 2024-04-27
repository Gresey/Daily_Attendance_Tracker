const express = require("express");
const {connectMongoDb}=require("./mongo_connection.js").default;
const bodyParser = require('body-parser');
const app = express();
const path=require("path"); 
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'Dashboard', 'LandingPage_assetss')));

//Connection with MongoDb
connectMongoDb('mongodb://127.0.0.1:27017/DAT').then(()=>
console.log("MongoDB connected"));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Schema for the data for add student
const entrySchema = new mongoose.Schema({
  name: String,
  email: String,
  enrollment: String,
  department: String,
  year: String,
  section: String,
});
const Entry = mongoose.model('Entry', entrySchema);

//schema for attendance report
const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  enrollment:{
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  subject1: {
    type: String,
  
  },
  subject2: {
    type: String,
   
  },
  subject3: {
    type: String,
   
  },

});
const Attendance = mongoose.model('Attendance', attendanceSchema);

app.get('/', (req, res) => {
  res.render('index');
});
app.get("/login",(req,res)=>{
  res.render("login");
});
app.get("/contact",(req,res)=>{
  res.render("contact");
});

app.get("/dashboard",(req,res)=>{
  res.render("dashboard.ejs");
});
app.get("/ADDSTUDENT",(req,res)=>{
  res.render("ADDSTUDENT.ejs");
});
app.get("/AddSubject",(req,res)=>{
  res.render("AddSubject.ejs");
});
app.get("/StudentList",(req,res)=>{
  res.render("StudentList.ejs");
});
app.get("/take_attendance",(req,res)=>{
  res.render("take_attendance.ejs");
});
app.get("/TimeTable",(req,res)=>{
  res.render("TimeTable.ejs");
});
app.get("/users-profile",(req,res)=>{
  res.render("users-profile.ejs");
});
app.get("/Attendancereport",(req,res)=>{
  res.render("Attendance_report.ejs");
});

app.post("/login",(req,res)=>{
  const email=req.body.email;
  const password=req.body.password;
});
app.post("/register",(req,res)=>{
  const username=req.body.username;
  const email=req.body.email;
  const password=req.body.confirmpassword;
  const sign_up_as=req.body.sign_up_as;
});

// Endpoint to handle add student form submissions
app.post('/submitForm', async function (req, res) {
  const { name, email, enrollment, department, year, section } = req.body;

  // Create a new entry
  const newEntry = new Entry({ name, email, enrollment, department, year, section });

  try {
    // Save the entry to the database using async/await
    await newEntry.save();
    res.status(200).send('Entry added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in adding entry');
  }
});

app.get('/searchEntries', (req, res) => {
  const { year, section } = req.query;

  // Find entries based on Year and Section
  Entry.find({ year, section })
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
app.post('/submitAttendance', async function (req, res) {
  const { date, enrollment,name, year, section, subject1,subject2,subject3 } = req.body;

  try {
    // new instance of the Mongoose model
    const newAttendance = new Attendance({
      date,
      enrollment,
      name,
      year,
      section,
      subject1,
      subject2,
      subject3,
    });

    // Save the data to the database
    await newAttendance.save();

    console.log('Attendance submitted:', newAttendance);

    res.status(200).send('Attendance submitted successfully');
  } catch (err) {
    console.error('Error submitting attendance:', err);
    res.status(500).send('error in submiting attendance ');
  }
});
app.get('/searchTotalAttendance', async (req, res) => {
  const { year, section, date } = req.query;

  try {
    const attendanceData = await Attendance.find({ year, section, date });

    if (!attendanceData) {
      return res.status(404).json({ error: 'Attendance data not found' });
    }

    res.json(attendanceData);
  } catch (error) {
    console.error('Error fetching total attendance data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port no ${port}`);
});
