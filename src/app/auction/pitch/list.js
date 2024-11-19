import React, { useEffect, useState, useRef } from "react";
import {
    styled,
    Button,
    useMediaQuery,
    useTheme,
    Card,
    CardContent,
    Typography,
    Grid,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Layout1Topbar from "app/components/MatxLayout/Layout1/Layout1Topbar";
import Layout1Sidenav from "app/components/MatxLayout/Layout1/Layout1Sidenav";
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import useSettings from "app/hooks/useSettings";

// Styled Components
const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const PitchCard = styled(Card)(({ theme }) => ({
    margin: "10px 0",
    padding: "10px",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
}));

const Header = styled("div")(({ theme }) => ({
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
}));

export default function PitchList() {
    const [pitches, setPitches] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // Items per page

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState(""); // "add" or "edit"
    const [formData, setFormData] = useState({ name: "", pitch_id: "" });

    const { settings, updateSettings } = useSettings();
    const { layout1Settings } = settings;
    const {
        leftSidebar: { mode: sidenavMode, show: showSidenav }
    } = layout1Settings;

    const theme = useTheme();
    const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
    const ref = useRef({ isMdScreen, settings });

    useEffect(() => {
        let { settings } = ref.current;
        let sidebarMode = settings.layout1Settings.leftSidebar.mode;
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? "close" : sidebarMode;
            updateSettings({ layout1Settings: { leftSidebar: { mode } } });
        }

        fetchPitches(); // Fetch pitches whenever the page changes
    }, [currentPage, isMdScreen]);

    const fetchPitches = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                "https://myallapps.tech:3024/api/admin/pitch/getPitch",
                {
                    page: currentPage,
                    limit,
                    search: "",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const pitchData = response.data.data.pitchData || [];
            setPitches(pitchData);
            setTotalPages(Math.ceil(response.data.data.totalRecords / limit));
        } catch (error) {
            console.error("Error fetching pitches:", error);
            toast.error("Failed to fetch pitches.");
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleOpenDialog = (type, pitch = {}) => {
        setDialogType(type);
        if (type === "edit") {
            setFormData({ name: pitch.name, pitch_id: pitch._id });
        } else {
            setFormData({ name: "", pitch_id: "" });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({ name: "", pitch_id: "" });
    };

    const handleFormSubmit = async () => {
        const token = localStorage.getItem("token");
        const url =
            dialogType === "add"
                ? "https://myallapps.tech:3024/api/admin/pitch/createPitch"
                : "https://myallapps.tech:3024/api/admin/pitch/updatepitch";

        const payload =
            dialogType === "add"
                ? { name: formData.name }
                : { name: formData.name, pitch_id: formData.pitch_id };

        try {
            await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success(`Pitch ${dialogType === "add" ? "added" : "updated"} successfully.`);
            handleCloseDialog();
            fetchPitches(); // Refresh the pitch list
        } catch (error) {
            console.error(`Error ${dialogType === "add" ? "adding" : "updating"} pitch:`, error);
            toast.error(`Failed to ${dialogType === "add" ? "add" : "update"} pitch.`);
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
                    <Header>
                        <Typography variant="h5" component="h2">
                            Pitch List
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenDialog("add")}
                        >
                            Add Pitch
                        </Button>
                    </Header>
                    <Grid container spacing={2}>
                        {pitches.length > 0 ? (
                            pitches.map((pitch) => (
                                <Grid item xs={12} md={6} key={pitch._id}>
                                    <PitchCard>
                                        <CardContent>
                                            <Typography variant="h6" color="primary">
                                                {pitch.name}
                                            </Typography>
                                            {/* <Typography variant="body2" color="textSecondary">
                                                Pitch ID: {pitch._id}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Admin ID: {pitch.admin_id}
                                            </Typography> */}
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                style={{ marginTop: "10px" }}
                                                onClick={() => handleOpenDialog("edit", pitch)}
                                            >
                                                Edit
                                            </Button>
                                        </CardContent>
                                    </PitchCard>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="body1" style={{ margin: "20px auto" }}>
                                No pitches available
                            </Typography>
                        )}
                    </Grid>
                    {/* Pagination */}
                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </div>
                </div>
            </Container>

            {/* Dialog for Add/Edit */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{dialogType === "add" ? "Add Pitch" : "Edit Pitch"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Pitch Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleFormSubmit} color="primary">
                        {dialogType === "add" ? "Add" : "Update"}
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </>
    );
}
