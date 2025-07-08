'use client'

import { useFeedback } from '@/context/FeedbackContext'
import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const AlertMessage = () => {
    const { message, severity, open, closeMessage } = useFeedback()
    return (
        <Snackbar open={open}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            autoHideDuration={3000}
            onClose={closeMessage}>
            <Alert
                onClose={closeMessage}
                severity={severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default AlertMessage