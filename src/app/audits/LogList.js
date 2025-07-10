"use client";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import { Box, Paper } from "@mui/material";

const ProductList = ({ logRecords }) => {
  const [rows, setRows] = React.useState(logRecords);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setRows(logRecords);
    setLoading(false);
  }, [logRecords]);

  const columns = [
    { field: "id", headerName: "Log ID" },
    { field: "user_id", headerName: "User Id", flex: 1 },
    { field: "user_email", headerName: "User Email", flex: 1 },
    { field: "action_type", headerName: "Action Type", flex: 1 },
    { field: "target_entity_id", headerName: "Target Entity id", flex: 1 },
    {
      field: "details",
      headerName: "Details",
      valueGetter: (value) => value && JSON.stringify(value),
      flex: 1,
    },
    {
      field: "timestamps",
      headerName: "Timestamps",
      valueGetter: (value) => value && new Date(value).toLocaleDateString(),
      flex: 1,
    },
  ];

  return (
    <Paper
      elevation={8}
      sx={{
        width: "100%",
        p: 2,
        borderRadius: "16px",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 3,
      }}
    >
      <Box sx={{ width: "100%" }}>
        <DataGrid
          loading={loading}
          rows={rows}
          columns={columns}
          pagination={true}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default ProductList;
