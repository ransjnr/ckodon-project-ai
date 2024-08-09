import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { UserAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {!user ? (
          <>
            <ListItem button onClick={handleSignIn}>
              <ListItemText primary="Login" />
            </ListItem>
            {/* <ListItem button onClick={handleSignIn}>
              <ListItemText primary="Signup" />
            </ListItem> */}
          </>
        ) : (
          <>
            <ListItem>
              <ListItemText primary={`Welcome, ${user.displayName}`} />
            </ListItem>
            <ListItem button onClick={handleSignOut}>
              <ListItemText primary="Sign out" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box className="bg-blue-600 h-15 w-full flex items-center justify-between p-2">
            <Box className="flex">
              <Typography
                className="p-2 cursor-pointer"
                component="div"
                sx={{ flexGrow: 1 }}
                variant="h4"
              >
                <Link href="/" className="">
                  projAI
                </Link>
              </Typography>
            </Box>
            <Typography
              className="p-2 cursor-pointer"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              <Link href="/profile">Chat</Link>
            </Typography>
            {loading ? null : (
              <Box
                className="flex"
                sx={{ flexGrow: 1, justifyContent: "flex-end" }}
              >
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ display: { xs: "block", sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  {!user ? (
                    <>
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
                    </>
                  ) : (
                    <>
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
                      <Typography
                        onClick={handleSignOut}
                        sx={{ cursor: "pointer" }}
                      >
                        Sign out
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </Box>
  );
}
