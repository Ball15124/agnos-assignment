# Project Structure

## Root
- `app/` — Next.js app routes and page components
- `components/` — shared UI components used across multiple pages
- `features/` — domain-specific feature logic and components
- `shared/` — shared utilities and helper functions
- `websocket/` — realtime WebSocket server implementation
- `docs/` — project documentation files
- `package.json`, `package-lock.json` — npm dependencies and scripts
- `tsconfig.json` — TypeScript configuration
- `next.config.ts` — Next.js runtime config
- `postcss.config.mjs`, `eslint.config.mjs` — styling and lint config

## app/
- `layout.tsx` — global layout wrapper for the Next.js app
- `page.tsx` — main home or landing page
- `patient/page.tsx` — patient-facing route
- `staff/page.tsx` — staff-facing route

## components/
- `customInput.tsx` — reusable input field component
- `customSelect.tsx` — reusable select component
- `customDialog.tsx` — shared dialog/modal wrapper
- `backButton.tsx` — reusable back button UI

## features/patient/
- `components/patientForm.tsx` — patient form UI and form validation logic
- `components/patientIdentityDialog.tsx` — patient join dialog
- `constants/patient.options.ts` — select option lists for gender, language, nationality, religion
- `hooks/usePatientRealtime.ts` — patient-side realtime websocket hook
- `schemas/patient.schema.ts` — Zod validation schema for patient form data
- `types/patient.type.ts` — patient data and shape definitions

## features/staff/
- `components/patientTable.tsx` — staff-facing table of connected patients
- `hooks/useStaffRealtime.ts` — staff-side realtime websocket hook
- `utils/staffHelper.ts` — helper logic for staff view or data processing

## features/realtime/
- `types.ts` — shared realtime websocket message type definitions

## shared/
- `utils/updatePatientValues.ts` — helper to update nested patient form values safely

## websocket/
- `server.ts` — Node WebSocket server handling patient/staff events, activity, field focus, updates and submission flow

## Notes
- The app uses a feature-based structure, separating reusable components from domain-specific logic.
- `app/` contains routes and page-level UI, while `features/` contains the actual business logic and hooks.
- `shared/` is for generic reusable helpers that don’t belong to one feature.
- `websocket/` hosts the real-time messaging server separate from the Next.js frontend.
