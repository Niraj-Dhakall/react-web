'use client'
import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import {Typewriter, Cursor} from 'react-simple-typewriter';
import {} from 'next/font/google'
export default function Home() {
  
  return (
    <main>
      <Container sx={{ height:"100vh",maxWidth:"sm"}}>
        <Typography variant="h3" sx={{p:5}}>
        <span style={{ 
          color: '#3498db', 
          fontFamily:"Jersey 10", 
          fontWeight:'bold', 
          fontSize:40}}>Hello I'm
          </span>
          <span 
          style={{
            fontSize:60

          }}>
          <Box>
          <Typewriter
            words={[' Niraj Dhakal', ' A Software Developer', ' Looking for Internships']}
            loop= {true}
            cursor
            cursorStyle = '_'
            typeSpeed={70}
            deleteSpeed={100}
            delaySpeed={1000}
            
            
          ></Typewriter>
          </Box>
          </span>
        </Typography>
      </Container>
    </main>
  );
}
