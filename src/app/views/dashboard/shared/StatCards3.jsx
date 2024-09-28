import { ExpandLess, StarOutline, TrendingUp } from "@mui/icons-material";
import { Card, Fab, Grid, lighten, styled, useTheme } from "@mui/material";

// STYLED COMPONENTS
const ContentBox = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center"
}));

const FabIcon = styled(Fab)(() => ({
  width: "44px !important",
  height: "44px !important",
  boxShadow: "none !important"
}));

const H3 = styled("h3")(() => ({
  margin: 0,
  fontWeight: "500",
  marginLeft: "12px"
}));

const H1 = styled("h1")(({ theme }) => ({
  margin: 0,
  flexGrow: 1,
  color: theme.palette.text.secondary
}));

const Span = styled("span")(() => ({
  fontSize: "13px",
  marginLeft: "4px"
}));

const IconBox = styled("div")(() => ({
  width: 16,
  height: 16,
  color: "#fff",
  display: "flex",
  overflow: "hidden",
  borderRadius: "300px ",
  justifyContent: "center",
  "& .icon": { fontSize: "14px" }
}));

export default function StatCards3(dashBoardData) {
  const { palette } = useTheme();
  console.log(dashBoardData, "600000000000000")
  const bgError = lighten(palette.error.main, 0.85);

  const BookedTuff = dashBoardData?.dashBoardData?.BookedTuff || 0;  // If undefined, default to 0
  const pitch = dashBoardData?.dashBoardData?.pitch || 0;  // If undefined, default to 0
  const totalRevenue = dashBoardData?.dashBoardData?.totalRevenue || 0;  // If undefined, default to 0


  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: "rgba(9, 182, 109, 0.15)" }}>
              {/* <TrendingUp color="success" /> */}
              <ExpandLess color="success" />
            </FabIcon>
            <H3 color="#08ad6c">Total Pitch</H3>
          </ContentBox>
          <ContentBox sx={{ p: 2 }}>
            <H1>{pitch}</H1>
          </ContentBox>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: "rgba(9, 182, 109, 0.15)" }}>
              {/* <ExpandLess color="success" /> */}
              <TrendingUp color="success" />
            </FabIcon>
            <H3 color="#08ad6c">Total Booking</H3>
          </ContentBox>
          <ContentBox sx={{ p: 2 }}>
            <H1>{BookedTuff}</H1>
          </ContentBox>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: "rgba(9, 182, 109, 0.15)" }}>
              {/* <TrendingUp color="success" /> */}
              <StarOutline color="error" />

            </FabIcon>
            <H3 color="#08ad6c">Total Revenue</H3>
          </ContentBox>
          <ContentBox sx={{ p: 2 }}>
            <H1>{totalRevenue}</H1>
          </ContentBox>
        </Card>
      </Grid>
      {/* <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ backgroundColor: bgError, overflow: "hidden" }}>
              <StarOutline color="error" />
            </FabIcon>
            <H3 color="error.main" fontSize="10px">Total City </H3>
          </ContentBox>
          <ContentBox sx={{ p: 2 }}>
            <H1>200</H1>
            <IconBox sx={{ backgroundColor: "success.main" }}>
              <ExpandLess className="icon" />
            </IconBox>
            <Span color="error.main">(+11%)</Span>
          </ContentBox>
        </Card>
      </Grid> */}
    </Grid>
  );
}
