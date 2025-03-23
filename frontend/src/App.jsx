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
  const handleEventAdd = useCallback((newEvent) => {
    setEvents((prev) => [...prev, { ...newEvent, event_id: Date.now() }]);
  }, []);

  const handleEventUpdate = useCallback((updatedEvent) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.event_id === updatedEvent.event_id ? updatedEvent : event
      )
    );
  }, []);

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

            {/* Right side controls */}
            <Stack direction="row" spacing={2} alignItems="center">
              <div className="flex items-center bg-gray-100 rounded-md px-3 py-1">
                <SearchIcon className="text-gray-500" />
                <input
                  className="bg-transparent border-none outline-none ml-2 w-48"
                  placeholder="Search events..."
                />
              </div>

              {/* Current View Display */}
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

        {/* Add ChatBot */}
        <ChatBot />
      </Box>
    </ThemeProvider>
  );
};

export default App;
