import { Router } from "express";
const router=Router();
//import {db} from "../sqlserver.js";
import {handleSubmissionofStudentEntries} from "../controllers/studentform.js";
router.post('/',handleSubmissionofStudentEntries);

  export default router;