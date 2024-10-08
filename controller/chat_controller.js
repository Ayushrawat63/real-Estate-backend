const prisma = require("../lib/prismaClient");



const getChats = async (req, res) => {
    const userId=req.payload.id;
    try {
      const chats =await prisma.chat.findMany(
        {
            where:{
                userIds:{
                    hasSome:[userId]
                }
            }
        }
      )

      for(const chat of chats)
      {
          const reciverId = chat.userIds.find((id)=>id!==userId)

          const reciver =await prisma.user.findUnique({
            where:{
              id:reciverId
            },
            select:{
              id:true,
              username:true,
              avatar:true,
            }
          })
          chat.reciver=reciver;
      }

      res.status(200).json(chats);
    } catch (err) {
      console.log(err)
      res.status(500).json({message:"Failed to fetch all chats!"});
    }
  };

const getChat = async (req, res) => {
    const userId= req.payload.id;
    const chatId=req.params.id;
    try {
      const chat=await prisma.chat.findUnique({
        where:{
            id:chatId,
            userIds:{
                hasSome:[userId]
            }
        },
        include:{
            messages:{
                orderBy:{
                    createdAt:"asc"
                }
            }
        }
      })
      if(!chat) return res.status(201).json({message:"Chat does not found!"});

      await prisma.chat.update({
        where:{
            id:chatId
        },
        data:{
            seenBy:{
                push:userId
            }
        }
      })
      res.status(200).json(chat);
    } catch (err) {
      console.log(err)
      res.status(500).json({message:"Failed to fetch all chats!"});
    }
  };


const addChat = async (req, res) => {
    const userId=req.payload.id
    const reciverId =req.body.reciverId;
    try {
      const newChat=await prisma.chat.create({
        data:{
            userIds:[userId,reciverId]
        }
      })
      res.status(200).json(newChat);
    } catch (err) {
      res.status(500).json({message:"Failed to fetch all chats!"});
    }
  };

const readChat = async (req, res) => {
    const userId= req.payload.id;
    const chatId=req.params.id;
    try {
       const chat= await prisma.chat.update({
            where:{
                id:chatId,
                userIds:{
                    hasSome:[userId]
                }
            },
            data:{
                seenBy:{
                    set:[userId]
                }
            }
          })
          // console.log(chat)
      res.status(200).json(chat);
    } catch (err) {
        console.log(err)
      res.status(500).json({message:"Failed to fetch all chats!"});
    }
  };


module.exports={
    addChat,
    getChat,
    getChats,
    readChat
  }

