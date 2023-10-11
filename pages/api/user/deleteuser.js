import db from "@/db";

export default async function deleteUser(req, res) {
    if (req.method === "GET") {
        return res.status(200).send({ message: "Hello from delete user" })
    }
    if (req.method === "POST") {
        const { user_id } = req.body
        const deleteMessage = await db.message.deleteMany({
            where: {
                senderId: user_id
            }
        })
        const deleteMembership = await db.RoomMember.deleteMany({
            where: {
                userId: user_id
            }
        })
        const deleteUser = await db.user.delete({
            where: {
                user_id: user_id
            }
        })
        return res.status(200).send({ message: "user, user messages and membership deleted" })
    }
}
