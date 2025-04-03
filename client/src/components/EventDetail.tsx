import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container, Typography, CircularProgress, Button, Snackbar, Alert, Box
} from '@mui/material';

export interface Event {
  id: number;
  event_name: string;
  total_ticket_num: number;
  available_ticket_num: number;
  booked_ticket_num: number;
  created_at: string;
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/event/${id}`);
      const data = await res.json();
      setEvent(data[0]);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load event.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleBook = async () => {
    try {
      const res = await fetch(`/event/book/${id}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      setSuccessMessage('Ticket booked successfully!');
      await fetchEvent(); // 🔄 re-fetch to update UI
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Booking failed');
    }
  };

  const simulateConcurrency = async (count: number = 10) => {
    const requests = Array.from({ length: count }, () =>
      fetch(`/event/book/${id}`, { method: 'POST' })
    );
  
    const results = await Promise.allSettled(requests);
    let success = 0;
    let failed = 0;
  
    for (const res of results) {
      if (res.status === 'fulfilled' && res.value.ok) {
        success++;
      } else {
        failed++;
      }
    }
  
    setSuccessMessage(`Simulated ${count} bookings: ${success} succeeded, ${failed} failed.`);
    await fetchEvent(); // Refresh info
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return <Typography variant="h6" sx={{ m: 4 }}>Event not found.</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>{event.event_name}</Typography>
      <Typography sx={{ mb: 1 }}>
        Date: {new Date(event.created_at).toLocaleString()}
      </Typography>
      <Typography>Total Tickets: {event.total_ticket_num}</Typography>
      <Typography>Booked: {event.booked_ticket_num}</Typography>
      <Typography>Remaining: {event.available_ticket_num}</Typography>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleBook} disabled={event.available_ticket_num < 1}>
          Book
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={() => simulateConcurrency(10)} // You can change the number
        >
          Simulate Concurrency
        </Button>
        <Button variant="outlined" component={Link} to="/">← Back</Button>
      </Box>
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
  
</Box>


      {/* ✅ Snackbar for Error */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage('')}
      >
        <Alert severity="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* ✅ Snackbar for Success */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventDetail;
