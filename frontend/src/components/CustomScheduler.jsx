import { validateEvent } from "../utils/eventValidations";
import ErrorBoundary from './ErrorBoundary';
import { useCallback, useState } from 'react';
import ErrorBoundaryWithAlert from './ErrorBoundaryWithAlert';
import AgendaDialog from './AgendaDialog';

const handleEventDrop = async ({ event, start, end }) => {
  const updatedEvent = {
    ...event,
    start,
    end,
  };

  const validation = validateEvent(updatedEvent);

  if (!validation.isValid) {
    setSnackbar({
      open: true,
      message: validation.errors.join(", "),
      severity: "error",
    });
    return false; // Prevent the drop
  }

  try {
    await handleEventUpdate(updatedEvent);
    setSnackbar({
      open: true,
      message: "Event updated successfully",
      severity: "success",
    });
    return true;
  } catch (error) {
    setSnackbar({
      open: true,
      message: "Failed to update event",
      severity: "error",
    });
    return false;
  }
};

const CustomScheduler = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleClose = useCallback(() => {
    setShowDialog(false);
    setSelectedEvent(null);
  }, []);

  const handleConfirm = useCallback((formData) => {
    // Your event handling logic here
    handleClose();
  }, [handleClose]);

  return (
    <>
      {showDialog && (
        <AgendaDialog
          event={selectedEvent}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      )}
      {/* ... rest of your component ... */}
    </>
  );
};

export default CustomScheduler;
