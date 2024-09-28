import "./list.css";
import useSettings from "app/hooks/useSettings";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery, useTheme, Button, MenuItem, Select, FormControl, InputLabel, TextField } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from 'app/components/MatxTheme/SidenavTheme/SidenavTheme';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import "../turf.css";

function TeamList() {
    const { settings, updateSettings } = useSettings();
    const { layout1Settings } = settings;
    const theme = useTheme();
    const navigate = useNavigate();

    const [timeData, setTimeData] = useState([]); // State to hold the fetched time data
    const [error, setError] = useState(''); // State to handle errors
    const [selectedDay, setSelectedDay] = useState(0); // State to handle the selected day (0-6)
    const [priceUpdates, setPriceUpdates] = useState({}); // State to hold price updates

    const {
        leftSidebar: { mode: sidenavMode, show: showSidenav }
    } = layout1Settings;
    const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

    const ref = useRef({ isMdScreen, settings });

    useEffect(() => {
        let { settings } = ref.current;
        let sidebarMode = settings.layout1Settings.leftSidebar.mode;
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? "close" : sidebarMode;
            updateSettings({ layout1Settings: { leftSidebar: { mode } } });
        }

        // Fetch slots when the component mounts
        fetchSlots();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen]);

    const fetchSlots = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const user = JSON.parse(localStorage.getItem('user')); // Retrieve and parse user from localStorage

        if (!user || !user._id) {
            setError("User not found. Please log in again.");
            return;
        }

        try {
            const response = await axios.post(
                'https://myallapps.tech:3024/api/admin/time/getTime',
                { tuff_id: user._id }, // Send tuff_id in the request body
                {
                    headers: {
                        "Authorization": `Bearer ${token}`, // Send the token in the header
                        "Content-Type": "application/json"
                    }
                }
            );

            setTimeData(response.data.data.timeData || []); // Update the state with the fetched time data
        } catch (error) {
            console.error("Error fetching time data:", error);
            setError("Failed to fetch time data. Please try again later.");
        }
    };

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    const handlePriceChange = (timeId, value) => {
        setPriceUpdates(prev => ({ ...prev, [timeId]: value })); // Update the price for the specific timeId
    };

    const updatePrices = async () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        const updateData = {
            tuff_id: user._id,
            data: timeData.map(slot => ({
                time_id: slot._id, // Use the correct field name for the slot id
                price: priceUpdates[slot._id] || slot.price, // Use the updated price or the current price
                status: slot.status // Keep the current status
            }))
        };

        try {
            await axios.post(
                'https://myallapps.tech:3024/api/admin/time/update',
                updateData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // Optionally refetch slots to reflect changes
            fetchSlots();
            alert("Prices updated successfully!");
        } catch (error) {
            console.error("Error updating prices:", error);
            setError("Failed to update prices. Please try again.");
        }
    };

    // Filter the slots based on the selected day
    const filteredSlots = timeData.filter(slot => slot.day === selectedDay);

    return (
        <>
            <div>
                <div className="container1">
                    {showSidenav && sidenavMode !== "close" && (
                        <SidenavTheme>
                            <Layout1Sidenav />
                        </SidenavTheme>
                    )}
                </div>
                <div className="container2">
                    <main>
                        <div className="top-row px-4"></div>
                        <article className="content px-4">
                            <h1 style={{ textAlign: "center" }}>Slot List</h1>
                            <br />
                            <div className="row mb-3">
                                <div className="col-md-12 text-center">
                                    <FormControl variant="outlined" style={{ marginRight: "1vw" }}>
                                        <InputLabel id="day-select-label">Select Day</InputLabel>
                                        <Select
                                            labelId="day-select-label"
                                            value={selectedDay}
                                            onChange={handleDayChange}
                                            label="Select Day"
                                        >
                                            <MenuItem value={0}>Sunday</MenuItem>
                                            <MenuItem value={1}>Monday</MenuItem>
                                            <MenuItem value={2}>Tuesday</MenuItem>
                                            <MenuItem value={3}>Wednesday</MenuItem>
                                            <MenuItem value={4}>Thursday</MenuItem>
                                            <MenuItem value={5}>Friday</MenuItem>
                                            <MenuItem value={6}>Saturday</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {/* <Button onClick={() => navigate("/auction/slot/addslot")} className="btn btn-sm btn-success mb-2">
                                        Update Slot
                                    </Button> */}
                                    <Button onClick={updatePrices} className="btn btn-sm btn-success mb-2">
                                        Update Prices
                                    </Button>
                                </div>
                            </div>
                            {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
                            <div className="table-responsive">
                                <table className="mat-elevation-z5 mdc-table">
                                    <thead>
                                        <tr className="mdc-table-header-row">
                                            <th>Slot Name</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>New Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSlots.length > 0 ? (
                                            filteredSlots.map((slot) => (
                                                <tr className="mdc-table-row" key={slot._id}>
                                                    <td>{slot.name || "N/A"}</td>
                                                    <td>{slot.start_time || "N/A"}</td>
                                                    <td>{slot.end_time || "N/A"}</td>
                                                    <td>{slot.price || "N/A"}</td>
                                                    <td>{slot.status ? "Active" : "Inactive"}</td>
                                                    <td>
                                                        <TextField
                                                            type="number"
                                                            defaultValue={slot.price}
                                                            onChange={(e) => handlePriceChange(slot._id, e.target.value)}
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            style={{ width: '150px', fontSize: '16px' }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                                    No slots available for this day
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </article>
                    </main>
                </div>
            </div>
        </>
    );
}

export default TeamList;
