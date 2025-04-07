import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Work, Cake, Add } from "@mui/icons-material";

const Sidebar = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {/* Account Section */}
        <div className="text-sm text-gray-500">account-one@email.com</div>
        <div className="text-sm text-gray-500">account-two@email.com</div>
        <button className="text-sm text-gray-500 hover:text-gray-700">
          + Add calendar account
        </button>
      </div>

      <Divider />

      {/* Calendars Section */}
      <List>
        <ListItem button>
          <ListItemIcon>
            <Work />
          </ListItemIcon>
          <ListItemText primary="Work" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Cake />
          </ListItemIcon>
          <ListItemText primary="Birthdays" />
        </ListItem>
      </List>

      <Divider />

      {/* Databases Section */}
      <List>
        <ListItem button>
          <ListItemText primary="Notion Database 1" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Notion Database 2" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
