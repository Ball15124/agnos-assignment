# Component Architecture

## Overview
This project uses a feature-driven architecture combined with reusable UI components. The top-level `app/` routes wire the patient and staff experiences together, while `features/` provides domain-specific UI, hooks, and data handling.

## Main UI Components

### `components/customInput.tsx`
- Purpose: A reusable text input component with label, error display, disabled styling, and remote-focus highlighting.
- Design: Wraps native `<input>` with a consistent field container and styles. Supports `isRequired`, `error`, and `remoteFocus` props.

### `components/customSelect.tsx`
- Purpose: A reusable select/dropdown component for form fields.
- Design: Renders a styled `<select>` with custom option behavior, built-in label and error handling, and remote focus state for live highlighting.

### `components/customDialog.tsx`
- Purpose: Generic modal used for success and warning dialogs across the app.
- Design: Supports success and warning themes, title/description text, close/confirm actions, and an icon state that changes based on theme.

### `components/backButton.tsx`
- Purpose: Reusable navigation button that returns the user to the previous screen or role selection.
- Design: Includes an arrow icon and animated text label for desktop, with compact icon-only behavior on smaller screens.

## Feature Components

### `features/patient/components/patientForm.tsx`
- Purpose: Core patient form UI and validation.
- Design: Uses `react-hook-form` with `Controller` wrappers for fields, ensuring controlled form state and validation.
- Responsibilities:
  - Render form fields for patient information.
  - Manage read-only mode and remote updates for staff view.
  - Emit focus, blur, and form activity callbacks.

### `features/patient/components/patientIdentityDialog.tsx`
- Purpose: Initial patient identity capture prompt.
- Design: Simple centered dialog capturing nickname before patient enters form. Navigates back if the user cancels.

### `features/staff/components/patientTable.tsx`
- Purpose: Staff dashboard list of connected patients.
- Design: Table rows are selectable and show patient status, connection timestamp, nickname, and ID.
- Responsibilities:
  - Highlight selected patient.
  - Emit selection events for patient detail display.

## Realtime Hooks

### `features/patient/hooks/usePatientRealtime.ts`
- Purpose: Handle patient-side WebSocket interactions.
- Design: Opens a socket on nickname set, sends JOIN, field focus/blur, active/update, submit, and leave events.
- Responsibilities:
  - Maintain patient socket connection.
  - Keep patient ID state.
  - Provide handlers for form events.

### `features/staff/hooks/useStaffRealtime.ts`
- Purpose: Handle staff-side WebSocket interactions.
- Design: Opens a socket as staff, listens to server events, and updates staff state for patients.
- Responsibilities:
  - Keep an up-to-date list of patients.
  - Update statuses and focused field state.
  - Remove disconnected or expired patients.

## Shared Types and Utilities

### `features/realtime/types.ts`
- Purpose: Shared websocket message contract between client and server.
- Design: Defines event shapes like JOIN, PATIENT_CONNECTED, PATIENT_FIELD_UPDATE, PATIENT_SUBMITTED, and others.

### `shared/utils/updatePatientValues.ts`
- Purpose: Safely update nested patient values on the staff side.
- Design: Utility to apply field updates to the patient data structure without mutating incorrectly.

## Page Components

### `app/patient/page.tsx`
- Purpose: Compose patient UI and realtime behavior.
- Design: Displays back button, header, `PatientForm`, and dialogs. Uses `usePatientRealtime` to connect form activity to the websocket.
- Responsibilities:
  - Manage patient nickname state.
  - Show join dialog and submission dialog.
  - Prevent leaving with unsaved changes.

### `app/staff/page.tsx`
- Purpose: Compose staff dashboard UI.
- Design: Includes `BackButton`, `PatientTable`, and a responsive patient detail panel.
- Responsibilities:
  - Manage selected patient state.
  - Render a slide-up panel with `PatientForm` in read-only mode for the selected patient.
  - Use `useStaffRealtime` to keep patient list live.

  ## Backend (`websocket/`)
 
- **`server.ts`** — Standalone Node WebSocket server, independent of the Next.js app. Maintains all real-time session state in memory:
  - Connected patients and their form values
  - Staff socket connections
  - Per-patient activity timers (active → idle transition)
  - Per-patient focused-field tracking
  - Submitted patients cache (with expiry)
  The server acts as the single source of truth during a session, broadcasting every patient event to all connected staff sockets so the dashboard stays in sync in real time.

