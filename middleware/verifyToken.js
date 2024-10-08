const jwt=require('jsonwebtoken');
const verifyToken=async(req,res,next)=>{
    try {
        const token =req.cookies.jwtToken;
        if(!token) return res.status(403).json({message:"Not Authenticated!"})
        var decoded = jwt.verify(token, process.env.JWT_SECERT_KEY);
        req.payload=decoded;
        next();
      } catch(err) {
         return res.status(403).json({message:"Invalid tokens!"})
      }
}
module.exports=verifyToken;