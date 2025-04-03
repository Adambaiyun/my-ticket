import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Event } from './EventList';

interface Props {
  events: Event[];
}

const EventTable: React.FC<Props> = ({ events }) => {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
      <Typography variant="h6" sx={{ p: 2, pb: 0 }}>Event List</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Total Tickets</TableCell>
            <TableCell>Remaining Tickets</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(event => (
            <TableRow key={event.id} hover>
              <TableCell>{event.event_name}</TableCell>
              <TableCell>{event.total_ticket_num}</TableCell>
              <TableCell>{event.available_ticket_num}</TableCell>
              <TableCell>{new Date(event.start_at).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventTable;