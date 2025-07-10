import React from "react";
import LogList from "./LogList";
import { Box, Container, Typography } from "@mui/material";
import { getLogs } from "@/lib/logs";
export default async function DashboardPage() {
  const logRecords = await getLogs();
  console.log("getLoggs", logRecords);

  return (
    <>
      <Container maxWidth="xl">
        <Box
          mt={3}
          mb={2}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Typography variant="h5" component="h1">
            Audit Logs
          </Typography>
          <Typography variant="body1" component="p" color="grey">
            / Logs
          </Typography>
        </Box>
        <LogList logRecords={logRecords.logs} />
        <br />
      </Container>
    </>
  );
}
