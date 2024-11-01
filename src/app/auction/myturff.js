import 'bootstrap/dist/css/bootstrap.min.css';
import { Fragment, useEffect, useState, useRef } from "react";
import { styled, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import '@grapecity/wijmo.styles/wijmo.css';
import './myauction.css';
import './turf.css';
import useSettings from "app/hooks/useSettings";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout1Topbar from "app/components/MatxLayout/Layout1/Layout1Topbar";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

export default function MyAuction() {
    const navigate = useNavigate();
    const { settings, updateSettings } = useSettings();
    const { layout1Settings } = settings;
    const theme = useTheme();

    const [turfs, setTurfs] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedTurffId, setSelectedTurffId] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(20);
    const limit = 10; // Items per page

    const {
        leftSidebar: { mode: sidenavMode, show: showSidenav }
    } = layout1Settings;
    const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
    const ref = useRef({ isMdScreen, settings });

    useEffect(() => {
        let { settings } = ref.current;
        let sidebarMode = settings.layout1Settings.leftSidebar.mode;
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? "close" : sidebarMode;
            updateSettings({ layout1Settings: { leftSidebar: { mode } } });
        }

        fetchTurfs(); // Fetch turfs when component mounts

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen, currentPage]);

    const fetchTurfs = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`https://myallapps.tech:3024/api/admin/tuff/get?page=${currentPage}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = response.data.data.tuffData || [];
            setTurfs(result);
            setTotalPages(response.data.data.totalRecords || 20); // Assuming the API returns totalPages
        } catch (error) {
            console.error('Error fetching turfs:', error);
            toast.error('Failed to fetch turfs.');
        }
    };

    const handleEdit = (id) => {
        navigate(`/auction/editturf/${id}`);
    };

    const handleActivateDeactivate = (id, currentStatus) => {
        setSelectedTurffId(id);
        setNewStatus(currentStatus === 'active' ? 'deactive' : 'active');
        setOpen(true);
    };

    const handleConfirm = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.post('https://myallapps.tech:3024/api/admin/tuff/activeDeactive', {
                tuff_id: selectedTurffId,
                status: newStatus,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success('Turff status updated successfully.');
            fetchTurfs();
        } catch (error) {
            console.error('Error updating turff status:', error);
            toast.error('Failed to update turff status.');
        } finally {
            setOpen(false);
        }
    };

    const handlePasswordChange = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.post('https://myallapps.tech:3024/api/admin/tuff/changePassword', {
                tuff_id: selectedTurffId,
                new_password: newPassword,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success('Password changed successfully.');
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Failed to change password.');
        } finally {
            setOpenPasswordDialog(false);
            setNewPassword("");
        }
    };

    const openPasswordDialogHandler = (id) => {
        setSelectedTurffId(id);
        setOpenPasswordDialog(true);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <>
            <Layout1Topbar />

            <Container>
                <div className="container1">
                    {showSidenav && sidenavMode !== "close" && (
                        <SidenavTheme>
                            <Layout1Sidenav />
                        </SidenavTheme>
                    )}
                </div>
                <div className="container2">
                    <Fragment>
                        <ContentBox className="auction">
                            {!isMdScreen && (
                                <Button
                                    color="primary"
                                    variant="contained"
                                    sx={{ textTransform: "capitalize" }}
                                    onClick={() => {
                                        navigate(-1);
                                        toast.info("Navigating back.");
                                    }}
                                >
                                    Go Back
                                </Button>
                            )}
                            <h1 style={{ textAlign: "center" }}>Turff List</h1>
                            <div className="row mb-3">
                                <div className="col-md-12 text-center">
                                    <button
                                        onClick={() => navigate("/auction/addturf")}
                                        className="btn btn-sm btn-success mb-2"
                                    >
                                        Add Turff
                                    </button>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="mat-elevation-z5 mdc-table">
                                    <thead>
                                        <tr className="mdc-table-header-row">
                                            <th>Action</th>
                                            <th>Turff Name</th>
                                            <th>Address</th>
                                            <th>City</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Sport Type</th>
                                            <th>Status</th>
                                            <th>Coordinates</th>
                                            <th>Images</th>
                                            <th>Change Password</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {turfs.length > 0 ? (
                                            turfs.map((turff) => (
                                                <tr className={`mdc-table-row ${turff.status === 'deactive' ? 'inactive-turff' : ''}`} key={turff._id}>
                                                    <td>
                                                        <div className="tooltip-wrapper">
                                                            <button type="button" className="tooltips mdc-icon-button mdc-ripple-upgraded--unbounded" onClick={() => handleActivateDeactivate(turff._id, turff.status)}>
                                                                <i className="material-icons">{turff.status === 'active' ? 'toggle_on' : 'toggle_off'}</i>
                                                                <span className="tooltiptexts">{turff.status === 'active' ? 'Deactivate Turff' : 'Activate Turff'}</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>{turff.name || 'N/A'}</td>
                                                    <td>{turff.address || 'N/A'}</td>
                                                    <td>{turff.city || 'N/A'}</td>
                                                    <td>{turff.phone || 'N/A'}</td>
                                                    <td>{turff.email || 'N/A'}</td>
                                                    <td>{turff.sport_type || 'N/A'}</td>
                                                    <td>{turff.status === 'active' ? 'Active' : 'Inactive'}</td>
                                                    <td>{turff.location?.coorditantes.join(', ') || 'N/A'}</td>
                                                    <td>
                                                        {turff.image.length > 0 ? (
                                                            turff.image.map((imgObj) => (
                                                                <img
                                                                    key={imgObj._id}
                                                                    src={imgObj.img}
                                                                    alt="Turff"
                                                                    style={{ width: '50px', height: '50px', marginRight: '5px' }}
                                                                />
                                                            ))
                                                        ) : 'No Images'}
                                                    </td>
                                                    <td>
                                                        <Button variant="outlined" onClick={() => openPasswordDialogHandler(turff._id)}>Change Password</Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="mdc-table-row">
                                                <td colSpan="11" style={{ textAlign: 'center' }}>No turfs available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Controls */}
                            <div className="pagination-controls text-center">
                                <Button disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</Button>
                                <span> Page {currentPage} of {totalPages} </span>
                                <Button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</Button>
                            </div>
                        </ContentBox>
                    </Fragment>
                </div>
            </Container>

            {/* Confirmation Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to {newStatus === 'active' ? 'activate' : 'deactivate'} this turff?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleConfirm} color="primary">{newStatus === 'active' ? 'Activate' : 'Deactivate'}</Button>
                </DialogActions>
            </Dialog>

            {/* Password Change Dialog */}
            <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a new password for this turff.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPasswordDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={handlePasswordChange} color="primary">Change Password</Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </>
    );
}
