#!/usr/bin/env node

import express from 'express';
import kue from 'kue';
import redis from 'redis';
import { promisify } from 'util';

// Create Redis client
const redisClient = redis.createClient();
const reserveSeat = (number) => redisClient.set('available_seats', number);
const getCurrentAvailableSeats = promisify(redisClient.get).bind(redisClient);

reserveSeat(50);

const queue = kue.createQueue();

const app = express();
const PORT = 1245;

let reservationEnabled = true;

// Routes
app.get('/available_seats', async (req, res) => {
  try {
    const availableSeats = await getCurrentAvailableSeats('available_seats');
    res.json({ numberOfAvailableSeats: availableSeats || '0' });
  } catch (err) {
    console.error('Error fetching available seats:', err);
    res.status(500).json({ error: 'Cannot fetch available seats' });
  }
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    res.json({ status: 'Reservation in process' });
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
  });
});

app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    try {
      // Correctly fetch the available seats from Redis
      const availableSeats = parseInt(await getCurrentAvailableSeats('available_seats'), 10) || 0;

      if (availableSeats <= 0) {
        reservationEnabled = false;
        return done(new Error('Not enough seats available'));
      }

      const newAvailableSeats = availableSeats - 1;
      reserveSeat(newAvailableSeats);

      if (newAvailableSeats === 0) {
        reservationEnabled = false;
      }

      done();
    } catch (err) {
      console.error('Error processing reservation:', err);
      done(err);
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
