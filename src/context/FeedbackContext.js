'use client';

import React, { createContext, useContext, useState } from 'react'

export const FeedbackContext = createContext()


export const FeedbackProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false)
    const [severity, setSeverity] = useState('info')

    const displayMessage = (message, severity) => {
        setMessage(message)
        setSeverity(severity)
        setOpen(true)
    }
    const closeMessage = () => {
        setMessage('')
        setOpen(false)
    }
    const values = { message, severity, open, displayMessage, closeMessage }
    return <FeedbackContext.Provider value={values}>{children}</FeedbackContext.Provider>
}

export function useFeedback() {
    const context = useContext(FeedbackContext)
    return context;
}