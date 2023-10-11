import db from "@/db"

export default async function sendMessage(req,res){
    if(req.method=="GET"){
        res.status(200).send({message:"Hellow from SendMessage"})
    }
    if(req.method=="POST"){
        const {content,senderId,roomId} = req.body

        if(!content || !senderId || !roomId){
            res.status(400).send({meaage:"Missing content, senderId or roomId"})
        }
        const message = await db.message.create({
            data: {
                content: content,
                senderId: senderId,
                roomId:roomId
            }
        })  
        res.status(200).send({message:"Message Created"})
    }
}