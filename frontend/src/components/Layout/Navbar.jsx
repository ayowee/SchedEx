import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import {
  ListAlt as ListAltIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  NotificationsOutlined as NotificationsIcon,
} from "@mui/icons-material";
import AgendaDialog from "../Calendar/AgendaDialog";

const Navbar = ({ currentView, schedulerRef }) => {
  const [agendaOpen, setAgendaOpen] = useState(false);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "primary.main" }}
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

        <Stack direction="row" spacing={2} alignItems="center">
          <Box className="flex items-center bg-gray-100 rounded-md px-3 py-1">
            <SearchIcon className="text-gray-500" />
            <input
              className="bg-transparent border-none outline-none ml-2 w-48"
              placeholder="Search events..."
            />
          </Box>

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
          <IconButton>
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
          </IconButton>
        </Stack>
      </Toolbar>

      <AgendaDialog open={agendaOpen} onClose={() => setAgendaOpen(false)} />
    </AppBar>
  );
};

export default Navbar;
