#!/usr/bin/env node

import redis from 'redis';

// Create a Redis client
const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Data to store in the hash
const schoolData = {
  Portland: 50,
  Seattle: 80,
  'New York': 20,
  Bogota: 20,
  Cali: 40,
  Paris: 2,
};

// create the hash using hset
function createHash() {
  Object.entries(schoolData).forEach(([city, value]) => {
    client.hset('HolbertonSchools', city, value, redis.print);
  });
}

// Display the hash in Redis using hgetall
function displayHash() {
  client.hgetall('HolbertonSchools', (err, object) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log(object);
    }
  });
}

// Call functions
createHash();
displayHash();
