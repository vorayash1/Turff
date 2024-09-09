import React, { useState, useEffect, useRef } from 'react';
import { Button, Grid, TextField, Typography, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import { useMediaQuery, useTheme } from "@mui/material";
import useSettings from "app/hooks/useSettings";

const CreateTeam = () => {
    const [slots, setSlots] = useState({});
    const [error, setError] = useState('');
    const [selectedDay, setSelectedDay] = useState('default');

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${i}:00 - ${i + 1}:00`);

    const handleChange = (day, hourIndex, event) => {
        const { name, value, checked, type } = event.target;
        const updatedSlots = { ...slots };
        if (!updatedSlots[day]) updatedSlots[day] = {};
        if (!updatedSlots[day][hourIndex]) updatedSlots[day][hourIndex] = { price: '', visible: true };

        updatedSlots[day][hourIndex][name] = type === 'checkbox' ? checked : value;
        setSlots(updatedSlots);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://example.com/api/turf-booking-slots', { slots });
            console.log('Slots added successfully:', response.data);
        } catch (error) {
            console.error('Error adding slots:', error);
            setError('Error adding slots. Please try again later.');
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
            <div className="container2sub" style={{ float: "right" }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Add Turf Booking Slots
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto' }}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Select Day</InputLabel>
                        <Select
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                            label="Select Day"
                        >
                            <MenuItem value="default">Default</MenuItem>
                            {daysOfWeek.map((day) => (
                                <MenuItem key={day} value={day}>{day}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedDay !== 'default' && (
                        <div>
                            <Typography variant="h6" gutterBottom>{selectedDay}</Typography>
                            {hoursOfDay.map((hour, hourIndex) => (
                                <Grid container spacing={2} key={hourIndex} alignItems="center">
                                    <Grid item xs={4}>
                                        <Typography>{hour}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="number"
                                            name="price"
                                            label="Price (₹)"
                                            onChange={(e) => handleChange(selectedDay, hourIndex, e)}
                                            fullWidth
                                            value={slots[selectedDay]?.[hourIndex]?.price || ''}
                                            inputProps={{ min: 0 }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={slots[selectedDay]?.[hourIndex]?.visible ?? true}
                                                    onChange={(e) => handleChange(selectedDay, hourIndex, e)}
                                                    name="visible"
                                                />
                                            }
                                            label="Visible"
                                        />
                                    </Grid>
                                </Grid>
                            ))}
                        </div>
                    )}

                    <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            sx={{ marginRight: 2 }}
                        >
                            Save Slots
                        </Button>
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={() => setSlots({})}
                        >
                            Reset
                        </Button>
                    </Grid>
                </form>
            </div>
        </>
    );
};

export default CreateTeam;