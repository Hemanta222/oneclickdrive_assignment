'use client';

import { Provider } from '@/context/Context'
import React from 'react'

const AppProvider = ({ children }) => {
    return <Provider >{children}</Provider>
}

export default AppProvider