import React, { useState, useRef, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Avatar, Button, FormControl, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useSettings from "app/hooks/useSettings";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../turf.css';
import { useLocation } from 'react-router-dom';

function EditPlayerPage() {
    const navigate = useNavigate();
    const { settings, updateSettings } = useSettings();
    const { layout1Settings } = settings;
    const theme = useTheme();
    const location = useLocation();
    const playerId = new URLSearchParams(location.search).get('playerId');

    const {
        leftSidebar: { mode: sidenavMode, show: showSidenav }
    } = layout1Settings;
    const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

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
        let { settings } = ref.current;
        let sidebarMode = settings.layout1Settings.leftSidebar.mode;
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? "close" : sidebarMode;
            updateSettings({ layout1Settings: { leftSidebar: { mode } } });
        }
    }, [isMdScreen, updateSettings]);
    const ref = useRef({ isMdScreen, settings });

    const [selectedFile, setSelectedFile] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [sportCategory, setSportCategory] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [tShirtSize, setTShirtSize] = useState('');
    const [trouserSize, setTrouserSize] = useState('');
    const [note, setNote] = useState('');
    const [fieldError, setFieldError] = useState(false);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await fetch(`https://54ab838584.nxcli.io/auction_portal/view_player.php?auctionId=${auctionId}&player_id=${playerId}`);
                const data = await response.json();
                setFirstName(data.data.first_name);
                setLastName(data.data.last_name);
                setSportCategory(data.data.sport_category);
                setMobileNumber(data.data.mobile_no);
                setEmail(data.data.email);
                setDateOfBirth(data.data.dob);
                setTShirtSize(data.data.tshirt_size);
                setTrouserSize(data.data.trouser_size);
                setNote(data.data.note);
                setSelectedFile(data.data.player_photo ? data.data.player_photo : null);
            } catch (error) {
                console.error("Error fetching player data:", error);
            }
        };

        fetchPlayerData();
    }, [auctionId, playerId]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSave = async () => {
        if (!firstName || !lastName || !sportCategory || !mobileNumber || !email || !dateOfBirth) {
            setFieldError(true);
            return;
        }
        const formData = new FormData();
        if (selectedFile instanceof File) {
            formData.append('player_photo', selectedFile, selectedFile.name);
        }

        const payload = {
            "first_name": firstName,
            "last_name": lastName,
            "sport_category": sportCategory,
            "mobile_no": mobileNumber,
            "email": email,
            "dob": dateOfBirth,
            "tshirt_size": tShirtSize,
            "trouser_size": trouserSize,
            "note": note,
            "player_id": playerId,
            "auctionId": auctionId
        };
        formData.append('data', JSON.stringify(payload));

        try {
            const response = await fetch("https://54ab838584.nxcli.io/auction_portal/edit_player.php", {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log(data);
            navigate('/player/list');
        } catch (error) {
            console.error("Error editing player:", error);
        }
    };

    const handleCancel = () => {
        setFirstName('');
        setLastName('');
        setSportCategory('');
        setMobileNumber('');
        setEmail('');
        setDateOfBirth('');
        setTShirtSize('');
        setTrouserSize('');
        setNote('');
        setSelectedFile(null);
        navigate(-1);
    };

    return (
        <>
            <div className="container1">
                {showSidenav && sidenavMode !== "close" && (
                    <SidenavTheme>
                        <Layout1Sidenav />
                    </SidenavTheme>
                )}
            </div>
            <div className="container2">
                <Container maxWidth="md">
                    <Button
                        color="primary"
                        variant="contained"
                        sx={{ textTransform: "capitalize" }}
                        onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                    <Typography variant="h4" align="center" gutterBottom>
                        Edit Player
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                <Avatar
                                    alt="Player Picture"
                                    src={selectedFile instanceof File ? URL.createObjectURL(selectedFile) : selectedFile || "/path/to/default-player.jpg"}
                                    sx={{ width: 150, height: 150, margin: 'auto' }}
                                />

                                <input
                                    accept="image/*"
                                    id="player-picture"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="player-picture">
                                    <Button variant="contained" color="primary" component="span" style={{ marginTop: '16px' }}>
                                        Upload Picture
                                    </Button>
                                </label>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6" gutterBottom>User Information</Typography>
                                <TextField
                                    label="First Name"
                                    fullWidth
                                    margin="normal"
                                    required
                                    error={fieldError && !firstName}
                                    value={firstName}
                                    onChange={(e) => { setFirstName(e.target.value); setFieldError(false); }}
                                />
                                <TextField
                                    label="Last Name"
                                    fullWidth
                                    margin="normal"
                                    required
                                    error={fieldError && !lastName}
                                    value={lastName}
                                    onChange={(e) => { setLastName(e.target.value); setFieldError(false); }}
                                />
                                <FormControl fullWidth margin="normal" required>
                                    <TextField
                                        label="Sport Category"
                                        value={sportCategory}
                                        required
                                        onChange={(e) => setSportCategory(e.target.value)}
                                        error={fieldError && !sportCategory}
                                    />
                                </FormControl>
                                <TextField
                                    label="Mobile Number"
                                    fullWidth
                                    type='tel'
                                    inputProps={{ pattern: "[0-9]{10}" }}
                                    margin="normal"
                                    required
                                    error={fieldError && !mobileNumber}
                                    value={mobileNumber}
                                    onChange={(e) => { setMobileNumber(e.target.value); setFieldError(false); }}
                                    helperText={fieldError && !mobileNumber ? "Please enter a valid 10-digit mobile number" : ""}
                                />
                                <TextField
                                    label="Email"
                                    fullWidth
                                    margin="normal"
                                    required
                                    type="email"
                                    error={fieldError && !email}
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setFieldError(false); }}
                                />
                                <TextField
                                    label="Date of Birth"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    required
                                    error={fieldError && !dateOfBirth}
                                    value={dateOfBirth}
                                    onChange={(e) => { setDateOfBirth(e.target.value); setFieldError(false); }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <Typography variant="h6" gutterBottom style={{ marginTop: '16px' }}>Additional Information</Typography>
                                <TextField
                                    label="T-shirt Size"
                                    fullWidth
                                    margin="normal"
                                    value={tShirtSize}
                                    onChange={(e) => setTShirtSize(e.target.value)}
                                />
                                <TextField
                                    label="Trouser Size"
                                    fullWidth
                                    margin="normal"
                                    value={trouserSize}
                                    onChange={(e) => setTrouserSize(e.target.value)}
                                />
                                <TextField
                                    label="Note (past achievements or anything)"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    margin="normal"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </Paper>
                            <Grid container justifyContent="center" sx={{ marginTop: '16px', marginBottom: '10px' }}>
                                <Button variant="contained" color="primary" sx={{ marginRight: '8px' }} onClick={handleSave}>
                                    Update
                                </Button>
                                <Button variant="outlined" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </>
    );
}

export default EditPlayerPage;
