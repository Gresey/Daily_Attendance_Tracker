import { Router } from "express";
const router = Router();
//import { db } from "../sqlserver.js";
import { handleSearchStudentEntries } from "../controllers/searchstudententries.js";
router.get('/',handleSearchStudentEntries );

export default router;
 