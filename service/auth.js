// const pkg=require("jsonwebtoken");
// const secret="DAT";
//  export function setUser(user){
//     return pkg.sign({
//         _id:user._id,
//         email:user.email,
//        },secret);
//     }
//     export function getUser(token){
//         if(!token){
//             return null;
//         }
//         try{
//             return pkg.verify(token,secret); //user ka token frontend se aayga or verify hoga yaha pr secret key se
//         }catch(error){
//             return null;
//         }
       
//     }
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const secret = process.env.JWT_SECRET || 'DAT';

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function checkPassword(inputPassword, hashedPassword) {
  return bcrypt.compare(inputPassword, hashedPassword);
}

export function generateToken(user) {
  console.log('Payload:', {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  return jwt.sign({
    id: user.id,
    email: user.email,
    name: user.name ,
    role: user.role,
  }, secret, { expiresIn: '2h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}


