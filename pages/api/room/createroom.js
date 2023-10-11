// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import db from "@/db";
export default async function createRoom(req, res) {
    if (req.method == 'GET') {
        return res.status(200).send({ message: "Hello from create Chat" })
    }
    if (req.method == 'POST') {
        const { name, type, memberIds, userId, directChatId } = req.body
        if (!name || !type) {
            return res.status(400).send({ message: "Name or type not provided." });
        }
        if (type !== "DIRECT" && type !== "GROUP") {
            return res.status(400).send({ message: "Invalid room type provided." });
        }
        if (type === "DIRECT") {
            try {
                const existingRoom = await db.room.findFirst({
                    where:{
                        type: 'DIRECT',
                        AND : [
                            ...memberIds.map((member)=>({
                                members: {
                                    some: {
                                      userId: member
                                    }
                                }
                            }))
                        ]
                    }
                })
                if(existingRoom){
                    return res.status(400).send({message:"Room already exists with users"})
                }
                const newRoom = await db.room.create({
                    data: {
                        type: type,
                        name: name       
                    },
                }); 
                await db.roomMember.createMany({
                    data: [
                        ...memberIds.map((member) => ({
                            userId: member,
                            roomId: newRoom.room_id
                        }))
                    ]
                })
                return res.status(200).send({ message: 'Direct chat is created' })
            }
            catch (error) {
                return res.status(400).send({ message: 'Error While Creating chat room', error: error.message })
            }
        }
        else {
            try {
                
                const newRoom = await db.room.create({
                    data: {
                        type: type,
                        name: name
                    },
                });
                
                await db.roomMember.create({
                    data: {
                        userId: userId,
                        roomId: newRoom.room_id,
                        isAdmin: true
                    }
                })
                await db.roomMember.createMany({
                    data: [
                        ...memberIds.map((member) => ({
                            userId: member,
                            roomId: newRoom.room_id
                        }))
                    ]
                })
                return res.status(200).send({ message: 'Chat room is created' })

            }
            catch (error) {
                return res.status(400).send({ message: 'Error While Creating chat room', error: error.message })
            }
        }
    }
}