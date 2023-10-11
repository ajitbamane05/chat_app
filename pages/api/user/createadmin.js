import db from '@/db'
import bcrypt from 'bcrypt'
export default async function createUser(req,res){
    if(req.method=='GET'){
        return res.status(200).send({message:"Hello From Create Admin Backend"})
    }
    if(req.method=='POST'){
         const { username,email,password} = req.body
        if(!username){
            return res.status(400).send({message:'Username not found'})
        }
        if(!email){
            return res.status(400).send({message:'Email not found'})
        }
        if(!password){
            return res.status(400).send({message:'Password not found'})
        }
        try{
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = await db.user.create({
                data:{
                    username:username,
                    email:email,
                    password:hashedPassword,
                    isAdmin: true
                }
            })
            return res.status(200).send({message: 'Admin Created'})
        }
        catch(error){
            return res.status(500).send({message:'Errror Creating Admin', error: error.message})
        }
    }
}