import {
  Box,
  Card,
  Table,
  styled,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  CircularProgress,
} from "@mui/material";
import { Paragraph } from "app/components/Typography";

// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between"
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize"
}));

const RevenueTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" }
}));

export default function RevenueOverview({ dashBoardData, totalRevenue }) {
  const { palette } = useTheme();

  // Accessing totalRevenue with fallback
  // const totalRevenue = dashBoardData?.dashBoardData?.totalRevenue;
  const { dailyRevenue, weeklyRevenue, monthlyRevenue, yearlyRevenue } = totalRevenue;

  // Show loading spinner if totalRevenue is not yet defined
  if (!totalRevenue) {
    return (
      <Card elevation={3} sx={{ pt: "20px", mb: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
      <CardHeader>
        <Title>Revenue Overview</Title>
      </CardHeader>

      <Box overflow="auto">
        <RevenueTable>
          <TableHead>
            <TableRow>
              <TableCell sx={{ px: 3 }}>Period</TableCell>
              <TableCell sx={{ px: 0 }}>Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ px: 3 }}>Daily Revenue</TableCell>
              <TableCell sx={{ px: 0 }}>${dailyRevenue}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ px: 3 }}>Weekly Revenue</TableCell>
              <TableCell sx={{ px: 0 }}>${weeklyRevenue}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ px: 3 }}>Monthly Revenue</TableCell>
              <TableCell sx={{ px: 0 }}>${monthlyRevenue}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ px: 3 }}>Yearly Revenue</TableCell>
              <TableCell sx={{ px: 0 }}>${yearlyRevenue}</TableCell>
            </TableRow>
          </TableBody>
        </RevenueTable>
      </Box>
    </Card>
  );
}
