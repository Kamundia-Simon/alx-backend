#!/usr/bin/env node

import createPushNotificationsJobs from './8-job';
import kue from 'kue';
import { expect } from 'chai';

describe('createPushNotificationsJobs', () => {
  let queue;

  // Setup test environment
  beforeEach(() => {
    // Create a new queue before each test
    queue = kue.createQueue({
      testMode: true, // Enter test mode
    });
  });

  // Clear the queue after the test
  afterEach(() => {
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('should display an error message if jobs is not an array', () => {
    const invalidJobs = { job: 'invalid' };
    
    try {
      createPushNotificationsJobs(invalidJobs, queue);
    } catch (error) {
      expect(error.message).to.equal('Jobs is not an array');
    }
  });

  it('should create two new jobs to the queue', (done) => {
    const jobs = [
      { phoneNumber: '123', message: 'Test message 1' },
      { phoneNumber: '456', message: 'Test message 2' },
    ];

    createPushNotificationsJobs(jobs, queue);

    setTimeout(() => {
      try {
        expect(queue.testMode.jobs.length).to.equal(2);
        done();
      } catch (error) {
        done(error);
      }
    }, 100);
  });

  it('should clear the queue after tests', () => {
    const jobs = [
      { phoneNumber: '123', message: 'Test message 1' },
      { phoneNumber: '456', message: 'Test message 2' },
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.length).to.equal(0);
  });
});
