"use client";
import React from "react";
import ProductList from "./ProductList";
import { Box, Container, Typography } from "@mui/material";
import { useContextData } from "@/context/Context";
const DashboardPage = () => {

  const { setUserData } = useContextData();
  
  React.useEffect(() => {
    async function fetchData() {
      const userRes = await fetch("/api/auth/get-user");
      if (userRes.ok) {
        const userData = await userRes.json();
        console.log("user", userData);
        setUserData({ userId: userData.user.id, email: userData.user.email });
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container maxWidth="xl">
        <Box
          mt={3}
          mb={2}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Typography variant="h5" component="h1">
            Dashboard
          </Typography>
          <Typography variant="body1" component="p" color="grey">
            / Product List
          </Typography>
        </Box>
        <ProductList />
        <br />
      </Container>
    </>
  );
};

export default DashboardPage;
