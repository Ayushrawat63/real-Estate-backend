const prisma = require("../lib/prismaClient");
const bcrypt=require('bcrypt')

const allUsers = async (req, res) => {
  try {
    const users=await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({message:"Failed to fetch all users!"});
  }
};
const uniqueUser = async (req, res) => {
    const id=req.params.id;
    const  data=req.payload;
    if(data.id!=id) return res.status(403).json({message:"Not Autherized"})
  try {
     const user= await prisma.user.findUnique({
        where:{id:data.id},
        include:{
          post:true,
          savePost:true,
          chats:true
        }
     })
     res.status(200).json(user)
  } catch (err) {
    res.status(500).json({message:"Failed to fetch unique user!"});
  }
};

const updateUser = async (req, res) => {
    const id=req.params.id;
    // console.log(id)
    const  data=req.payload;
    // console.log(data.id)
    const {password,avatar,...body}=req.body;
    if(data.id!=id) return res.status(403).json({message:"Not Autherized"})
        let hasedPassword=""
  try {
    // const salt= await bcrypt
     if(password)
     {
        const salt=await bcrypt.genSalt(10);
         hasedPassword=await bcrypt.hash(password,salt);
     }
     const updatedUser=await prisma.user.update({
        where:{id:data.id},
        data:{
            ...body,
            ...(hasedPassword && {password:hasedPassword}),
            ...(avatar && {avatar})            
        }
     })
     const {password:updatedPassword,...userinfo}=updatedUser
     res.status(200).json(userinfo)
  } catch (err) {
    console.log(err)
    res.status(500).json({message:"Failed to update user!"});
  }
};

const deleteUser = async (req, res) => {
    const id=req.params.id;
    // console.log(id)
    const  data=req.payload;
    // console.log(data.id)
    if(data.id!=id) return res.status(403).json({message:"Not Autherized"})
  
  try {
    await prisma.user.delete({
        where:{id:data.id}
    })
    res.status(200).json({message:"User deleted successfully"})
  } catch (err) {
    res.status(500).json({message:"Failed to delete user!"});
  }
};

const savePost = async (req, res) => {
  const userId = req.payload.id;
  const postId=req.body.postId;
  try {
    const savedPost=await prisma.savePost.findUnique({
      where:{
        userId_postId:{
          userId,
          postId
        }
      }
    })

    if(!savedPost){
      const savepost=await prisma.savePost.create({
        data:{
          userId,
          postId
        }
      })
      return res.status(200).json(savepost);
    }
    else{
      await prisma.savePost.delete({
        where:{
          id:savedPost.id
        }
      })
      return res.status(200).json("Unsaved the post");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to add Post!" });
  }
};

const profilePosts = async (req, res) => {
  const userId = req.payload.id;
  try {
     const posts =await prisma.post.findMany({
      where:{
        userId
      }
     })
     const saved = await prisma.savePost.findMany({
      where:{
        userId
      },
      include:{
        post:true
      }
     })
     const savedPosts= saved.map((save)=>{return save.post})
     res.status(200).json({posts,savedPosts})
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to add Post!" });
  }
};

module.exports = {
  allUsers,
  uniqueUser,
  updateUser,
  deleteUser,
  savePost,
  profilePosts
};
