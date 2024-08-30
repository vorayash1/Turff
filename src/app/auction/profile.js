import React from 'react';
import { Container, Typography, Grid, Paper, ListItem, ListItemText, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useSettings from "app/hooks/useSettings";
import { useEffect, useRef } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import 'bootstrap/dist/css/bootstrap.min.css';
import './auction.css';



function Profile() {
    const navigate = useNavigate();

    const { settings, updateSettings } = useSettings();
    const { layout1Settings } = settings;
    const theme = useTheme();

    const {
        leftSidebar: { mode: sidenavMode, show: showSidenav }
    } = layout1Settings;
    const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));


    useEffect(() => {
        let { settings } = ref.current;
        let sidebarMode = settings.layout1Settings.leftSidebar.mode;
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? "close" : sidebarMode;
            updateSettings({ layout1Settings: { leftSidebar: { mode } } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen]);
    const ref = useRef({ isMdScreen, settings });

    return (
        <>
            <div className="container1">
                {showSidenav && sidenavMode !== "close" && (
                    <SidenavTheme>
                        <Layout1Sidenav />
                    </SidenavTheme>
                )}
            </div>
            <div className="container2" style={{ width: "82%", float: "right", margin: "15px -35px 0px 15px" }}>
                <Button
                    color="primary"
                    variant="contained"
                    sx={{ textTransform: "capitalize" }}
                    onClick={() => navigate("/")}>
                    Go Back
                </Button>
                <Container maxWidth="md">
                    <Typography variant="h4" align="center" gutterBottom>
                        Profile Page
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                <Avatar
                                    alt="Profile Picture"
                                    src="/path/to/profile.jpg" // Provide the URL to the profile picture
                                    sx={{ width: 150, height: 150, margin: 'auto' }}
                                />
                                <Typography variant="h6" gutterBottom>User Information</Typography>
                                <ListItem disablePadding>
                                    <ListItemText primary="Name: John Doe" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Email: john.doe@example.com" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Age: 30" />
                                </ListItem>
                                <Button variant="contained" color="primary" style={{ marginTop: '16px' }}>Change Photo</Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6" gutterBottom>Address</Typography>
                                <ListItem disablePadding>
                                    <ListItemText primary="Street: 123 Main St" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="City: Anytown" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="State: State" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Zip: 12345" />
                                </ListItem>
                            </Paper>
                            <Paper elevation={3} sx={{ padding: 2, marginTop: '16px' }}>
                                <Typography variant="h6" gutterBottom>Interests</Typography>
                                <ListItem disablePadding>
                                    <ListItemText primary="Coding" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Reading" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Hiking" />
                                </ListItem>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </>
    );
}

export default Profile;
