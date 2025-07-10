"use client";
import React, { useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DangerousIcon from "@mui/icons-material/Dangerous";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { Box, Paper } from "@mui/material";
import Filter from "./Filter";

import { useContextData } from "@/context/Context";
import { editProduct, updateProductStatus } from "@/lib/actions";

import RejectConfirmModal from "./RejectConfirmModal";

const ProductList = ({ initialProducts }) => {
  const { displayMessage } = useContextData();
  const [rows, setRows] = React.useState(initialProducts);
  const [loading, setLoading] = useState(true);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [filter, setFilter] = useState("all");

  React.useEffect(() => {
    let filteredList = [];
    if (filter === "all") {
      filteredList = initialProducts;
    } else {
      filteredList = initialProducts.filter((item) => item.status === filter);
    }

    setRows(filteredList);
    setLoading(false);
  }, [initialProducts, filter]);

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setFilter(value);

  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    try {
      const response = await editProduct(updatedRow);
      if (response.success) {
        displayMessage(response.message, "success");
        return updatedRow;
      } else {
        displayMessage(response.message, "error");
      }
    } catch (error) {
      displayMessage(error.message, "error");
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const modalOpenHandler = (id) => {
    setSelectedProductId(id);
    setShowModal(true);
  };
  const modalCloseHandler = () => {
    setSelectedProductId(0);
    setShowModal(false);
  };
  const handleRejectItem = async () => {
    try {
      const response = await updateProductStatus(selectedProductId, "reject");
      if (response.success) {
        displayMessage(response.message, "success");
      } else {
        displayMessage(response.message, "error");
      }
    } catch (error) {
      displayMessage(error.message, "error");
    }
  };

  const approveHandler = (id) => async () => {
    try {
      const response = await updateProductStatus(id, "approve");
      if (response.success) {
        displayMessage(response.message, "success");
      } else {
        displayMessage(response.message, "error");
      }
    } catch (error) {
      displayMessage(error.message, "error");
    }
    // try {
    //   const res = await fetch("/api/product/update-product-status", {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ id: id, status: "approve" }),
    //   });
    //   if (res.ok) {
    //     const json = await res.json();
    //     setRows((prevRows) =>
    //       prevRows.map((row) => {
    //         if (row.id === id) {
    //           return { ...row, status: "approve" };
    //         } else return row;
    //       })
    //     );
    //     displayMessage(json.message, "success");
    //   } else {
    //     displayMessage(res.statusText, "error");
    //   }
    // } catch (error) {
    //   displayMessage(error.message || error, "error");
    // }
  };
  const columns = [
    { field: "id", headerName: "Id" },
    { field: "brand", headerName: "Brand", flex: 1, editable: true },
    { field: "model", headerName: "Model", flex: 1, editable: true },
    { field: "year", headerName: "Year", flex: 1, editable: true },
    { field: "mileage", headerName: "Mileage", flex: 1, editable: true },
    { field: "price", headerName: "Price", flex: 1, editable: true },

    { field: "condition", headerName: "Condition", flex: 1, editable: true },

    {
      field: "post_date",
      headerName: "Post Date",
      valueGetter: (value) => value && new Date(value).toLocaleDateString(),
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        let color = "orange";
        if (params.value === "approve") {
          color = "green";
        }
        if (params.value === "reject") {
          color = "red";
        }
        return <span style={{ color: color }}>{params.value}</span>;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 120,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              color="success"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CloseIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon color="info" />}
            label="Edit"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            key="approve"
            icon={<TaskAltIcon color="success" />}
            label="Approve"
            onClick={approveHandler(id)}
            showInMenu
          />,
          <GridActionsCellItem
            key="reject"
            icon={<DangerousIcon color="error" />}
            label="Reject"
            onClick={() => modalOpenHandler(id)}
            showInMenu
          />,
        ];
      },
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
      {showModal && (
        <RejectConfirmModal
          open={showModal}
          closeModal={modalCloseHandler}
          rejectItem={handleRejectItem}
        />
      )}
      <Filter filter={filter} handleChange={handleStatusFilter} />
      <Box sx={{ width: "100%" }}>
        <DataGrid
          loading={loading}
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
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
