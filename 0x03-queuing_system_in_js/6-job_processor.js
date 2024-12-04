#!/usr/bin/env node

import kue from 'kue';

const queue = kue.createQueue();

// Define the sendNotification function
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Creates a job processor that listens for jobs on the push_notification_code queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;

  sendNotification(phoneNumber, message);

  done();
});

// Log on successfull connection
queue.on('ready', () => {
  console.log('Queue is ready and processing jobs...');
});

// Log errors
queue.on('error', (err) => {
  console.log('Error in processing the job:', err);
});
