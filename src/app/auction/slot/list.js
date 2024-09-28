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

    const [timeData, setTimeData] = useState([]);
    const [error, setError] = useState('');
    const [selectedDay, setSelectedDay] = useState(0);
    const [priceUpdates, setPriceUpdates] = useState({});

    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(3); // Total pages
    const [limit] = useState(10); // Items per page

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

    useEffect(() => {
        fetchSlots(); // Fetch slots when currentPage changes
    }, [currentPage]);

    const fetchSlots = async () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user._id) {
            setError("User not found. Please log in again.");
            return;
        }

        try {
            const response = await axios.post(
                'https://myallapps.tech:3024/api/admin/time/getTime',
                {
                    tuff_id: user._id,
                    page: currentPage,
                    limit: limit
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setTimeData(response.data.data.timeData || []);
            // setTotalPages((response.data.data.totalCount));
        } catch (error) {
            console.error("Error fetching time data:", error);
            setError("Failed to fetch time data. Please try again later.");
        }
    };

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    const handlePriceChange = (timeId, value) => {
        setPriceUpdates(prev => ({ ...prev, [timeId]: value }));
    };

    const updatePrices = async () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        const updateData = {
            tuff_id: user._id,
            data: timeData.map(slot => ({
                time_id: slot._id,
                price: priceUpdates[slot._id] || slot.price,
                status: slot.status
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

            fetchSlots();
            alert("Prices updated successfully!");
        } catch (error) {
            console.error("Error updating prices:", error);
            setError("Failed to update prices. Please try again.");
        }
    };

    const filteredSlots = timeData.filter(slot => slot.day === selectedDay);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

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
                            <div className="pagination-controls">
                                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
                                <span>{` Page ${currentPage} of ${totalPages} `}</span>
                                <Button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
                            </div>
                        </article>
                    </main>
                </div>
            </div>
        </>
    );
}

export default TeamList;
