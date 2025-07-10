'use client';

import { Provider } from '@/context/Context'
import React from 'react'

const AppProvider = ({ children,userDetails }) => {
    return <Provider userDetails={userDetails}>{children}</Provider>
}

export default AppProvider