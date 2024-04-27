import { CircularProgress, Stack } from "@mui/material";

export const Loading = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      minHeight={"calc(100vh - 200px)"}
    >
      <CircularProgress color="inherit" size={50} />
    </Stack>
  );
};
