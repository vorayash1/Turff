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
    const [imageFile, setImageFile] = useState(null);  // updated to match "image" field in API

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    // Updated state with required fields
    const [state, setState] = useState({
        name: '',
        address: '',
        lat: '',
        lng: '',
        ccode: '',
        phone: '',
        city: '',
        sport_type: '',
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'image' && files.length > 0) {
            setImageFile(files[0]);  // store the selected image
        } else {
            setState({ ...state, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (imageFile) {
            formData.append('image', imageFile);  // append image to form data
        }

        const payload = {
            ...state,
            user_id: userData ? userData.id : null  // include user_id if available
        };

        formData.append('data', JSON.stringify(payload));

        try {
            const response = await axios.post('http://myallapps.tech:3024/api/admin/tuff/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Auction created successfully:', response.data);
            navigate('/auction/myturff');  // navigate on successful submission
        } catch (error) {
            console.error('Error adding auction:', error);
            setError('Error adding auction. Please try again later.');
        }
    };

    const handleCancel = () => {
        setState({
            name: '',
            address: '',
            lat: '',
            lng: '',
            ccode: '',
            phone: '',
            city: '',
            sport_type: '',
        });
        setImageFile(null);
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
                    <Grid container spacing={3} style={{ paddingRight: "10px" }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="file"
                                name="image"  // updated field name for API
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
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="address"
                                label="Address (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.address}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="lat"
                                label="Latitude (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.lat}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="lng"
                                label="Longitude (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.lng}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="ccode"
                                label="Country Code (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.ccode}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="phone"
                                label="Phone (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.phone}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="city"
                                label="City (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.city}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="sport_type"
                                label="Sport Type (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.sport_type}
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
            </div >
        </>
    );
};

export default SimpleForm;
