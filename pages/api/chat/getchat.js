import db from "@/db"

export default async function getChatHandler(req,res){
    if(req.method=='GET'){
        return res.status(200).send({message:'Welcome to chats'})
    }
    if(req.method=='POST'){
        const {roomId} = req.body
        const chat = await db.message.findMany({
            where: {
                roomId:roomId
            }
        })
        return res.status(200).json(chat)
    }
}