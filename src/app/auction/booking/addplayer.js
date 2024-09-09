import React, { useState, useRef, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Avatar, Button, FormControl, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import useSettings from 'app/hooks/useSettings';
import { useMediaQuery, useTheme } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../turf.css';

function AddPlayerPage() {
    const navigate = useNavigate();
    const { uniqueCode } = useParams();
    const { settings, updateSettings } = useSettings();
    const { layout1Settings } = settings;
    const theme = useTheme();

    const {
        leftSidebar: { mode: sidenavMode, show: showSidenav }
    } = layout1Settings;
    const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        let { settings } = ref.current;
        let sidebarMode = settings.layout1Settings.leftSidebar.mode;
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? 'close' : sidebarMode;
            updateSettings({ layout1Settings: { leftSidebar: { mode } } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen]);
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

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSave = async () => {
        const mobileNumberRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!firstName || !lastName || !sportCategory || !mobileNumber || !email || !dateOfBirth ||
            !mobileNumberRegex.test(mobileNumber) || !emailRegex.test(email)) {
            setFieldError(true);
            return;
        }

        const storedUserData = localStorage.getItem('user');
        let userData = null;
        if (storedUserData) {
            userData = JSON.parse(storedUserData);
            console.log(userData);
        }
        const storedAuctionData = localStorage.getItem('auctionData');
        let auctionId = null;
        if (storedAuctionData) {
            const auctionDataArray = JSON.parse(storedAuctionData);
            if (Array.isArray(auctionDataArray) && auctionDataArray.length > 0) {
                const firstAuction = auctionDataArray[0];
                auctionId = firstAuction.id;
            }
        }

        const formData = new FormData();
        if (selectedFile) {
            formData.append('player_photo', selectedFile, selectedFile.name);
        }

        const payload = {
            first_name: firstName,
            last_name: lastName,
            sport_category: sportCategory,
            mobile_no: mobileNumber,
            email: email,
            dob: dateOfBirth,
            tshirt_size: tShirtSize,
            trouser_size: trouserSize,
            note: note,
            auction_id: auctionId,
        };

        formData.append('data', JSON.stringify(payload));
        try {
            const response = await fetch('https://54ab838584.nxcli.io/auction_portal/add_players.php', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log(data);

            toast.success('Player added successfully!');
            handleCancel(); // Reset form fields

        } catch (error) {
            console.error('Error adding player:', error);
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
    };

    return (
        <>
            {!uniqueCode && (
                <div className="container1">
                    {showSidenav && sidenavMode !== 'close' && (
                        <SidenavTheme>
                            <Layout1Sidenav />
                        </SidenavTheme>
                    )}
                </div>
            )}
            {uniqueCode && (
                <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f5f5f5' }}>
                    <img src="/img/50.png" alt="Logo" />
                    <Typography variant="h6">Game Trade By Milople Technology</Typography>
                </header>
            )}
            <div className={uniqueCode ? '' : 'container2'} style={{ width: uniqueCode ? '100%' : 'auto' }}>
                <Container maxWidth="md">
                    {!uniqueCode && (
                        <Button
                            color="primary"
                            variant="contained"
                            sx={{ textTransform: 'capitalize' }}
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </Button>
                    )}
                    <Typography variant="h4" align="center" gutterBottom>
                        Add Player
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                <Avatar
                                    alt="Player Picture"
                                    src={selectedFile ? URL.createObjectURL(selectedFile) : '/path/to/default-player.jpg'}
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
                                        labelId="sport-category-label"
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
                                    type="tel"
                                    inputProps={{ pattern: '^[6-9][0-9]{9}$' }}
                                    margin="normal"
                                    required
                                    error={fieldError && (!mobileNumber || !/^[6-9][0-9]{9}$/.test(mobileNumber))}
                                    value={mobileNumber}
                                    onChange={(e) => { setMobileNumber(e.target.value); setFieldError(false); }}
                                    helperText={fieldError && (!mobileNumber || !/^[6-9][0-9]{9}$/.test(mobileNumber)) ? 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9' : ''}
                                />
                                <TextField
                                    label="Email"
                                    fullWidth
                                    margin="normal"
                                    required
                                    type="email"
                                    error={fieldError && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))}
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setFieldError(false); }}
                                    helperText={fieldError && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? 'Please enter a valid email address' : ''}
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
                                    InputProps={{
                                        inputProps: { max: new Date().toISOString().split('T')[0] },
                                    }}
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
                                    Save
                                </Button>
                                <Button variant="outlined" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <ToastContainer />
                </Container>
            </div>
        </>
    );
}

export default AddPlayerPage;
