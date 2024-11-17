import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Grid, Paper, Button, TextField } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import useSettings from "app/hooks/useSettings";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import "../turf.css";

function UpdateTeam() {
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerNumber, setOwnerNumber] = useState('');
    const [ownerMailAddress, setOwnerMailAddress] = useState('');
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoError, setLogoError] = useState(false);
    const location = useLocation();
    const teamId = new URLSearchParams(location.search).get('teamId');
    const storedAuctionData = localStorage.getItem('auctionData');
    let auctionId = null;
    if (storedAuctionData) {
        const auctionDataArray = JSON.parse(storedAuctionData);
        if (Array.isArray(auctionDataArray) && auctionDataArray.length > 0) {
            const firstAuction = auctionDataArray[0];
            auctionId = firstAuction.id;
        }
    }

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const response = await fetch(`https://54ab838584.nxcli.io/auction_portal/view_team.php?auctionId=${auctionId}&team_id=${teamId}`);
                const data = await response.json();
                setTeamName(data.data.team_name);
                setOwnerName(data.data.ownername);
                setOwnerNumber(data.data.ownernumber);
                setOwnerMailAddress(data.data.owneremail);
                setSelectedLogo(data.data.team_logo);
                setLogoPreview(data.data.team_logo);  // Set preview for the fetched logo URL
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };

        fetchTeamData();
    }, [auctionId, teamId]);

    const handleUpdate = async () => {
        if (!teamName || !selectedLogo) {
            alert('Please fill in all required fields.');
            return;
        }

        // const storedUserData = localStorage.getItem('user');
        // let userData = null;
        // if (storedUserData) {
        //     userData = JSON.parse(storedUserData);
        // }

        const formData = new FormData();
        if (selectedLogo instanceof File) {
            formData.append('team_logo', selectedLogo, selectedLogo.name);
        }

        const payload = {
            "team_name": teamName,
            "ownerName": ownerName,
            "ownerNumber": ownerNumber,
            "ownerMailAddress": ownerMailAddress,
            team_id: teamId,
            auctionId: auctionId
        };
        formData.append('data', JSON.stringify(payload));

        try {
            const response = await fetch('https://54ab838584.nxcli.io/auction_portal/edit_team.php', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                navigate("/team/list");
            } else {
                console.error('Error saving team:', response.statusText);
                alert('Error saving team. Please try again later.');
            }
        } catch (error) {
            console.error('Error saving team:', error);
            alert('Error saving team. Please try again later.');
        }
    };

    const handleCancel = () => {
        setTeamName('');
        setOwnerName('');
        setOwnerNumber('');
        setOwnerMailAddress('');
        setSelectedLogo(null);
        setLogoPreview(null);
        setLogoError(false);
        navigate("/team/list");
    };

    const handleLogoChange = (event) => {
        const logoFile = event.target.files[0];
        setSelectedLogo(logoFile);
        if (logoFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(logoFile);
            setLogoError(false);
        } else {
            setLogoPreview(null);
            setLogoError(true);
        }
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
            <div className="container2" style={{ width: "80%", float: "right", marginTop: "20px" }}>
                <Container maxWidth="md">
                    <Typography variant="h4" align="center" gutterBottom>
                        Update Team
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Choose Logo
                                </Typography>
                                <input
                                    accept="image/*"
                                    id="team-logo"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleLogoChange}
                                    required
                                />
                                <label htmlFor="team-logo">
                                    <Button variant="contained" color="primary" component="span">
                                        Upload Logo
                                    </Button>
                                </label>
                                {logoPreview && (
                                    <div style={{ marginTop: 8 }}>
                                        <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: 200 }} />
                                    </div>
                                )}
                                {selectedLogo && selectedLogo instanceof File && (
                                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                                        Selected Logo: {selectedLogo.name}
                                    </Typography>
                                )}
                                {logoError && (
                                    <Typography variant="body1" color="error" sx={{ marginTop: 1 }}>
                                        Logo is required.
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Team Name
                                </Typography>
                                <TextField
                                    label="Team Name"
                                    fullWidth
                                    margin="normal"
                                    required
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Team Owner Details
                            </Typography>
                            <TextField
                                label="Owner Name"
                                fullWidth
                                required
                                margin="normal"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                            />
                            <TextField
                                label="Owner Number"
                                fullWidth
                                required
                                margin="normal"
                                value={ownerNumber}
                                onChange={(e) => setOwnerNumber(e.target.value)}
                            />
                            <TextField
                                label="Owner Email Address"
                                fullWidth
                                required
                                margin="normal"
                                value={ownerMailAddress}
                                onChange={(e) => setOwnerMailAddress(e.target.value)}
                            />
                        </Paper>
                    </Grid>
                    <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
                        <Button variant="contained" color="primary" sx={{ marginRight: '8px' }} onClick={handleUpdate}>
                            Update
                        </Button>
                        <Button variant="outlined" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Grid>
                </Container>
            </div>
        </>
    );
}

export default UpdateTeam;
