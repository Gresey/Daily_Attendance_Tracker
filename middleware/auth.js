// import { getUser } from "../service/auth.js";
// export async function restrictToLoggedinUserOnly(req,res,next){
//     const userUid=req.cookies?.uid;
//     if(!userUid){
//         return res.redirect("/login");
//     }
//     const user=getUser(userUid);
//     if(!user){
//         return res.redirect("/login");
//     }
//     req.user=user;
//     next();
// }

import { verifyToken } from '../service/auth.js';

export function restrictToLoggedinUserOnly(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).redirect('/login');
  }
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).redirect('/login');
  }
  req.user = user;
  next();
}