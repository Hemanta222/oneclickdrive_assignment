'use client'
import React from 'react'
import CarList from './CarList'
import { Box, Container } from '@mui/material'

const DashboardPage = () => {
  return (
    <Container maxWidth='xl'> Dashboard Page
      <CarList />
      <br/>
    </Container>
  )
}

export default DashboardPage