const prisma = require("../lib/prismaClient");


const addmessage = async (req, res) => {
    const userId= req.payload.id;
    const chatId=req.params.id;
    const text=req.body.text;
    // console.log(userId,chatId,text)
    try {
        const chat = await prisma.chat.findUnique({
            where:{
                id:chatId,
                userIds:{
                    hasSome:[userId]
                }
            }
        })
        // console.log(chat)
        if(!chat) return res.status(201).json({message:"Chat does not found!"});
       
        const message=await prisma.message.create({
            data:{
                text,
                userId,
                chatId,
            }
        })

        await prisma.chat.update({
            where:{
                id:chatId
            },
            data:{
                seenBy:[userId],
                lastMessage:text
            }
        })
      res.status(200).json({message,chat});
    } catch (err) {
        console.log(err)
      res.status(500).json({message:"Failed to fetch all chats!"});
    }
  };

  module.exports={
    addmessage
  }