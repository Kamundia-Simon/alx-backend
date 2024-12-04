#!/usr/bin/env node

import kue from 'kue';


const blacklistedNumbers = ['4153518780', '4153518781'];

// Create queue
const queue = kue.createQueue();

// send notification and track job progress
function sendNotification(phoneNumber, message, job, done) {
  // Track progress (start with 0%)
  job.progress(0, 100);

  // Check if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job if the phone number is blacklisted
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  } else {
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done();
  }
}

queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
