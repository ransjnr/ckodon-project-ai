"use client";
import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";
import { MoreVert, SaveAlt, Refresh, Share } from "@mui/icons-material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

const Profile = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: "",
    // major: "",
    // bio: "",
  });
  const [suggestions, setSuggestions] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const categories = [
    "Engineering",
    "Business Administration",
    "Computer Science",
    "Biological Sciences",
    "Psychology",
    "Economics",
    "Political Science",
    "History",
    "English Literature",
    "Environmental Science",
    // Add more categories as needed
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        category: formData.category,
      });

      setLoadingSuggestions(true);
      if (response.data && response.data.length > 0) {
        const formattedSuggestions = response.data
          .map(
            (suggestion) => `${suggestion.title}\n${suggestion.description}\n\n`
          )
          .join("");

        setSuggestions(formattedSuggestions);
      } else {
        setSuggestions("No suggestions found.");
      }
      setLoadingSuggestions(false);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      alert(`Error: ${error.message}`);
      setLoadingSuggestions(false);
    }
  };

  const handleReset = () => {
    setFormData({
      category: "",
      // major: "",
      // bio: "",
    });
    setSuggestions("");
    setOpenModal(false);
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      suggestions
        .split("\n")
        .map((e) => e.replace(/"/g, '""'))
        .map((e) => `"${e}"`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "suggestions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpenModal(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Project Suggestions", 20, 10);
    const suggestionsArray = suggestions.split("\n").map((s) => [s]);
    doc.autoTable({
      head: [["Suggestions"]],
      body: suggestionsArray,
    });
    doc.save("suggestions.pdf");
    setOpenModal(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Project Suggestions",
        text: suggestions,
        url: window.location.href,
      });
    } else {
      alert(
        "Share not supported on this browser. Please copy the link manually."
      );
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
    <ThemeProvider theme={theme}>
      <Box className="p-4">
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <Box sx={{ maxWidth: 1200, mx: "auto", mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    select
                    name="category"
                    label="Category"
                    fullWidth
                    margin="normal"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                  {/* <TextField
                    name="major"
                    label="Intended Major(s)"
                    fullWidth
                    margin="normal"
                    value={formData.major}
                    onChange={handleChange}
                  />
                  <TextField
                    name="bio"
                    label="Bio"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                  /> */}
                  <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                    Submit
                  </Button>
                </form>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    mt: 5,
                    maxHeight: 400,
                    overflowY: "auto",
                    position: "relative",
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Project Suggestions
                    <IconButton
                      color="primary"
                      onClick={() => setOpenModal(true)}
                      sx={{
                        ml: 1,
                      }}
                    >
                      <MoreVert className="flex" />
                    </IconButton>
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      whiteSpace: "pre-wrap",
                      backgroundColor: "#f5f5f5",
                      minHeight: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {loadingSuggestions ? (
                      <CircularProgress />
                    ) : suggestions ? (
                      <Typography>{suggestions}</Typography>
                    ) : (
                      <Typography>
                        No suggestions yet. Please submit the form.
                      </Typography>
                    )}
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <p>You must be logged in to view this page - protected route</p>
        )}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Options</DialogTitle>
          <DialogContent>
            <IconButton color="primary" onClick={handleReset}>
              <Refresh />
              <Typography variant="body2">Reset</Typography>
            </IconButton>
            <IconButton color="primary" onClick={exportToCSV}>
              <SaveAlt />
              <Typography variant="body2">Export CSV</Typography>
            </IconButton>
            <IconButton color="primary" onClick={exportToPDF}>
              <SaveAlt />
              <Typography variant="body2">Export PDF</Typography>
            </IconButton>
            <IconButton color="primary" onClick={handleShare}>
              <Share />
              <Typography variant="body2">Share</Typography>
            </IconButton>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;
