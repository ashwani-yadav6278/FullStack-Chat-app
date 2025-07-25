import jwt from 'jsonwebtoken'

const generateToken=(userId,res)=>{
    console.log("JWT_SECRET in prod:", process.env.JWT_SECRET);
    const token= jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'7d'
    });

    res.cookie("jwt",token,{
        maxAge:7 * 24 * 60 * 60 * 1000, 
        httpOnly:true, // prevent xss attacks cross-site scripting attacks
        sameSite:"strict", // CSRF attacks cross site request forgery attacks
        secure:process.env.NODE_ENV !== "development",
    })
    
    return token;
}

export default generateToken;