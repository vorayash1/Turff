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

export default function StatCards2({ dashBoardData = {} }) {
  const { palette } = useTheme();
  const bgError = lighten(palette.error.main, 0.85);

  // Use optional chaining and default values
  const totalUser = dashBoardData?.user || 0;
  const totalCity = dashBoardData?.city || 0;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: "rgba(9, 182, 109, 0.15)" }}>
              <TrendingUp color="success" />
            </FabIcon>
            <H3 color="#08ad6c">Total User</H3>
          </ContentBox>
          <ContentBox sx={{ p: 2 }}>
            <H1>{totalUser}</H1> {/* Show default value */}
            {/* <IconBox sx={{ backgroundColor: "success.main" }}>
              <ExpandLess className="icon" />
            </IconBox> */}
          </ContentBox>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ backgroundColor: bgError, overflow: "hidden" }}>
              <StarOutline color="error" />
            </FabIcon>
            <H3 color="error.main" fontSize="10px">Total City</H3>
          </ContentBox>
          <ContentBox sx={{ p: 2 }}>
            <H1>{totalCity}</H1> {/* Show default value */}
            {/* <IconBox sx={{ backgroundColor: "success.main" }}>
              <ExpandLess className="icon" />
            </IconBox> */}
          </ContentBox>
        </Card>
      </Grid>
    </Grid>
  );
}
