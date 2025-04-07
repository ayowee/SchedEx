import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Fab,
  Paper,
} from "@mui/material";
import { Close, Chat } from "@mui/icons-material";

const ChatHead = ({ open, onClose, onOpen }) => {
  return (
    <>
      {/* Chat Button */}
      <Fab color="primary" className="fixed bottom-6 right-6" onClick={onOpen}>
        <Chat />
      </Fab>

      {/* Chat Dialog */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        className="fixed bottom-0 right-0"
      >
        <DialogTitle className="flex justify-between items-center">
          AI Assistant
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Paper className="h-96 p-4">
            {/* Chat messages would go here */}
            <div className="text-gray-500 text-center mt-4">
              How can I help you today?
            </div>
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatHead;
