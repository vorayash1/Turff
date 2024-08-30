import React, { useState, useEffect } from 'react';
import { Container, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem } from '@mui/material';
import { CompactPicker } from 'react-color';
import '../auction-summary.css';
import Marquee from "react-fast-marquee";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';

function PlayerSummary() {
    // const [data, setData] = useState(null);
    // const [selectedFilter, setSelectedFilter] = useState('All');
    const [players, setPlayers] = useState([]);
    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        // Function to fetch data from the API endpoint
        const fetchData = async () => {
            try {
                // Retrieve user ID from localStorage
                // const storedUserData = localStorage.getItem('user');
                // let userId = null;
                // if (storedUserData) {
                //     // Parse JSON data if it exists
                //     const userData = JSON.parse(storedUserData);
                //     userId = userData.id;
                // }

                // Retrieve auction ID from localStorage
                const storedAuctionData = localStorage.getItem('auctionData');
                let auctionId = null;
                if (storedAuctionData) {
                    // Parse JSON data if it exists
                    const auctionDataArray = JSON.parse(storedAuctionData);

                    // Assuming you want the id of the first auction in the array
                    if (Array.isArray(auctionDataArray) && auctionDataArray.length > 0) {
                        const firstAuction = auctionDataArray[0];
                        auctionId = firstAuction.id;
                    }
                }

                // Include user ID in the request parameters
                const response = await axios.get("https://54ab838584.nxcli.io/auction_portal/players_get_grid.php", {
                    params: {
                        // userId: userId // Pass user ID to the API
                        auctionId: auctionId // Pass user ID to the API
                    }
                });
                const responsee = await axios.get("https://54ab838584.nxcli.io/auction_portal/sponsors_get_grid.php", {
                    params: {
                        auctionId: auctionId
                    }
                });
                setSponsors(responsee.data);
                console.log(sponsors, "000000000000000000000");
                setPlayers(response.data); // Update state with fetched data
            } catch (error) {
                console.error("Error fetching player data:", error);
            }
        };

        fetchData(); // Call the fetchData function when the component mounts

        // Retrieve saved colors from localStorage
        const savedFrontColor = localStorage.getItem('frontColor');
        const savedFontColor = localStorage.getItem('fontColor');
        const savedBackColor = localStorage.getItem('backColor');

        if (savedFrontColor) setFrontColor(savedFrontColor);
        if (savedFontColor) setFontColor(savedFontColor);
        if (savedBackColor) setBackColor(savedBackColor);

        // Apply the colors
        document.documentElement.style.setProperty('--bs-front', savedFrontColor || 'yellowgreen');
        document.documentElement.style.setProperty('--bs-font', savedFontColor || 'white');
        document.documentElement.style.setProperty('--bs-bac', savedBackColor || 'black');
    }, []);

    const [openColorPicker, setOpenColorPicker] = useState(false);
    const [frontColor, setFrontColor] = useState('yellowgreen');
    const [fontColor, setFontColor] = useState('white');
    const [backColor, setBackColor] = useState('black');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };


    const handleOpenColorPicker = () => {
        setOpenColorPicker(true);
    };

    const handleCloseColorPicker = () => {
        setOpenColorPicker(false);
    };

    const handleFrontColorChange = (color) => {
        setFrontColor(color.hex);
    };

    const handleFontColorChange = (color) => {
        setFontColor(color.hex);
    };

    const handleBackColorChange = (color) => {
        setBackColor(color.hex);
    };

    const handleApplyColors = () => {
        document.documentElement.style.setProperty('--bs-front', frontColor);
        document.documentElement.style.setProperty('--bs-font', fontColor);
        document.documentElement.style.setProperty('--bs-bac', backColor);

        localStorage.setItem('frontColor', frontColor);
        localStorage.setItem('fontColor', fontColor);
        localStorage.setItem('backColor', backColor);

        handleCloseColorPicker();
    };

    return (
        <Container className='mcm'>
            <div style={{ height: "100%", width: "100%", backgroundColor: "var(--bs-bac)" }}>
                <div className="header">
                    <div className="hsvg">
                        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1888 252"><defs></defs><path className='fc' d="M1888,0V23.38l-865.27,0c-31.06,0-59.24,0-90.3-.09a4.19,4.19,0,0,0-2.78.79h0l-124,221a5.72,5.72,0,0,1-5,2.93H0V0Z" /><path class="cls-1" d="M1889,4.17V23.76l-865.73,0c-31.07,0-59.27,0-90.35-.09a4.14,4.14,0,0,0-2.78.8h0a8.8,8.8,0,0,0-2.64,3.26C888.51,99.6,848,171.49,809,243.24c-1.56,3.17-3.8,4.9-6.11,4.74-265.82-.12-533-.25-798.81-.2-1.35,0-2.71.14-4.06.21v-7c1.09.08,2.17.22,3.26.22q398.39,0,796.76.08c2.14.19,4.22-1.38,5.68-4.28q56.53-104.25,113.18-208.3c.68-1.26,1.33-2.59,2.54-4.93h-4.26q-319.17,0-638.28.1c-2.82,0-4.95-1.1-6.83-5.14-2.23-4.77-4.82-9-7.55-14a12.59,12.59,0,0,1,2-.52c.91-.07,1.81,0,2.72,0h753.26Z" /></svg>
                    </div>
                    <div className="hc">
                        <img className="iw" src="/img/Milople_Logo.png" alt="logo" />
                        <h2>Auction Name</h2>
                        <h3>Player Summary</h3>
                    </div>
                    <div className="box" >
                        <Marquee style={{ color: "white" }}>
                            {sponsors?.map((_logo, index) => (
                                <div key={index}>
                                    <img className="miwc" src={_logo.sponsor_photo === "null" ? '/img/Avatar-01.png' : _logo.sponsor_photo} alt="no logo" />
                                </div>
                            ))}
                        </Marquee>
                    </div>
                </div>
                <div className="con">
                    <div className="df ec">
                    </div>
                    <TableContainer component={Paper} className="summary-table-container bs" style={{ border: "2px solid" }}>
                        <Table>
                            <TableHead>
                                <TableRow className='bs'>
                                    <TableCell className='ws'>Player Picture</TableCell>
                                    <TableCell className='ws'>Player Name</TableCell>
                                    {/* <TableCell className='ws'>Sold Points</TableCell> */}
                                    <TableCell className='ws'>Player Status
                                        <FormControl>
                                            <Select
                                                className='abx'
                                                value={statusFilter}
                                                onChange={handleStatusFilterChange}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Status Filter' }}
                                            >
                                                <MenuItem value="all">All</MenuItem>
                                                <MenuItem value="available">Available</MenuItem>
                                                <MenuItem value="sold">Sold</MenuItem>
                                                <MenuItem value="unsold">Unsold</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(players) && players.length === 0 && (
                                    <div>No players available at the moment.</div>
                                )}

                                {Array.isArray(players) && players.length > 0 && players
                                    .filter(player => {
                                        if (statusFilter === 'all') return true;
                                        if (statusFilter === 'available' && player.status === "0") return true;
                                        if (statusFilter === 'sold' && player.status === "1") return true;
                                        if (statusFilter === 'unsold' && player.status === "2") return true;
                                        return false;
                                    })
                                    .map((player, index) => (
                                        <TableRow key={index} className='bs'>
                                            <TableCell className='ws'>
                                                <img className='miwc' src={player.player_photo} alt='player'></img></TableCell>
                                            <TableCell className='ws'>{player.first_name + " " + player.last_name}</TableCell>
                                            {/* <TableCell className='ws'>{player.sold_points}</TableCell> */}
                                            <TableCell className='ws'>{player.status === "0" ? "Available" : player.status === "1" ? "Sold" : "Unsold"}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div>
                    <Button className='bs pf' onClick={handleOpenColorPicker}>
                        <img className='hw' src='/img/theme changer.png' alt='' />
                    </Button>
                    <Dialog open={openColorPicker} onClose={handleCloseColorPicker}>
                        <DialogTitle>Select Colors</DialogTitle>
                        <DialogContent>
                            <div>
                                <h4>Front Color</h4>
                                <CompactPicker color={frontColor} onChange={handleFrontColorChange} />
                            </div>
                            <div>
                                <h4>Background Color</h4>
                                <CompactPicker color={backColor} onChange={handleBackColorChange} />
                            </div>
                            <div>
                                <h4>Font Color</h4>
                                <CompactPicker color={fontColor} onChange={handleFontColorChange} />
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseColorPicker}>Cancel</Button>
                            <Button onClick={handleApplyColors}>Apply</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </Container>
    );
}

export default PlayerSummary;
