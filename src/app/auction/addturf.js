import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@mui/material';
import useSettings from "app/hooks/useSettings";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SimpleForm = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const [state, setState] = useState({
        name: '',
        address: '',
        lat: '',
        lng: '',
        ccode: '',
        phone: '',
        city: '',
        sport_type: '',
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value, files } = event.target;

        if (name.startsWith('image') && files.length > 0) {
            const selectedImages = Array.from(files).slice(0, 4);  // Limit to 4 images
            setImageFiles(selectedImages);  // Store selected images
        } else {
            setState({ ...state, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append each key-value pair from the state to formData
        Object.keys(state).forEach(key => {
            formData.append(key, state[key]);
        });

        // formData.append("image", imageFiles);

        imageFiles.forEach((image) => {
            formData.append('image', image); // use the same key 'images[]'
        });


        // Append images if any are selected
        // imageFiles.forEach((file, index) => {
        //     formData.append(`image`, file);
        // });

        try {
            const response = await axios.post('https://myallapps.tech:3024/api/admin/tuff/create', formData, {
                headers: {
                    "Authorization": `Bearer ${userData.token}`,
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log('Tuff created successfully:', response.data);
            navigate('/myturff');
        } catch (error) {
            console.error('Error adding tuff:', error);
            setError('Error adding tuff. Please try again later.');
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
            email: '',
            password: '',
        });
        setImageFiles([]);
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
                        {/* Image Upload */}
                        <Grid item xs={12} sm={6} >
                            <TextField
                                type="file"
                                name={`image`}
                                onChange={handleChange}
                                fullWidth
                                inputProps={{ accept: "image/*", multiple: true }}  // Limit to image files
                            />
                        </Grid>

                        {/* Email Field */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="email"
                                name="email"
                                label="Email (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.email}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                            />
                        </Grid>

                        {/* Password Field */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="password"
                                name="password"
                                label="Password (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.password}
                                error={!!formErrors.password}
                                helperText={formErrors.password}
                            />
                        </Grid>

                        {/* Name Field */}
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
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                            />
                        </Grid>

                        {/* Other Fields */}
                        {/* Similar fields for address, lat, lng, etc. */}
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
                        <Grid item xs={12} sm={3}>
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
                        <Grid item xs={12} sm={3}>
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
                            <FormControl fullWidth required>
                                <InputLabel>Sport Type (Required)</InputLabel>
                                <Select
                                    name="sport_type"
                                    label="Sport Type (Required)"
                                    value={state.sport_type}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="cricket">Cricket</MenuItem>
                                    <MenuItem value="volleyball">Volleyball</MenuItem>
                                    <MenuItem value="football">Football</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Submit and Cancel buttons */}
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
