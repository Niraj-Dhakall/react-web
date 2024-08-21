'use client'
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import logo from 'src\app\images\spotlight03.jpg'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ThemeSwitcher from './ThemeSwitch'

const pages = ['Home', 'Projects', 'Contact'];
const Navbar = () => {
 
    return(
        <AppBar position='static'>
            <Container maxWidth="x1">
                <Toolbar disableGutters>
                    
                    {/* <Box
                        component = "img" 
                        sx={{ display: { xs: 'none', md: 'flex' }, 
                        mr: 1, 
                        width:15, 
                        height:15 }}
                        alt="Niraj Dhakal Logo"
                        src='https://i.imgur.com/142Glwu.png'
                    /> */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        px: 1,
                        hover:"white"
                        }}
                        >
                        Niraj Dhakal
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                        <Button
                            key={page}
                            sx={{ my: 2, color: 'white', 
                                display: 'block', '&:hover': {
                                   boxShadow: '0px 4px 15px rgba(66, 135, 245, 0.9)',
                                } }}
                        >
                            {page}
                        </Button>
                        ))}
                    </Box>

                    <Box>
                        <ThemeSwitcher>

                        </ThemeSwitcher>

                    </Box>   
                </Toolbar>   
            </Container>
        </AppBar>





    );

}

export default Navbar;