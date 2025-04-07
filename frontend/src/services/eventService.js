import axios from "axios";

const BASE_URL = "/api/events"; // Update with your API endpoint

export const eventService = {
  async getEvents() {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  async createEvent(event) {
    const response = await axios.post(BASE_URL, event);
    return response.data;
  },

  async updateEvent(event) {
    const response = await axios.put(`${BASE_URL}/${event.id}`, event);
    return response.data;
  },

  async deleteEvent(eventId) {
    await axios.delete(`${BASE_URL}/${eventId}`);
    return eventId;
  },
};
