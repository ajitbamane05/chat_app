import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import bgImage from '../public/images/bgimage4.jpg'
const myLoader = ({ src }) => {
  return `${src}`
}

export default function Home() {
  const styles = {
    input: {
      color: "black", // Set your desired font color here
    },
    bg: {
      borderColor: "black",
    },
  };
  const router = useRouter();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  // const [message, setMessage] = useState("");
  const submitData = async (e) => {
    e.preventDefault(username,password);
    const res = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });
    if (res.status === 200) {
      router.push("/dashboard");
    }
    if (res.status === 401) {
      alert("wrongCredentials")
      // await setMessage("wrongCredentials");
    }
  };

  const handleNameChange = (e) => {
    setUsername(e.target.value);
    // setMessage("");
  };
  const handlePassChange = (e) => {
    setPassword(e.target.value);
    // setMessage("");
  };
  
  return (
    <>
      <Image
        loader={myLoader}
        src={bgImage}
        unoptimized
        alt="baground image"
        fill
        sizes="(min-width: 808px) 50vw, 100vw"
        quality={75}
        priority="true"
        blurDataURL={'data:image/webp;base64,...'}
        placeholder="blur"
        style={{
          objectFit: 'cover', // cover, contain, none
        }}
      />
      <Grid
        container
        justifyContent="center"
        spacing={2}
        sx={{ mb: 3, pt: 4, pb: 3, position: "absolute", top: "30vh", zIndex: 10 }}>
        <Paper elevation={3} sx={{ bgcolor: 'rgba(255,255,255,0.5)' }}>
          <Box
            component="form"
            sx={{
              height: 200,
              width: 300,
              pt: 5, pl: 3, pr: 3, pb: 4
            }}
            noValidate
            autoComplete="off"
          >
            <Stack spacing={2}>

              <Stack item>
                <TextField
                  id="outlined-basic"
                  label="Username"
                  onChange={handleNameChange}
                  InputLabelProps={{
                    style: styles.input,
                  }}
                  InputProps={{
                    style: styles.bg,
                  }}
                  focused
                  autoComplete="off"
                 />
              </Stack>
              <Stack item>
                <TextField
                  id="outlined-password-input"
                  onChange={handlePassChange}
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
              </Stack>
              <Stack>
                <Button variant='contained' onClick={submitData} >
                  Sign in
                </Button>
              </Stack>
              <Stack>
                <Typography variant="subtitle2" gutterBottom>
                   Don&apos;t have account? SignUp here
                </Typography>
              </Stack>
            </Stack>
          </Box >
        </Paper>
      </Grid>

    </>
  )
}
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
