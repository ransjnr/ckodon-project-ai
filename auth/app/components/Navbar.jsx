import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box className="h-15 w-full flex items-center justify-between p-2">
            <Box className="flex">
              <Typography
                className="p-2 cursor-pointer"
                component="div"
                sx={{ flexGrow: 1 }}
              >
                <Link href="/">Home</Link>
              </Typography>
              <Typography
                className="p-2 cursor-pointer"
                component="div"
                sx={{ flexGrow: 1 }}
              >
                <Link href="/about">About</Link>
              </Typography>
              <Typography
                className="p-2 cursor-pointer"
                component="div"
                sx={{ flexGrow: 1 }}
              >
                <Link href="/profile">Profile</Link>
              </Typography>
            </Box>
            {loading ? null : !user ? (
              <Box
                className="flex"
                sx={{ flexGrow: 1, justifyContent: "flex-end" }}
              >
                <Button
                  onClick={handleSignIn}
                  className="p-2 cursor-pointer"
                  color="inherit"
                >
                  Login
                </Button>
                {/* <Button
                  onClick={handleSignIn}
                  className="p-2 cursor-pointer"
                  color="inherit"
                >
                  Signup
                </Button> */}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                  justifyContent: "flex-end",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    mr: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Welcome, {user.displayName}
                </Typography>
                <Typography onClick={handleSignOut} sx={{ cursor: "pointer" }}>
                  Sign out
                </Typography>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
