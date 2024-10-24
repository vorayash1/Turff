/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, useState, useEffect, useRef } from "react";
import { Grid, styled } from "@mui/material";
import StatCards from "./shared/StatCards"; // Admin-specific component
import StatCards2 from "./shared/StatCards2"; // Common or tuff_owner-specific component
import TopSellingTable from "./shared/TopSellingTable"; // Admin-specific component
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "app/contexts/JWTAuthContext";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import useSettings from "app/hooks/useSettings";
import StatCards3 from "./shared/StatCards3";
import Footer from "../../components/Footer"; // Import Footer component
import Layout1Topbar from "app/components/MatxLayout/Layout1/Layout1Topbar";
import axios from "axios";
import { useMediaQuery, useTheme } from "@mui/material";
import "../../auction/turf.css";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

// Style the footer to be positioned at the bottom
const FooterContainer = styled(Footer)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  width: "100%",
  backgroundColor: theme.palette.background.default, // Optional styling based on theme
}));

export default function Analytics() {
  const state = useGlobalContext();
  const { settings, updateSettings } = useSettings();
  const { layout1Settings } = settings;
  const [dashBoardData, setDashboardData] = useState(null);
  const theme = useTheme();

  if (!state.isAuthenticated) {
    return <Navigate to="/unauthorized" />;
  }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMdScreen]);

  // Determine user role
  const role = state.user?.type;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getDashBoardData();
  }, []);

  const getDashBoardData = async () => {
    const formData = new FormData();
    const storedUserData = localStorage.getItem('user');
    const user = JSON.parse(storedUserData);
    console.log(user, "user");
    formData.append("admin_id", user._id);
    try {
      const response = await axios.post("https://myallapps.tech:3024/api/admin/auth/DashBoard", formData, {
        headers: {
          "Authorization": `Bearer ${user.token}`,
        }
      });
      const dashBoardData = response.data.data;
      console.log(dashBoardData, "dashBoardData");
      setDashboardData(dashBoardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
  const totalRevenue = dashBoardData?.totalRevenue || {};
  return (
    <Fragment>
      <Layout1Topbar />

      <div className="container1">
        {showSidenav && sidenavMode !== "close" && (
          <SidenavTheme>
            <Layout1Sidenav />
          </SidenavTheme>
        )}
      </div>
      {/* Main content container */}
      <div className="container2sub" style={{ float: "right", minHeight: '100vh', position: 'relative' }}>
        <ContentBox className="analytics">
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {/* Admin view */}
              {role === "admin" && (
                <>
                  <StatCards dashBoardData={dashBoardData || {}} />
                  {/* <TopSellingTable /> */}
                  <StatCards2 dashBoardData={dashBoardData || {}} />
                </>
              )}

              {/* Tuff Owner view */}
              {role === "tuff_owner" && (
                <>
                  <StatCards3 dashBoardData={dashBoardData || {}} />
                  <TopSellingTable dashBoardData={dashBoardData || {}} totalRevenue={totalRevenue || {}} />

                </>
              )}
            </Grid>
          </Grid>
        </ContentBox>
      </div>

      {/* Footer positioned at the bottom */}
      <FooterContainer />
    </Fragment>
  );
}
