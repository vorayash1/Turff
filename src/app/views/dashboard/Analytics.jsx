import { Fragment } from "react";
import { Grid, styled } from "@mui/material";
// import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
// import Campaigns from "./shared/Campaigns";
import StatCards2 from "./shared/StatCards2";
// import DoughnutChart from "./shared/Doughnut";
// import UpgradeCard from "./shared/UpgradeCard";
import TopSellingTable from "./shared/TopSellingTable";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "app/contexts/JWTAuthContext";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

// const Title = styled("span")(() => ({
//   fontSize: "1rem",
//   fontWeight: "500",
//   marginRight: ".5rem",
//   textTransform: "capitalize"
// }));

// const SubTitle = styled("span")(({ theme }) => ({
//   fontSize: "0.875rem",
//   color: theme.palette.text.secondary
// }));

// const H4 = styled("h4")(({ theme }) => ({
//   fontSize: "1rem",
//   fontWeight: "500",
//   marginBottom: "16px",
//   textTransform: "capitalize",
//   color: theme.palette.text.secondary
// }));

export default function Analytics() {
  // const { palette } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // if (!isAuthenticated || user.role !== 'admin') {
    // Redirect to home or show an unauthorized message
    return <Navigate to="/unauthorized" />;
  }

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <StatCards />
            <TopSellingTable />
            <StatCards2 />

            {/* <H4>Ongoing Projects</H4>
            <RowCards /> */}
          </Grid>

          {/* <Grid item lg={4} md={4} sm={12} xs={12}> */}
          {/* <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>Traffic Sources</Title>
              <SubTitle>Last 30 days</SubTitle>

              <DoughnutChart
                height="300px"
                color={[palette.primary.dark, palette.primary.main, palette.primary.light]}
              />
            </Card> */}

          {/* <UpgradeCard /> */}
          {/* <Campaigns /> */}
          {/* </Grid> */}
        </Grid>
      </ContentBox>
    </Fragment>
  );
}
