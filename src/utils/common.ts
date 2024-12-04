export const CORS_OPTIONS = {
  origin: [
    'http://localhost:3000',
    'https://cubex-chat-front-production.up.railway.app/',
    'http://localhost', // for postman
  ], // or '*' or whatever is required
  allowedHeaders: [
    'Access-Control-Allow-Origin',
    'Origin',
    'X-Requested-With',
    'Accept',
    'Content-Type',
    'Authorization',
    'Fingerprint',
  ],
  exposedHeaders: 'Authorization',
  credentials: true,
  methods: ['GET', 'PUT', 'PATCH', 'OPTIONS', 'POST', 'DELETE'],
};
