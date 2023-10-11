import db from "@/db"

export default async function deleteRoom(req,res){
    if(req.method=='GET'){
        return res.status(200).send({message:"Hello from delete room"})
    }
    if(req.method=='POST'){
        const {room_id} = req.body
        const deleteChat = await db.message.deleteMany({
            where: {
                roomId: room_id
            }
        })
        const deleteRoomMembers = await db.RoomMember.deleteMany({
            where:{
                roomId:room_id
            }
        })
        const deleteRoom = await db.room.delete({
            where: {
                room_id: room_id
            }
        })
        return res.status(200).send({message:"Room and all chats are deleted"})
    }

}