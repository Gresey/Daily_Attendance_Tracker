import { Router } from "express";
const router=Router();
//import {db} from "../sqlserver.js";
import {handleSubmitAttendance} from "../controllers/attendanceRoutes.js";
import {handleSearchattendace} from "../controllers/attendanceRoutes.js";
router.get('/searchTotalAttendance', handleSearchattendace);
router.patch('/submitAttendance',handleSubmitAttendance);

export default router;