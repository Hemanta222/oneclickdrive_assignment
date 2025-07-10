"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import { useContextData } from "@/context/Context";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useRouter } from "next/navigation";

function ResponsiveAppBar() {
  const { userData, displayMessage, setUserData } = useContextData();

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (res.ok) {
      router.push("/login");
      displayMessage(json.message, "success");
      setUserData({ usedId: 0, email: "" });
    } else {
      displayMessage(json.message, "error");
    }
  };
  const router = useRouter();

  console.log("ResponsiveAppBar userData", userData);

  return isClient ? (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Image
            src="main-logo-mob.svg"
            priority={true}
            width={200}
            height={60}
            alt="logo"
          />
          <Box flex={1}></Box>

          <Box sx={{ flexGrow: 0 }}>
            {userData.userId ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="body1" color="grey" sx={{display:{xs:'none',sm:"block"}}}>
                  {userData?.email}
                </Typography>

                <Tooltip title="Logout">
                  <IconButton
                    onClick={handleLogout}
                    color="primary"
                    sx={{ p: 1, "&:hover": { backgroundColor: "#42a5f53d" } }}
                  >
                    <PowerSettingsNewIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : null}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  ) : null;
}

export default ResponsiveAppBar;
