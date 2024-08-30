// import { Edit } from "@mui/icons-material";
import {
  Box,
  Card,
  Table,
  Select,
  // Avatar,
  styled,
  TableRow,
  useTheme,
  MenuItem,
  TableBody,
  TableCell,
  TableHead
  // IconButton
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

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
}));

export default function TopSellingTable() {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;

  return (
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
      <CardHeader>
        <Title>Top Turff</Title>
        <Select size="small" defaultValue="this_month">
          <MenuItem value="this_month">This Month</MenuItem>
          <MenuItem value="last_month">Last Month</MenuItem>
        </Select>
      </CardHeader>

      <Box overflow="auto">
        <ProductTable>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} sx={{ px: 3 }}>
                Turff Name
              </TableCell>

              {/* <TableCell colSpan={2} sx={{ px: 0 }}>
                Highest Bid
              </TableCell> */}

              <TableCell colSpan={2} sx={{ px: 0 }}>
                Total Turff
              </TableCell>

              <TableCell colSpan={1} sx={{ px: 0 }}>
                Turff Name
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {productList.map((product, index) => (
              <TableRow key={index} hover>
                <TableCell colSpan={2} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                  <Box display="flex" alignItems="center" gap={4}>
                    {/* <Avatar src={product.imgUrl} /> */}
                    <Paragraph>{product.name}</Paragraph>
                  </Box>
                </TableCell>

                {/* <TableCell align="left" colSpan={2} sx={{ px: 0, textTransform: "capitalize" }}>
                  ₹{product.price > 999 ? (product.price / 1000).toFixed(1) + "k" : product.price}
                </TableCell> */}

                <TableCell sx={{ px: 4 }} align="left" colSpan={2}>
                  {product.available ? (
                    product.available < 20 ? (
                      <Small bgcolor={bgSecondary}>{product.available} </Small>
                    ) : (
                      <Small bgcolor={bgPrimary}>in stock</Small>
                    )
                  ) : (
                    <Small bgcolor={bgError}>out of stock</Small>
                  )}
                </TableCell>

                <TableCell sx={{ px: 2 }} colSpan={1}>
                  {product.auction}
                  {/* <IconButton>
                    <Edit color="primary" />
                  </IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ProductTable>
      </Box>
    </Card>
  );
}

const productList = [
  {
    //imgUrl: "/assets/images/products/headphone-2.jpg",
    name: "John",
    price: 9000,
    available: 10,
    auction: "Auction 1"
  },
  {
    //imgUrl: "/assets/images/products/headphone-3.jpg",
    name: "Manish",
    price: 15000,
    available: 10,
    auction: "Auction 2"
  },
  {
    //imgUrl: "/assets/images/products/iphone-2.jpg",
    name: "Priyank",
    price: 19000,
    available: 10,
    auction: "Auction 4"
  },
  {
    //imgUrl: "/assets/images/products/iphone-1.jpg",
    name: "Gautam",
    price: 10000,
    available: 10,
    auction: "Auction 5"
  },
  {
    //imgUrl: "/assets/images/products/headphone-3.jpg",
    name: "Hiren ",
    price: 11900,
    available: 10,
    auction: "Auction 6",
  }
];
