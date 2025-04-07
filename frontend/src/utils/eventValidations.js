// Create a new validation utility file
export const validateEvent = (event) => {
  const errors = [];

  // Title validations
  if (!event.title) {
    errors.push("Title is required");
  } else if (event.title.length < 3) {
    errors.push("Title must be at least 3 characters long");
  } else if (event.title.length > 50) {
    errors.push("Title must not exceed 50 characters");
  }

  // Description validations
  if (event.description && event.description.length > 500) {
    errors.push("Description must not exceed 500 characters");
  }

  // Date/Time validations
  if (!event.start || !event.end) {
    errors.push("Start and end times are required");
  } else {
    const start = new Date(event.start);
    const end = new Date(event.end);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      errors.push("Invalid date format");
    } else if (end <= start) {
      errors.push("End time must be after start time");
    }

    // Prevent events longer than 24 hours
    const duration = (end - start) / (1000 * 60 * 60); // duration in hours
    if (duration > 24) {
      errors.push("Event duration cannot exceed 24 hours");
    }
  }

  // Location validations
  if (event.location && event.location.length > 100) {
    errors.push("Location must not exceed 100 characters");
  }

  // Color validations
  if (event.color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(event.color)) {
    errors.push("Invalid color format. Use hex color code (e.g., #dc2626)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
