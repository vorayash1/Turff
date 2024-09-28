import 'bootstrap/dist/css/bootstrap.min.css';
import { Fragment, useEffect, useState, useRef } from "react";
import { styled, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
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

    const [turfs, setTurfs] = useState([]); // State to hold the fetched data
    const [open, setOpen] = useState(false); // State for dialog
    const [selectedTurffId, setSelectedTurffId] = useState(null); // State to hold the selected turff ID
    const [newStatus, setNewStatus] = useState(""); // Change this to an empty string

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
    }, [isMdScreen]);

    const fetchTurfs = async () => {
        const token = localStorage.getItem('token'); // Get the token from localStorage

        try {
            const response = await axios.get('https://myallapps.tech:3024/api/admin/tuff/get', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the header
                    'Content-Type': 'application/json'
                }
            });

            const result = response.data.data.tuffData || [];  // Get the tuff data from the response
            setTurfs(result);  // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching turfs:', error);
            toast.error('Failed to fetch turfs.');
        }
    };

    const handleEdit = (id) => {
        navigate(`/auction/editturf/${id}`);  // Pass the turf ID to the edit page
    };

    const handleActivateDeactivate = (id, currentStatus) => {
        setSelectedTurffId(id);
        // Set newStatus based on currentStatus
        setNewStatus(currentStatus === 'active' ? 'deactive' : 'active'); // Toggle the status to string
        setOpen(true); // Open the confirmation dialog
    };

    const handleConfirm = async () => {
        const token = localStorage.getItem('token'); // Get the token from localStorage

        try {
            await axios.post('https://myallapps.tech:3024/api/admin/tuff/activeDeactive', {
                tuff_id: selectedTurffId,
                status: newStatus, // Send the string status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the header
                    'Content-Type': 'application/json'
                }
            });

            toast.success('Turff status updated successfully.');
            fetchTurfs(); // Refresh the turfs after updating status
        } catch (error) {
            console.error('Error updating turff status:', error);
            toast.error('Failed to update turff status.');
        } finally {
            setOpen(false); // Close the dialog
        }
    };

    const handleList = () => {
        navigate("/auction/booking/list");
        toast.info("Navigating to player list page.");
    };

    return (
        <>
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
                            <h1 style={{ textAlign: "center" }}>Turff List</h1>
                            <div className="row mb-3">
                                <div className="col-md-12 text-center">
                                    <button
                                        onClick={() => navigate("/auction/addturf")}
                                        className={`btn btn-sm btn-success mb-2`}
                                    >
                                        Add Turff
                                    </button>
                                </div>
                            </div>
                            <div className="">
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {turfs.length > 0 ? (
                                            turfs.map((turff) => (
                                                <tr className="mdc-table-row" key={turff._id}>
                                                    <td >
                                                        {/* <div className="tooltip-wrapper">
                                                            <button type="button" className="tooltips mdc-icon-button mdc-ripple-upgraded--unbounded" onClick={() => handleEdit(turff._id)}>
                                                                <i className="material-icons">edit</i>
                                                                <span className="tooltiptexts">Edit Turff</span>
                                                            </button>
                                                        </div> */}
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
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="mdc-table-row">
                                                <td colSpan="10" style={{ textAlign: 'center' }}>No turfs available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
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

            <ToastContainer />
        </>
    );
}
