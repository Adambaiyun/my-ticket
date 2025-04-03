import React, { useEffect, useState } from 'react';
import EventTable from '../components/EventTable';
import {
  Box, Button, Snackbar, Alert, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField
} from '@mui/material';

export interface Event {
  id: number;
  event_name: string;
  total_ticket_num: number;
  available_ticket_num: number;
  booked_ticket_num: number;
  start_at: string;
  created_at: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [_, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventTickets, setNewEventTickets] = useState(1);
  const [newEventStartAt, setNewEventStartAt] = useState(
    new Date().toISOString().slice(0, 16) // ISO string trimmed for datetime-local
  );
  const fetchEvents = async () => {
    try {
      const res = await fetch('/event/list');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    try {
      const res = await fetch('/event', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: newEventName.trim(),
          total_ticket_num: newEventTickets,
          start_at: new Date(newEventStartAt).toISOString(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add event');
      }

      setSuccessMessage('Event created successfully!');
      setDialogOpen(false);
      setNewEventName('');
      setNewEventTickets(1);
      setNewEventStartAt(new Date().toISOString().slice(0, 16));

      await fetchEvents();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to create event');
    }
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewEventName('');
    setNewEventTickets(1);
    setNewEventStartAt(new Date().toISOString().slice(0, 16));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Event List</Typography>
        <Button variant="contained" onClick={handleOpenDialog}>
          Add Event
        </Button>
      </Box>

      <EventTable events={events} />

      {/* Add Event Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Event Name"
            variant="outlined"
            margin="dense"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Total Tickets"
            type="number"
            variant="outlined"
            margin="dense"
            value={newEventTickets}
            onChange={(e) => setNewEventTickets(Number(e.target.value))}
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="Start At"
            type="datetime-local"
            variant="outlined"
            margin="dense"
            value={newEventStartAt}
            onChange={(e) => setNewEventStartAt(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddEvent}
            variant="contained"
            disabled={!newEventName.trim() || newEventTickets < 1 || !newEventStartAt}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbars */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage('')}
      >
        <Alert severity="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventList;
