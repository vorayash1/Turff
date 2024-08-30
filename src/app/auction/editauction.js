import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@mui/material';
import useSettings from "app/hooks/useSettings";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./auction.css";
import axios from 'axios';

const EditSimpleForm = () => {
    const [state, setState] = useState({
        auction_logo: null,
        name: '',
        auction_date: new Date().toISOString().split('T')[0],
        type_sport: '',
        point_per_team: '',
        min_bid: '',
        bid_increase_by: '',
        player_per_team: '',
    });
    const [logoUrl, setLogoUrl] = useState('');
    // const [currentLogoUrl, setCurrentLogoUrl] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const navigate = useNavigate();

    // Retrieve userId from localStorage
    const storedUserData = localStorage.getItem('user');
    let userId = null;
    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        userId = userData.id;
    }

    // Retrieve auctionId from localStorage
    const storedAuctionData = localStorage.getItem('auctionData');
    let auctionId = null;
    if (storedAuctionData) {
        const auctionDataArray = JSON.parse(storedAuctionData);
        if (Array.isArray(auctionDataArray) && auctionDataArray.length > 0) {
            const firstAuction = auctionDataArray[0];
            auctionId = firstAuction.id;
        }
    }

    const fetchAuctionData = async () => {
        try {
            const response = await axios.get('https://54ab838584.nxcli.io/auction_portal/n.php', {
                params: { auctionId, user_id: userId }
            });
            const data = response.data;
            setState({
                auction_logo: null,
                name: data.data.auction_name || '',
                auction_date: data.data.auction_date || new Date().toISOString().split('T')[0],
                type_sport: data.data.type_sport || '',
                point_per_team: data.data.point_per_team || '',
                min_bid: data.data.min_bid || '',
                bid_increase_by: data.data.bid_increase || '',
                player_per_team: data.data.player_per_team || '',
            });
            const logoPath = data.data.auction_logo ? data.data.auction_logo.replace('C:fakepath', 'https://54ab838584.nxcli.io/auction_portal/') : '';
            setLogoUrl(logoPath);
            // setCurrentLogoUrl(logoPath);
        } catch (error) {
            console.error('Error fetching auction data', error);
        }
    };

    useEffect(() => {
        if (auctionId && userId) {
            fetchAuctionData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auctionId, userId]);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'auction_logo' && files.length > 0) {
            setState({ ...state, [name]: files[0] });
            setSelectedFileName(files[0].name);
        } else {
            setState({ ...state, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Extracting data from state
        const { auction_logo, name, auction_date, type_sport, point_per_team, min_bid, bid_increase_by, player_per_team } = state;
        const formData = new FormData();
        if (auction_logo) {
            formData.append('auction_logo', auction_logo, auction_logo.name);
        }

        // Constructing payload object
        const payload = {
            auctionId,
            user_id: userId,
            name,
            auction_date,
            type_sport,
            point_per_team,
            min_bid,
            bid_increase_by,
            player_per_team,
            // current_logo_url: currentLogoUrl
        };

        formData.append('data', JSON.stringify(payload));

        try {
            // Sending data via POST request
            const response = await axios.post('https://54ab838584.nxcli.io/auction_portal/edit_auction.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handling response
            if (response.status === 200) {
                console.log('Form Submitted:', response.data);
                navigate('/auction/myauction');
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
        fetchAuctionData(); // reset the form to original data
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    Edit Auction
                </Typography>
                <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="file"
                                name="auction_logo"
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
                            {logoUrl && <img src={logoUrl} alt="Auction Logo" style={{ width: "250px", height: "250px", marginBottom: '10px' }} />}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="name"
                                label="Auction Name (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="date"
                                name="auction_date"
                                label="Auction Date (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                                value={state.auction_date}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="text"
                                name="type_sport"
                                label="Type of Sport (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.type_sport}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="point_per_team"
                                label="Points per Team (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.point_per_team}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="min_bid"
                                label="Minimum Bid (Required)"
                                onChange={handleChange}
                                fullWidth
                                required
                                value={state.min_bid}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="number"
                                name="bid_increase_by"
                                label="Bid Increase By (Required)"
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
                                label="Players per Team (Required)"
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
        </div>
    );
};

export default EditSimpleForm;
