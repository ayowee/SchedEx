import React, { useState } from "react";
import {
  IconButton,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  CssBaseline,
  Box,
} from "@mui/material";
import {
  Search as SearchIcon,
  Today as TodayIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  NotificationsOutlined as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import CustomScheduler from "./components/Scheduler/Scheduler";
import ChatHead from "./components/ChatHead/ChatHead";
import ColorPicker from "./components/ColorPicker/ColorPicker";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          width: "100vw",
          boxSizing: "border-box",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          width: "100%",
          padding: "0 24px",
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Modern blue
      light: "#3b82f6",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

const App = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#2563eb");

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <AppBar
          position="static"
          color="default"
          elevation={1}
          sx={{ width: "100%" }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              px: { xs: 2, sm: 4 }, // Responsive padding
            }}
          >
            {/* Left side - Logo and Controls */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2, md: 4 }, // Responsive spacing
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  display: { xs: "none", sm: "block" }, // Hide on mobile
                }}
              >
                SchedEx
              </Typography>
              <Button variant="contained" color="primary" size="small">
                Today
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <IconButton size="small">
                  <ChevronLeftIcon />
                </IconButton>
                <Typography
                  variant="subtitle1"
                  sx={{ display: { xs: "none", md: "block" } }}
                >
                  February 2024
                </Typography>
                <IconButton size="small">
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Right side - Controls */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2, md: 3 },
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  px: 2,
                  py: 0.5,
                }}
              >
                <SearchIcon color="action" />
                <input
                  className="bg-transparent border-none outline-none ml-2 w-48"
                  placeholder="Search events..."
                />
              </Box>

              <Button
                variant="outlined"
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  minWidth: { xs: "auto", sm: 100 },
                  display: { xs: "none", sm: "flex" },
                }}
              >
                Week
              </Button>

              <IconButton sx={{ display: { xs: "none", md: "flex" } }}>
                <PaletteIcon />
              </IconButton>

              <IconButton>
                <NotificationsIcon />
              </IconButton>

              <IconButton>
                <SettingsIcon />
              </IconButton>

              <IconButton onClick={handleProfileClick}>
                <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Calendar Container */}
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            overflow: "auto",
          }}
        >
          <CustomScheduler selectedColor={selectedColor} />
        </Box>

        {/* AI Chat Button - Fixed Position */}
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <ChatHead
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            onOpen={() => setChatOpen(true)}
          />
        </Box>

        {/* Color Picker Modal */}
        <ColorPicker
          open={colorPickerOpen}
          onClose={() => setColorPickerOpen(false)}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleClose}>My Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
};

export default App;
