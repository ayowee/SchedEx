import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const MessageBubble = ({ message, handleOptionClick }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: message.type === "user" ? "flex-end" : "flex-start",
      mb: 2,
    }}
  >
    <Paper
      sx={{
        p: 1.5,
        maxWidth: "80%",
        bgcolor: message.type === "user" ? "primary.main" : "white",
        color: message.type === "user" ? "white" : "text.primary",
        borderRadius: 2,
      }}
    >
      <Typography variant="body2">{message.text}</Typography>
    </Paper>
    {message.options && (
      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {message.options.map((option, i) => (
          <Typography
            key={i}
            onClick={() => handleOptionClick(option)}
            sx={{
              px: 2,
              py: 0.5,
              bgcolor: "white",
              borderRadius: 5,
              fontSize: "0.875rem",
              cursor: "pointer",
              border: "1px solid",
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                bgcolor: "primary.main",
                color: "white",
              },
            }}
          >
            {option}
          </Typography>
        ))}
      </Box>
    )}
  </Box>
);

export default MessageBubble;
