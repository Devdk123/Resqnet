# RESQNET

RESQNET is a bamboo-inspired emergency coordination platform for fast reporting, responder coordination, and command-center oversight. The current build is a full-stack prototype designed for a hackathon and demo-ready local usage, with admin access, volunteer registration, live-style landing pages, and emergency reporting flows.

## Overview

The app is structured around a modern emergency-response workflow:

- public landing page with emergency CTA and service overview
- side panel navigation and compact app shell
- admin login and volunteer login flows
- volunteer registration flow
- report emergency page
- responder command and dashboard flows
- India-focused location and mission coverage
- green hospital / bamboo command-center aesthetic

## Current Product Features

- Responsive landing page with hero section, service cards, India coverage map, and emergency CTA
- Left-side navigation panel and top navigation shell
- Theme mode toggle for light and dark appearance
- Admin login using username/password credentials
- Volunteer registration saved in browser storage for demo use
- Google Sign-In support via VITE_GOOGLE_CLIENT_ID
- Individual responder dashboard routing based on user role
- Reporting workflow for raising an emergency event
- Command-center style layout for admin oversight and response handling
- Footer with legal links and privacy policy support

## Default Demo Accounts

Admin credentials:

- shirsh / admin
- arpit / admin
- devesh / admin

Volunteer access is handled through the registration flow and stored locally in the browser as demo user data. If a volunteer account exists, the user is routed to the responder dashboard after login.

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- UI pattern: hospital command-center / bamboo-inspired design
- Auth flow: local mock auth + optional Google Identity Services integration
- State model: browser localStorage for volunteer demo registration

## Repository Structure

- frontend/: React application
- backend/: Express API and service logic
- README.md: project documentation
- backend/sql/schema.sql: database schema template for future persistence

## App Routes

The frontend includes the following primary views:

- /
- /login
- /report
- /command-center
- /responder
- /admin-dashboard
- /privacy-policy
- /cookies

## Local Setup

1. Install dependencies:

   npm install

2. Start both workspace apps together:

   npm run dev

3. Or run them separately:

   npm run dev --workspace backend
   npm run dev --workspace frontend

4. Open the frontend in the browser:

   http://localhost:5173

## API and Backend

The backend exposes the following core endpoints:

- GET /health
- GET /api/incidents
- POST /api/incidents
- GET /api/responders
- POST /api/agent/run
- GET /api/analytics
- GET /api/demo/scenarios

Incident data is stored in Supabase PostgreSQL when both `SUPABASE_URL` and `SUPABASE_SECRET_KEY` are configured. Without them, the backend uses the bundled in-memory demo data.

To connect an existing Supabase project:

1. Copy `.env.example` to `backend/.env`.
2. Set `SUPABASE_URL` to the project URL and `SUPABASE_SECRET_KEY` to a server-side secret/service-role key. Never put this key in the frontend or commit it.
3. Run the SQL in `backend/sql/schema.sql` in the Supabase SQL Editor. The `details` JSONB column stores the complete application incident record.
4. Install dependencies and start both apps with `npm install` and `npm run dev` from the repository root.

The backend loads persisted incidents at startup and persists incident creation, verification, analysis, dispatch, and cancellation updates.

## Environment Configuration

Frontend Google login requires a client ID in the frontend environment file:

- frontend/.env

Example:

VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here

If the value is not set, Google login is disabled gracefully and the UI shows the fallback flow.

## Build and Verification

Run a production build with:

npm run build

This project was verified to build successfully with the current app state using the monorepo workspace setup.

## Notes

- This project is a functioning prototype, not yet a production-grade multi-tenant emergency system.
- Auth and data are local/mock for demo readiness.
- Volunteer registration is stored in the browser for convenience during local testing.
- Provider integrations such as Google OAuth, real maps, or external emergency systems are ready to be wired in when credentials are provided.

## Future Enhancements

- real database persistence with PostgreSQL/Supabase
- production authentication and authorization
- real GIS / routing integration
- scalable emergency dispatch orchestration
- live alerts and notification services
- stronger admin analytics and incident auditing
