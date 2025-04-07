import React from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { GeminiLogo } from "./GeminiLogo";

const ChatHeader = ({ isMinimized, setIsMinimized, setIsOpen }) => (
  <Box
    sx={{
      background:
        "linear-gradient(135deg, #9168C0 0%, #5684D1 50%, #1BA1E3 100%)",
      p: 2,
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar sx={{ bgcolor: "transparent", width: 40, height: 40 }}>
        <GeminiLogo />
      </Avatar>
      <Box>
        <Typography variant="subtitle1">Schedula AI</Typography>
        <Typography variant="caption">Scheduling Assistant</Typography>
      </Box>
    </Box>
    <Box>
      <IconButton
        size="small"
        color="inherit"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <KeyboardArrowDownIcon />
      </IconButton>
      <IconButton size="small" color="inherit" onClick={() => setIsOpen(false)}>
        <CloseIcon />
      </IconButton>
    </Box>
  </Box>
);

export default ChatHeader;
