import React, { useState } from 'react'
import { DataGrid, GridRowsProp, GridColDef, GridActionsCellItem, GridRowModes, ToolbarButton } from '@mui/x-data-grid';
import { cars, columns } from '@/lib/cars';

import EditIcon from '@mui/icons-material/Edit';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DangerousIcon from '@mui/icons-material/Dangerous';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Toolbar, Tooltip } from '@mui/material';
import Filter from './Filter';


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
                <DialogTitle id="alert-dialog-title">Reject this car?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure? you want to reject this car.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            rejectItem();
                        }}
                        color="error"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}


function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [
            ...oldRows,
            { id, name: '', age: '', role: '', isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <Toolbar>
            <Tooltip title="Add record">
                <Button onClick={handleClick}>
                    <AddIcon fontSize="small" />
                </Button>
                {/* <ToolbarButton onClick={handleClick}>
                    <AddIcon fontSize="small" />
                </ToolbarButton> */}
            </Tooltip>
        </Toolbar>
    );
}

const CarList = () => {

    const [rows, setRows] = React.useState(cars);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const [filter, setFilter] = useState('all')
    const handleStatusFilter = (e) => {
        const value = e.target.value
        setFilter(value)
        if (value === 'all') {
            setRows(cars)
        } else {
            const filteredList = cars.filter((item) => item.status === value)
            setRows(filteredList)
        }

    }


    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
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

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const deleteUser = React.useCallback(
        (id) => () => {
            setTimeout(() => {
                setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            });
        },
        [],
    );

    const approveHandler = (id) => {
        console.log('id', id)
        alert('edit')
    }


    const columns = [
        { field: 'id', headerName: 'Id', },
        { field: 'brand', headerName: 'Brand', flex: 1, editable: true },
        { field: 'model', headerName: 'Model', flex: 1, editable: true },
        { field: 'year', headerName: 'Year', flex: 1, editable: true },
        { field: 'mileage', headerName: 'Mileage', flex: 1, editable: true },
        { field: 'price', headerName: 'Price', flex: 1, editable: true },

        { field: 'condition', headerName: 'Condition', flex: 1, editable: true },

        { field: 'post_date', headerName: 'Post Date', valueGetter: (value) => value && new Date(value).toLocaleDateString(), flex: 1 },
        { field: 'status', headerName: 'Status', width: 100 },
        {
            field: 'actions',
            type: 'actions', headerName: 'Action',
            width: 120,
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem key='save'
                            icon={<SaveIcon />}
                            label="Save"
                            color='success'
                            // material={{
                            //     sx: {
                            //         color: 'primary.success',
                            //     },
                            // }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem key='cancel'
                            icon={<CloseIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem key='edit'
                        icon={<EditIcon color='info' />}
                        label="Edit"
                        onClick={handleEditClick(id)}
                    />,
                    <GridActionsCellItem key='approve'
                        icon={<TaskAltIcon color='success' />}
                        label="Approve"
                        onClick={() => approveHandler(params.id)}
                        showInMenu
                    />,

                    <RejectActionItem key='reject'
                        label="Reject"
                        showInMenu
                        icon={<DangerousIcon color='error' />}
                        rejectItem={deleteUser(id)}
                        closeMenuOnClick={false}
                    />
                ]
            },
        }
    ]


    return (
        // <div style={{ maxHeight:300, width: '100%' }}>
        <div>
            <Filter filter={filter} handleChange={handleStatusFilter} />
            <DataGrid
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
        </div>
    )
}

export default CarList