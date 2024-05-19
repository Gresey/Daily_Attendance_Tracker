import { Router } from "express";
const router=Router();

import { handleWeeklySearchattendance } from '../controllers/getweeklyattendance.js';

router.get('/getWeeklyAttendanceCount',handleWeeklySearchattendance);


export default router;


