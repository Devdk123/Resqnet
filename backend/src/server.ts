import app from './app.js';
import { env } from './config/env.js';
import { initializeStore } from './state/store.js';

await initializeStore();

app.listen(env.port, () => {
  console.log(`RESQNET API running on http://localhost:${env.port}`);
});
