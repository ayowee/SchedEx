import React from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { Box } from "@mui/material";

const CustomScheduler = ({
  getSchedulerRef,
  selectedColor,
  currentView,
  onViewChange,
}) => {
  const customStyles = `
    .rs__view_navigator button:nth-child(2) {
      display: none !important;
    }
  `;

  return (
    <Box sx={{ height: "calc(100vh - 64px)", width: "100%" }}>
      <style>{customStyles}</style>
      <Scheduler
        getSchedulerRef={getSchedulerRef}
        view={currentView.toLowerCase()}
        onViewChange={(newView) => onViewChange(newView)}
        fields={[
          {
            name: "color",
            type: "hidden",
            default: selectedColor,
          },
        ]}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 0,
          startHour: 0,
          endHour: 24,
          step: 60,
        }}
        day={{
          startHour: 0,
          endHour: 24,
          step: 60,
        }}
        month={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 0,
        }}
        hourFormat="12"
      />
    </Box>
  );
};

export default CustomScheduler;
