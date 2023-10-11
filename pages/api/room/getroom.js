import db from "@/db"

export default async function getRoomHandler(req, res) {
  if (req.method == 'POST') {
    const { userId } = req.body
    if (!userId) {
      res.status(400).send({ message: 'User Id not found' })
    }
    const memberships = await db.roomMember.findMany({
      where: {
        userId: userId
      },
      include: {
        room: {
          include: {
            members: {
              include: {
                user: true  
              }
            }
          }
        }

      }
    })
    
    returnres.status(200).json(memberships)
  }
}