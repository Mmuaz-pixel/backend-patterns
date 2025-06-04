const circuitBreaker = require('opossum');
const axios = require('axios');

// Define the function to wrap
async function fetchData() {
  const response = await axios.get('https://api.example.com/data');
  return response.data;
}

// Create the breaker
const breaker = circuitBreaker(fetchData, {
  timeout: 3000, // If function takes longer, consider it a failure
  errorThresholdPercentage: 50, // % of failures to trip the breaker
  resetTimeout: 10000, // Time to wait before trying again
});

// Add event listeners (optional)
breaker.on('open', () => console.log('Breaker OPEN: Calls will fail fast.'));
breaker.on('halfOpen', () => console.log('Breaker HALF-OPEN: Trial call.'));
breaker.on('close', () => console.log('Breaker CLOSED: All good again.'));
breaker.on('fallback', () => console.log('Using fallback'));

breaker.fallback(() => ({ message: 'Service unavailable' }));

// Call the breaker
breaker.fire()
  .then(data => console.log(data))
  .catch(err => console.error('Request failed:', err.message));
