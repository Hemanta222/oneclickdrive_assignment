'use client'
import { useFeedback } from '@/context/FeedbackContext'
import { Box, Button, Container, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const router = useRouter()
    const { displayMessage } = useFeedback()
    const checkAuth = async () => {
        try {
            const res = await fetch("/api/auth/get-user");
            if (res.ok) {
                const user = await res.json();
                console.log('user', user)
            }
        } catch (error) {
            console.log('error', error)
            alert(error.message)
        }

    }
    useEffect(() => {
        checkAuth()
    }, [])
    // const registerHandler = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const res = await fetch('api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, password: password }) })
    //         if (res.ok) {
    //             const data = await res.json()
    //             console.log('submitHandler data', data)
    //         }
    //         alert('Submit')
    //     } catch (error) {
    //         alert(error.message)
    //     }


    // }
    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, password: password }) })
            if (res.ok) {
                const data = await res.json()
                console.log('submitHandler data', data)
                displayMessage(data?.message||'Success','success')
            }
  
        } catch (error) {
            // alert(error.message)
            displayMessage(error.message,'error')
        }


    }
    return (
        <Container maxWidth='sm'>
            <Box sx={{ bgcolor: '#cfe8fc' }} component='form' onSubmit={loginHandler}>

                <TextField id="email" label="Email" variant="standard" fullWidth sx={{ p: 1 }} value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField type='password' id="password" label="Password" variant="standard" fullWidth sx={{ p: 1 }} value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" type='submit'>Login</Button>
            </Box>
        </Container>
    )
}

export default LoginPage