import {
  Box,
  Card,
  Table,
  styled,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead
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

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" }
}));

export default function TopSellingTable() {
  const { palette } = useTheme();

  // Static data for last 5 bookings
  const bookingData = [
    { name: "7 Star Turf", date: "2024-10-01", time: "10:00 AM" },
    { name: "Green Field", date: "2024-09-30", time: "12:00 PM" },
    { name: "Sky Arena", date: "2024-09-29", time: "02:00 PM" },
    { name: "Prime Turf", date: "2024-09-28", time: "04:00 PM" },
    { name: "Victory Ground", date: "2024-09-27", time: "06:00 PM" }
  ];

  return (
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
      <CardHeader>
        <Title>Last 5 Bookings</Title>
      </CardHeader>

      <Box overflow="auto">
        <ProductTable>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} sx={{ px: 3 }}>
                Turf Name
              </TableCell>
              <TableCell colSpan={2} sx={{ px: 0 }}>
                Booking Date
              </TableCell>
              <TableCell colSpan={1} sx={{ px: 0 }}>
                Booking Time
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {bookingData.map((booking, index) => (
              <TableRow key={index} hover>
                <TableCell colSpan={2} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                  <Box display="flex" alignItems="center" gap={4}>
                    <Paragraph>{booking.name}</Paragraph>
                  </Box>
                </TableCell>
                <TableCell sx={{ px: 2 }} align="left" colSpan={2}>
                  {booking.date}
                </TableCell>
                <TableCell sx={{ px: 2 }} colSpan={1}>
                  {booking.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ProductTable>
      </Box>
    </Card>
  );
}
