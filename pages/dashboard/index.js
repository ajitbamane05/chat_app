import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ChatUserList from '@/Component/ChatUserList';

import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"

import PrimarySearchAppBar from "@/Component/PrimarySearchAppBar";

import Stack from '@mui/material/Stack';
const Dadhboard = ({ data,username }) => {
  const rooms = data.map((room) => room)
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
              <Stack>
                <ChatUserList rooms={rooms} />
              </Stack>
              <Stack>

              </Stack>
            </Stack>

          </div>

        </Box>
      </Box>

    </div>
  );
}

export default Dadhboard;

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

  return {
    props: {
      data,
      username
    }
  }
}
