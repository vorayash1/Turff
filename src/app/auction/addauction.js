import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@mui/material';
import useSettings from "app/hooks/useSettings";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const SimpleForm = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [auctionLogoFile, setAuctionLogoFile] = useState(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const [state, setState] = useState({
        name: '',
        auction_date: new Date().toISOString().split('T')[0],
        type_sport: '',
        point_per_team: '',
        min_bid: '',
        bid_increase_by: '',
        player_per_team: '',
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'auction_logo' && files.length > 0) {
            setAuctionLogoFile(files[0]);
        } else {
            setState({ ...state, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (auctionLogoFile) {
            formData.append('auction_logo', auctionLogoFile);
        }

        const payload = {
            ...state,
            user_id: userData ? userData.id : null
        };

        formData.append('data', JSON.stringify(payload));

        try {
            navigate('/auction/myauction');
        } catch (error) {
            console.error('Error adding auction:', error);
            setError('Error adding auction. Please try again later.');
        }
    };

    const handleCancel = () => {
        setState({
            name: '',
            auction_date: new Date().toISOString().split('T')[0],
            type_sport: '',
            point_per_team: '',
            min_bid: '',
            bid_increase_by: '',
            player_per_team: '',
        });
        setAuctionLogoFile(null);
    };

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
    }, [isMdScreen, updateSettings]);

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
            <div className="container2sub" style={{ float: "right" }}>
                <Button
                    color="primary"
                    variant="contained"
                    sx={{ textTransform: "capitalize" }}
                    onClick={() => navigate(-1)}>
                    Go Back
                </Button>
                <Typography variant="h4" align="center" gutterBottom>
                    Create Turff
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="file"
                                name="turff_logo"
                                label=""
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="name"
                                label="Turff Name (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.name}
                                inputProps={{ pattern: "^[a-zA-Z0-9 ]{3,50}$" }}
                            // error={!/^[a-zA-Z0-9 ]{3,50}$/.test(state.name)}
                            // helperText={!/^[a-zA-Z0-9 ]{3,50}$/.test(state.name) ? "Name must be 3-50 characters long and can only contain letters, numbers, and spaces." : ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="number_of_turff_pitch"
                                label="Numbers of pitch in your turff (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.point_per_team}
                                inputProps={{ min: 1 }}
                                // error={state.point_per_team <= 0}
                                // helperText={state.point_per_team <= 0 ? "Numbers of pitch must be a positive number." : ""}
                                className="no-spinner" // Add class name for styling
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="min_bid"
                                label="Default Price for your turff (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.min_bid}
                                inputProps={{ min: 1 }}
                            // error={state.min_bid <= 0}
                            // helperText={state.min_bid <= 0 ? "Default Price must be a positive number." : ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="bid_increase_by"
                                label="Owner Name (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.bid_increase_by}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="player_per_team"
                                label="Owner's Phone Number (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.player_per_team}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <Button
                                color="primary"
                                variant="contained"
                                type="submit"
                                sx={{ marginRight: 1 }}
                            >
                                Save
                            </Button>
                            <Button color="primary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </>
    );
};

export default SimpleForm;
