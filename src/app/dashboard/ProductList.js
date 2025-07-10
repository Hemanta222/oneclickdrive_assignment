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
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";
import Filter from "./Filter";
import { useContextData } from "@/context/Context";

function RejectActionItem({ rejectItem, ...props }) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <GridActionsCellItem {...props} onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Reject this item?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to set the status as `<b>Reject</b>` ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>No</Button>
          <Button
            onClick={() => {
              setOpen(false);
              rejectItem();
            }}
            // color="error"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

const ProductList = () => {
  const { displayMessage } = useContextData();
  const [products, setProducts] = React.useState([]);
  const [rows, setRows] = React.useState(products);
  const [loading, setLoading] = useState(true);
  const [rowModesModel, setRowModesModel] = React.useState({});

  React.useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch("/api/product/get-products");
        if (res.ok) {
          const data = await res.json();

          if (Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
          } else {
            setProducts([]);
          }
        } else {
          displayMessage(res.statusText, "error");
        }
      } catch (error) {
        displayMessage(error.message || error, "error");
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  React.useEffect(() => {
    setRows(products);
  }, [products]);

  const [filter, setFilter] = useState("all");

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (value === "all") {
      setRows(products);
    } else {
      const filteredList = products.filter((item) => item.status === value);
      setRows(filteredList);
    }
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
      const res = await fetch("/api/product/edit-product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newRow }),
      });
      if (res.ok) {
        const json = await res.json();
        displayMessage(json.message, "success");
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      } else {
        displayMessage(res.statusText, "error");
      }
    } catch (error) {
      displayMessage(error.message || error, "error");
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRejectItem = React.useCallback(
    (id) => async () => {
      try {
        const res = await fetch("/api/product/update-product-status", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id, status: "reject" }),
        });
        if (res.ok) {
          const json = await res.json();
          setRows((prevRows) =>
            prevRows.map((row) => {
              if (row.id === id) {
                return { ...row, status: "reject" };
              } else return row;
            })
          );
          displayMessage(json.message, "success");
        } else {
          displayMessage(res.statusText, "error");
        }
      } catch (error) {
        displayMessage(error.message || error, "error");
      }
    },
    []
  );

  const approveHandler = (id) => async () => {
    try {
      const res = await fetch("/api/product/update-product-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, status: "approve" }),
      });
      if (res.ok) {
        const json = await res.json();
        setRows((prevRows) =>
          prevRows.map((row) => {
            if (row.id === id) {
              return { ...row, status: "approve" };
            } else return row;
          })
        );
        displayMessage(json.message, "success");
      } else {
        displayMessage(res.statusText, "error");
      }
    } catch (error) {
      displayMessage(error.message || error, "error");
    }
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

          <RejectActionItem
            key="reject"
            label="Reject"
            showInMenu
            icon={<DangerousIcon color="error" />}
            rejectItem={handleRejectItem(id)}
            closeMenuOnClick={false}
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
          justifyContent:'space-between',
        alignItems: "flex-end",
        gap: 3,
      }}
    >
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
