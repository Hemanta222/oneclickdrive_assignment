import React from "react";
import ProductList from "./ProductList";
import { Box, Container, Typography } from "@mui/material";
import { getProducts } from "@/lib/actions";
import { getLogs } from "@/lib/logs";
export default async function DashboardPage() {
  const initialProducts = await getProducts();
  const getLogss = await getLogs();

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
        <ProductList initialProducts={initialProducts} />
        <br />
      </Container>
    </>
  );
}
