import { Fragment } from "react";
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
import Footer from "../../components/Footer";
import Layout1Topbar from "app/components/MatxLayout/Layout1/Layout1Topbar";


// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

export default function Analytics() {
  const state = useGlobalContext();
  const { settings } = useSettings();
  const { layout1Settings } = settings;

  if (!state.isAuthenticated) {
    return <Navigate to="/unauthorized" />;
  }

  const {
    leftSidebar: { mode: sidenavMode, show: showSidenav }
  } = layout1Settings;

  // Determine user role
  const role = state.user?.type;

  return (
    <Fragment>
      {/* <Layout1Topbar/> */}
      <Layout1Topbar />

      <div className="container1">
        {showSidenav && sidenavMode !== "close" && (
          <SidenavTheme>
            <Layout1Sidenav />
          </SidenavTheme>
        )}
      </div>
      <div className="container2sub" style={{ float: "right" }}>
        <ContentBox className="analytics">
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {/* Admin view */}
              {role === "admin" && (
                <>
                  <StatCards />
                  <TopSellingTable />
                  <StatCards2 />
                  {/* <Footer /> */}
                </>
              )}

              {/* Tuff Owner view */}
              {role === "tuff_owner" && (
                <>
                  <StatCards3 />
                  <TopSellingTable />

                </>
              )}
            </Grid>
          </Grid>
        </ContentBox>
      </div>
      <Footer />
    </Fragment>
  );
}
