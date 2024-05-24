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
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.redirect('/login');
  }

  req.user = decoded;
  next();
}

  export function restrictTo(roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).send({ message: 'Unauthorized: No user logged in' });
      }
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).send({ message: 'Forbidden: Access is denied' });
      }
      next();
    };
  }