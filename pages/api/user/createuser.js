import db from '@/db'
import bcrypt from 'bcrypt'
export default async function createUser(req, res) {
    if (req.method == 'GET') {
        return res.status(200).send({ message: "Hello From Create User Backend" })
    }
    if (req.method == 'POST') {
        const { username, email, password, isAdmin } = req.body
        if (!username) {
            return res.status(400).send({ message: 'Username not found' })
        }
        if (!email) {
            return res.status(400).send({ message: 'Email not found' })
        }
        if (!password) {
            return res.status(400).send({ message: 'Password not found' })
        }
        if (isAdmin) {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await db.user.create({
                    data: {
                        username: username,
                        email: email,
                        password: hashedPassword,
                        isAdmin: isAdmin
                    }
                })
                return res.status(200).send({ message: 'Admin is Created' })
            }
            catch (error) {
                return res.status(500).send({ message: 'Error Creating The Admin', error: error.message })
            }
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await db.user.create({
                data: {
                    username: username,
                    email: email,
                    password: hashedPassword
                }
            })
            return res.status(200).send({ message: 'User Created' })
        }
        catch (error) {
            return res.status(500).send({ message: 'Error Creating The User', error: error.message })
        }
    }
}