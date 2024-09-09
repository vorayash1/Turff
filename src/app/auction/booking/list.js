import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, styled } from "@mui/material";
import useSettings from "app/hooks/useSettings";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import "./list.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../turf.css';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled("div")(({ theme }) => ({
    margin: "60px",
    marginTop: "0px !important",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
    }
}));

export default function PlayerList() {
    const navigate = useNavigate();
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
        <>
            <Container>
                <div className="container1">
                    {showSidenav && sidenavMode !== "close" && (
                        <SidenavTheme>
                            <Layout1Sidenav />
                        </SidenavTheme>
                    )}
                </div>
                <div className="container2" style={{ width: "82%", float: "right" }}>
                    <Button
                        color="primary"
                        variant="contained"
                        sx={{ textTransform: "capitalize" }}
                        onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                    <h1 style={{ textAlign: "center" }}> Booking List </h1>
                    <br></br>
                    <div className="row mb-3"></div>
                    <div className="mt-2 mat-accordion" >
                        <div class="mt-2 mat-accordion" >

                            <div>
                                <table className="mat-elevation-z5 mdc-table" >
                                    <thead>
                                        <tr className="mdc-table-header-row ">
                                            {/* <th>Action</th> */}
                                            <th>Name </th>
                                            <th>Booking Date</th>
                                            <th>Booking time</th>
                                            <th>Mobile Number</th>
                                            {/* <th>Email</th> */}
                                            {/* <th>TShirt size</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="mdc-table-row">
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </Container >
        </>
    );
}
