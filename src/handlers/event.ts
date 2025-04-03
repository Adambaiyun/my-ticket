// src/routes/event.ts
import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/list', async (_req, res) : Promise<any> => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.get('/:id', async (req: Request, res: Response) : Promise<any> => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query('SELECT * FROM events WHERE id = $1 ORDER BY created_at DESC', [id]);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.put('/', async (req: Request, res: Response) : Promise<any> => {
  const { event_name, total_ticket_num, start_at } = req.body;

  try {
    const insertQuery = `
      INSERT INTO events (
        event_name, total_ticket_num, available_ticket_num,
        booked_ticket_num, start_at
      )
      VALUES ($1, $2, $2, 0, $3)
      RETURNING *;
    `;
    const values = [event_name, total_ticket_num, start_at];
    const result = await pool.query(insertQuery, values);
    return res.status(201).json(result.rows[0]);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) : Promise<any> => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    } else {
      return res.json({ message: 'Event deleted', event: result.rows[0] });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete event' });
  }
});

router.post('/book/:id', async (req: Request, res: Response) : Promise<any> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    // This statement ensures availability check and update happen atomically
    const updateQuery = `
      UPDATE events
      SET
        available_ticket_num = available_ticket_num - 1,
        booked_ticket_num = booked_ticket_num + 1
      WHERE id = $1 AND available_ticket_num >= 1
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [id]);

    if (result.rowCount === 0) {
      // No booking occurred, possibly oversell attempt
      return res.status(500).json({ error: 'Booking failed: No tickets available or invalid ID.' });
    }
    
    return res.json({ message: 'Ticket booked!', event: result.rows[0] });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to book ticket' });
  }
});

export default router;