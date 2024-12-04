#!/usr/bin/env node

import kue from 'kue';

// Create a queue
const queue = kue.createQueue();

// Create the job data
const jobData = {
  phoneNumber: '0722000000',
  message: 'Verification code XXXXXX'
};

// Create a job in push_notification_code queue
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (err) {
      console.error('Error creating the job:', err);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });

// Listen for job events
job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed', (errorMessage) => {
  console.log(`Notification job failed: ${errorMessage}`);
});
