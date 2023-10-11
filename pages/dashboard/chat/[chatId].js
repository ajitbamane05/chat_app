import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import { authOptions } from "../../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import Box from '@mui/material/Box';
import ChatMessages from '@/Component/ChatMessages';
import PrimarySearchAppBar from '@/Component/PrimarySearchAppBar';
import ChatUser from '@/Component/ChatUser';
import { getUsers } from '@/utils/server';
const Chat = ({ senderId, chatId, chats, data,users,username }) => {
    const rooms = data.map((room) => room)
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([...chats])
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const socketInstance = io('http://localhost:3001');
        socketInstance.emit('joinRoom', chatId);
        socketInstance.on('chat', (payload) => {
            setChat((chat) => [...chat, payload])
        })
        setSocket(socketInstance);
        return () => {
            socketInstance.emit('leaveRoom', chatId);
            socketInstance.disconnect()
        }
    }, [])

    const sendChat = async (e) => {
        e.preventDefault()
        const now = new Date();
        
        await axios.post(`/api/chat/sendmessage`, { content: message, senderId: senderId, roomId: chatId })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error:', error.response);
            });

        socket.emit('chat', {
            content: message, senderId: senderId, createdAt: now, roomId:chatId
        })
        setMessage('')
    }
    const handleMessage = async (e) => {
        await setMessage(e.target.value)
    }

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <PrimarySearchAppBar username={username} />
                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: 'background.default' }}
                >
                    <Toolbar />
                    <div style={{ width: '100vw' }}>
                        <Stack direction='row' spacing={2}>
                            <Stack sx={{display:'fixed',top:50,height:'80vh',overflowY: 'hidden', overflowX: 'hidden'}} >
                                <ChatUser rooms={rooms}   />
                            </Stack>
                            <Stack sx={{maxHeight:'600px',overflowY: 'scroll;', overflowX: 'hidden'}}>
                                <ChatMessages chat={chat} sendChat={sendChat} handleMessage={handleMessage} message={message} senderId={senderId} users={users} />
                            </Stack>
                        </Stack>

                    </div>

                </Box>
            </Box>
        </div>
    );
}

export default Chat;


export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
    if (!session) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    const userId = session.id
    const username = session.user.name
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/room/getroom`, {
        method: 'POST',  // Assuming you want to make a POST request
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId })  // send userid as the body
    });
    const data = await response.json()

    const chatId = context.params.chatId
    const cahtResponse = await fetch(`${process.env.NEXTAUTH_URL}api/chat/getchat/`, {
        method: 'POST',  // Assuming you want to make a POST request
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomId: chatId })  // send userid as the body
    });
    const chats = await cahtResponse.json()
    const senderId = session.id

    const users = await getUsers()
  
    return {
        props: {
            senderId,
            chatId,
            chats,
            data,users,username
        }
    }
}
