import 'bootstrap/dist/css/bootstrap.min.css';
import { Fragment, useEffect, useState, useRef } from "react";
import { styled, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import Layout1Topbar from "app/components/MatxLayout/Layout1/Layout1Topbar";
import useSettings from "app/hooks/useSettings";

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

    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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

        fetchUsers(); // Fetch users when component mounts or page changes

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen, currentPage]);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(`https://myallapps.tech:3024/api/admin/user`, {
                page: currentPage,
                limit: limit,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const usersData = response.data.data.user || [];
            setUsers(usersData);
            setTotalPages(Math.ceil(response.data.data.totalRecords / limit)); // Calculate total pages
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users.');
        }
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
                            <h1 style={{ textAlign: "center" }}>User List</h1>
                            {/* <div className="row mb-3">
                                <div className="col-md-12 text-center">
                                    <button
                                        onClick={() => navigate("/adduser")}
                                        className="btn btn-sm btn-success mb-2"
                                    >
                                        Add User
                                    </button>
                                </div>
                            </div> */}
                            <div className="table-responsive">
                                <table className="mat-elevation-z5 mdc-table">
                                    <thead>
                                        <tr className="mdc-table-header-row">
                                            <th>User ID</th>
                                            <th>Name</th>
                                            <th>Country Code</th>
                                            <th>Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr className="mdc-table-row" key={user._id}>
                                                    <td>{user._id}</td>
                                                    <td>{user.name || 'N/A'}</td>
                                                    <td>{user.ccode || 'N/A'}</td>
                                                    <td>{user.phone || 'N/A'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="mdc-table-row">
                                                <td colSpan="4" style={{ textAlign: 'center' }}>No users available</td>
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

            <ToastContainer />
        </>
    );
}
