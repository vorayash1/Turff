import { Box, Card, Grid, IconButton, styled, Tooltip } from "@mui/material";
import { Group, Store, ArrowRightAlt, Gavel, Upcoming } from "@mui/icons-material";
import { Small } from "app/components/Typography";

// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": { opacity: 0.6, fontSize: "44px", color: theme.palette.primary.main }
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main
}));

export default function StatCards(props) {
  // console.log(props, "99999999999")
  const tuffData = props.dashBoardData.tuff;
  const cardList = [
    { name: "Total turff", amount: tuffData ? tuffData : "", Icon: Group },
    { name: "This week Bookings", amount: "20", Icon: Gavel },
    { name: "Active turff", amount: "137", Icon: Store },
    { name: "Inactive turff", amount: "6", Icon: Upcoming }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: "24px" }}>
      {cardList.map(({ amount, Icon, name }) => (
        <Grid item xs={12} md={6} key={name}>
          <StyledCard elevation={6}>
            <ContentBox>
              <Icon className="icon" />

              <Box ml="12px">
                <Small>{name}</Small>
                <Heading>{amount}</Heading>
              </Box>
            </ContentBox>

            <Tooltip title="View Details" placement="top">
              {/* <IconButton>
                <ArrowRightAlt />
              </IconButton> */}
            </Tooltip>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
}
