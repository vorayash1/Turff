import 'bootstrap/dist/css/bootstrap.min.css';
import { Fragment } from "react";
import { styled, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import '@grapecity/wijmo.styles/wijmo.css';
import React, { useEffect, useRef } from 'react';
import './myauction.css';
import './turf.css';
import useSettings from "app/hooks/useSettings";
// import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
// import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

export default function Myturff() {
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
                <div className="container2" >
                    <Fragment>
                        <ContentBox className="auction">

                            <h1 style={{ textAlign: "center" }}>Turff List</h1>

                            <div className="" >
                                <table className="mat-elevation-z5 mdc-table" >
                                    <thead>
                                        <tr className="mdc-table-header-row ">
                                            {/* <th>Action</th> */}
                                            <th>Turff Name</th>
                                            <th>Numbers of pitch</th>
                                            <th>Default Price of Turff</th>
                                            <th>Owner Name</th>
                                            <th>Owner Number</th>
                                            <th>Turff Status</th>
                                            {/* <th>Player Per Team</th>
                                            <th>Auction Date</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {auctionData && auctionData.length > 0 ? (
                                            auctionData.map((auction) => ( */}
                                        <tr className="mdc-table-row">
                                            <td>7 STAR</td>
                                            <td>2</td>
                                            <td>700 </td>
                                            <td>Rajyaguru</td>
                                            <td>9090909090</td>
                                            <td>Active</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </ContentBox>
                    </Fragment>
                </div>
            </Container>
            <ToastContainer />
        </>
    );
}
