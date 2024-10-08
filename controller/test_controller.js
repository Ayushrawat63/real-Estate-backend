const jwt=require('jsonwebtoken')
const normalUserAuth= async  (req,res)=>{
        try {
            const data=req.payload;
            return res.status(200).json({message:"You are Aunthenticated !",data})
          } catch(err) {
             return res.status(403).json({message:"paylaod data is hacked"})
          }
}
const adminUserAuth= async(req,res)=>{
    try {
        const token =req.cookies.jwtToken;
        if(!token) return res.status(403).json({message:"Not Authenticated!"})
        var decoded = jwt.verify(token, process.env.JWT_SECERT_KEY);
        if(!decoded.isAdmin) return res.status(403).json({message:"Not authorization!"})
        return res.status(200).json({message:"You are Aunthenticated !" ,decoded})
      } catch(err) {
         return res.status(403).json({message:"Invalid token!"})
      }
}

module.exports={
    normalUserAuth,
    adminUserAuth,
}