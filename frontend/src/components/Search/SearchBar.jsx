import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Popper,
  Grow,
  ClickAwayListener,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

const SearchBar = ({ events }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const anchorRef = useRef(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredEvents = events.filter((event) => {
      const searchTerm = query.toLowerCase();
      return (
        event.title?.toLowerCase().includes(searchTerm) ||
        event.description?.toLowerCase().includes(searchTerm) ||
        event.location?.toLowerCase().includes(searchTerm)
      );
    });

    setSearchResults(filteredEvents);
    setIsSearching(true);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleClickAway = () => {
    setIsSearching(false);
  };

  const handleResultClick = (event) => {
    // Here you can add functionality to navigate to the event in the calendar
    console.log("Navigate to event:", event);
    setIsSearching(false);
  };

  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: 400 }}>
      <TextField
        ref={anchorRef}
        fullWidth
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search events..."
        variant="outlined"
        size="small"
        sx={{
          bgcolor: "background.paper",
          borderRadius: 1,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "transparent",
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Popper
        open={isSearching && searchResults.length > 0}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        style={{ width: anchorRef.current?.offsetWidth, zIndex: 1400 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClickAway}>
                <List sx={{ 
                  maxHeight: 400,
                  overflow: 'auto',
                  mt: 1
                }}>
                  {searchResults.map((event) => (
                    <ListItem 
                      key={event.event_id}
                      onClick={() => handleResultClick(event)}
                      sx={{
                        borderLeft: 3,
                        borderColor: event.color || 'primary.main',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" component="div">
                          {event.title}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimeIcon fontSize="small" color="action" />
                            <Typography variant="caption" component="div">
                              {format(new Date(event.start), 'MMM dd, yyyy h:mm a')}
                            </Typography>
                          </Box>
                          {event.location && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EventIcon fontSize="small" color="action" />
                              <Typography variant="caption" component="div">
                                {event.location}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};

export default SearchBar;
