const brcypt = require("bcrypt");
const prisma = require("../lib/prismaClient");
const jwt=require('jsonwebtoken')

const registerNewUser = async (req, res) => {
  try {
    // console.log(req.body)
    const { username, email, password } = req.body;
    const salt = await brcypt.genSalt(10);
    const hashPassword = await brcypt.hash(password, salt);
    // console.log(hashPassword)
    const newuser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });
    return res.send(newuser);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "Failed to create account!" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    const isValidPassword = await brcypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(401).json({ message: "Invalid Credentials" });

    const age = 1000 * 60 * 60 * 24 * 7; // 1 week

    const token =jwt.sign({
        id:user.id,
        isAdmin:true
    },process.env.JWT_SECERT_KEY,{
        expiresIn:age,
        algorithm:"HS384"
    })
    // console.log(token)
    const {password:userpassword,...userinfo}=user
    return res
      .cookie("jwtToken", token, {
        // httpOnly: true,
        secure: true, //only for https request
        maxAge: age,  // session expire time
      })
      .status(200)
      .json(userinfo);
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    return res
      .clearCookie("jwtToken")
      .status(200)
      .json("Logout Successful");
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: error.message });
  }
};

module.exports = {
  registerNewUser,
  loginUser,
  logoutUser,
};
