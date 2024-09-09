import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@mui/material';
import useSettings from "app/hooks/useSettings";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./turf.css";
import axios from 'axios';

const EditSimpleForm = () => {
    const [state, setState] = useState({
        tuff_id: '', // Adding tuff_id for update
        name: '',
        address: '',
        lat: '',
        lng: '',
        ccode: '',
        phone: '',
        image: null,
        delete_img_id: '', // Adding delete_img_id field
    });

    const [logoUrl, setLogoUrl] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const navigate = useNavigate();

    const storedUserData = localStorage.getItem('user');
    let userId = null;
    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        userId = userData.id;
    }

    const storedTuffData = localStorage.getItem('tuffData');
    let tuffId = null;
    if (storedTuffData) {
        const tuffData = JSON.parse(storedTuffData);
        tuffId = tuffData.id;
    }

    const fetchTuffData = async () => {
        try {
            const response = await axios.get('http://myallapps.tech:3024/api/admin/tuff/detail', {
                params: { tuff_id: tuffId }
            });
            const data = response.data;

            setState({
                tuff_id: tuffId,
                name: data.name || '',
                address: data.address || '',
                lat: data.lat || '',
                lng: data.lng || '',
                ccode: data.ccode || '',
                phone: data.phone || '',
                delete_img_id: '', // Reset on fetch
            });
            setLogoUrl(data.image_url || '');
        } catch (error) {
            console.error('Error fetching tuff data', error);
        }
    };

    useEffect(() => {
        if (tuffId) {
            fetchTuffData();
        }
    }, [tuffId]);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'image' && files.length > 0) {
            setState({ ...state, [name]: files[0] });
            setSelectedFileName(files[0].name);
        } else {
            setState({ ...state, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { tuff_id, name, address, lat, lng, image, ccode, phone, delete_img_id } = state;
        const formData = new FormData();
        if (image) {
            formData.append('image', image, image.name);
        }

        const payload = {
            tuff_id,
            name,
            address,
            lat,
            lng,
            ccode,
            phone,
            delete_img_id,
        };

        formData.append('data', JSON.stringify(payload));

        try {
            const response = await axios.post('http://myallapps.tech:3024/api/admin/tuff/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                console.log('Form Submitted:', response.data);
                navigate('/tuff/mytuff');
            } else {
                console.error('Error submitting the form:', response.statusText);
                alert('Error submitting the form. Please try again later.');
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
            alert('Error submitting the form. Please try again later.');
        }
    };

    const handleCancel = () => {
        fetchTuffData();
        navigate(-1);
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
    }, [isMdScreen]);

    const ref = useRef({ isMdScreen, settings });

    return (
        <div>
            <div className="container1">
                {showSidenav && sidenavMode !== "close" && (
                    <SidenavTheme>
                        <Layout1Sidenav />
                    </SidenavTheme>
                )}
            </div>
            <div className="container2" style={{ width: "80%", float: "right" }}>
                <Button
                    color="primary"
                    variant="contained"
                    sx={{ textTransform: "capitalize" }}
                    onClick={() => navigate(-1)}>
                    Go Back
                </Button>
                <Typography variant="h4" align="center" gutterBottom>
                    Edit Tuff
                </Typography>
                <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="file"
                                name="image"
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    accept: 'image/*'
                                }}
                            />
                            {selectedFileName && (
                                <Typography variant="body2" color="textSecondary">
                                    Selected file: {selectedFileName}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {logoUrl && <img src={logoUrl} alt="Tuff Pic" style={{ width: "250px", height: "250px", marginBottom: '10px' }} />}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="name"
                                label="Tuff Name (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.name}
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
                                label="Phone Number (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.phone}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="delete_img_id"
                                label="Delete Image ID (Optional)"
                                onChange={handleChange}
                                fullWidth
                                value={state.delete_img_id}
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
        </div>
    );
};

export default EditSimpleForm;
