import db from "@/db";

export default async function deleteMessage(req,res){
        if(req.method==='GET'){
            return res.status(200).send({message:"Hello from deleteMessage backend"})
        }
        if(req.method==='POST'){
            const {message_id} = req.body;
            const deleteMessage = await db.message.delete({
                where: {message_id}
            })
            return res.status(200).send({message:"Message Deleted"})
        }
}