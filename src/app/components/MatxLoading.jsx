import { CircularProgress, Box, styled } from "@mui/material";

// STYLED COMPONENT
const StyledLoading = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& img": {
    width: "auto",
    height: "25px"
  },
  "& .circleProgress": {
    position: "absolute",
    left: -7,
    right: 0,
    top: "calc(50% - 25px)"
  }
});

export default function Loading() {
  return (
    <StyledLoading>
      <Box position="relative">
        <img src="/img/Double Ring@1x-1.0s-500px-500px.svg" alt="" />
        <CircularProgress className="circleProgress" />
      </Box>
    </StyledLoading>
  );
}