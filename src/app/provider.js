'use client';

import { FeedbackProvider } from '@/context/FeedbackContext'
import React from 'react'

const Provider = ({ children }) => {
    return <FeedbackProvider>{children}</FeedbackProvider>
}

export default Provider