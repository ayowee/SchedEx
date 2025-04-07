
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SlotAddingPage from './pages/SlotAddingPage';
import SlotManagingPage from './pages/SlotManagingPage';
import './App.css';
import { SlotProvider } from './context/SlotContext';

function App() {
  return (
    <SlotProvider>
      <Router>
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-xl font-bold text-gray-900">SchedEx</span>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      <Link
                        to="/managing-slot"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Home
                      </Link>
                      <Link
                        to="/create-slot"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Manage Slots
                      </Link>
                      <Link
                        to="/managing-slot"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Add Slots
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/managing-slot" element={<SlotManagingPage />} />
              <Route path="/create-slot" element={<SlotAddingPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SlotProvider>
  );
}

import React, { useState, useCallback } from "react";
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
  Stack,
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
  ListAlt as ListAltIcon,
} from "@mui/icons-material";
import CustomScheduler from "./components/Scheduler/Scheduler";
import ChatHead from "./components/ChatHead/ChatHead";
import ColorPicker from "./components/ColorPicker/ColorPicker";
import AgendaDialog from "./components/AgendaDialog/AgendaDialog";
import ChatBot from "./components/ChatBot/ChatBot";
import SearchBar from "./components/Search/SearchBar";

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

// Initial dummy events
const initialEvents = [
  {
    event_id: 1,
    title: "Team Meeting",
    description: "Weekly team sync-up",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    color: "#2563eb",
    location: "Conference Room A",
  },
  {
    event_id: 2,
    title: "Project Review",
    description: "Q1 project status review",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 30, 0, 0)),
    color: "#dc2626",
    location: "Virtual Meeting",
  },
];

const App = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#2563eb");
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [schedulerRef, setSchedulerRef] = useState(null);
  const [events, setEvents] = useState(initialEvents);
  const [currentView, setCurrentView] = useState("week");

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Event handlers
  const handleEventAdd = (newEvent) => {
    setEvents((prev) => [
      ...prev,
      {
        ...newEvent,
        color: newEvent.color || selectedColor,
        location: newEvent.location || "",
      },
    ]);
  };

  const handleEventUpdate = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.event_id === updatedEvent.event_id
          ? {
              ...updatedEvent,
              color: updatedEvent.color || event.color,
              location: updatedEvent.location || event.location,
            }
          : event
      )
    );
  };

  const handleEventDelete = useCallback((eventId) => {
    setEvents((prev) => prev.filter((event) => event.event_id !== eventId));
  }, []);

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
            {/* Left side - Logo and Agenda button only */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              >
                SchedEx
              </Typography>

              <Button
                variant="outlined"
                startIcon={<ListAltIcon />}
                onClick={() => setAgendaOpen(true)}
              >
                View Agenda
              </Button>
            </Stack>

            {/* Center - Search Bar */}
            <Box sx={{ flex: 1, mx: 4, maxWidth: 500 }}>
              <SearchBar events={events} />
            </Box>

            {/* Right side controls */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="button"
                sx={{
                  px: 2,
                  py: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  minWidth: 120,
                  textAlign: "center",
                }}
              >
                {`${currentView} View`}
              </Typography>

              <IconButton>
                <NotificationsIcon />
              </IconButton>

              <IconButton>
                <SettingsIcon />
              </IconButton>

              <IconButton onClick={handleProfileClick}>
                <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
              </IconButton>
            </Stack>
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
          <CustomScheduler
            events={events}
            selectedColor={selectedColor}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            getSchedulerRef={setSchedulerRef}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        </Box>

        {/* Only ChatBot component, no additional Fab button */}
        <ChatBot />

        {/* Color Picker Modal */}
        <ColorPicker
          open={colorPickerOpen}
          onClose={() => setColorPickerOpen(false)}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />

        {/* Agenda Dialog */}
        <AgendaDialog
          open={agendaOpen}
          onClose={() => setAgendaOpen(false)}
          events={events}
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
