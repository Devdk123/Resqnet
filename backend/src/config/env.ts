import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || '',
  mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN || '',
  weatherProvider: process.env.WEATHER_PROVIDER || 'open-meteo',
  weatherApiUrl: process.env.WEATHER_API_URL || 'https://api.open-meteo.com/v1/forecast',
  demoMode: process.env.DEMO_MODE !== 'false',
  emergencyServiceMode: process.env.EMERGENCY_SERVICE_MODE || 'mock',
  notificationProvider: process.env.NOTIFICATION_PROVIDER || 'in_app',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 120),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
};
