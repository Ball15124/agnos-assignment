# Realtime Sync Flow

## Overview
The realtime sync flow connects the patient form and staff view through a WebSocket server. Patient events are emitted from the browser and broadcast to all connected staff clients so staff can monitor live input, focus state, and submission status.

## Connection Flow
- Patient and staff clients connect to the same WebSocket server.
- Each client sends a `JOIN` event:
  - Patients send `JOIN` with role `patient` and nickname.
  - Staff sends `JOIN` with role `staff`.
- The server assigns a unique `patientId` to each patient and responds with `PATIENT_ID_ASSIGNED`.
- When staff connects, the server sends the current patient list and any existing submitted patients.

## Patient-side sync events
### `PATIENT_ACTIVE`
- Sent whenever the patient makes a change in the form.
- The server broadcasts this to staff so the patient appears active.
- The server also starts/reset a 3-second idle timer.

### `PATIENT_FIELD_UPDATE`
- Sent whenever a patient changes a field value.
- The server updates the stored patient values and broadcasts the field update to staff.
- Staff receive the field name and latest value, allowing live reflection in the read-only form.

### `PATIENT_FIELD_FOCUS`
- Sent when a patient focuses a form field.
- The server stores the currently focused field and broadcasts the focus event to staff.
- Staff can highlight the currently focused field in the read-only patient form.

### `PATIENT_FIELD_BLUR`
- Sent when a patient leaves a focused field.
- The server clears the stored focus and broadcasts the blur event to staff.

### `PATIENT_SUBMITTED`
- Sent when the patient submits the form.
- The server marks the patient as submitted, clears focus state, and broadcasts the submission event.
- Submitted sessions are retained for a period and can expire after 30 minutes.

### `PATIENT_LEAVE`
- Sent when the patient intentionally leaves the page or closes the browser.
- The server removes the patient session and notifies staff of disconnection.

## Server-side behavior
- The server tracks:
  - active patient sessions
  - socket-to-patient associations
  - staff sockets
  - activity timers for idle detection
  - submitted patient sessions and expiration timers
  - current focused field per patient
- On every event, the server validates session state and only broadcasts from active, non-submitted patients.
- The server uses helper functions like `updatePatientValue` to apply nested field updates reliably.

## Staff-side sync behavior
- The staff client listens for server messages and updates its local list of patients.
- Received events include:
  - `PATIENT_CONNECTED`
  - `PATIENT_DISCONNECTED`
  - `PATIENT_ACTIVE`
  - `PATIENT_IDLE`
  - `PATIENT_FIELD_FOCUS`
  - `PATIENT_FIELD_BLUR`
  - `PATIENT_FIELD_UPDATE`
  - `PATIENT_SUBMITTED`
  - `PATIENT_EXPIRED`
  - `STAFF_READY`
- The staff UI keeps patient status and field focus in sync as changes arrive.
- Selected patient details are displayed in a read-only `PatientForm` with `realTimeUpdate` and `focusField` props.

## Message protocol
### Shared message types
- `JOIN`: role `patient` or `staff`
- `PATIENT_ACTIVE`: patient ID only
- `PATIENT_FIELD_FOCUS`: patient ID + field
- `PATIENT_FIELD_BLUR`: patient ID
- `PATIENT_FIELD_UPDATE`: patient ID + field + value
- `PATIENT_SUBMITTED`: patient ID
- `PATIENT_LEAVE`: patient ID

### Server broadcasts
- `PATIENT_ID_ASSIGNED`: assigned patient ID
- `PATIENT_CONNECTED`: new patient connected
- `PATIENT_DISCONNECTED`: patient disconnected
- `PATIENT_ACTIVE`: patient active
- `PATIENT_IDLE`: patient became idle
- `PATIENT_FIELD_FOCUS`: field focus changed
- `PATIENT_FIELD_BLUR`: field blur event
- `PATIENT_FIELD_UPDATE`: live field value update
- `PATIENT_SUBMITTED`: patient finished the form
- `PATIENT_EXPIRED`: submitted session expired
- `STAFF_READY`: staff socket is ready for updates

## Synchronization guarantees
- The design aims to keep staff-side state eventually consistent with patient-side actions.
- The server acts as the single source of truth for active patient sessions and focus state.
- Field updates are forwarded immediately so the staff view can render near real-time changes.
- Activity state is derived from patient edits and timed idle detection rather than continuous polling.

## Notes
- This architecture is optimized for live monitoring rather than two-way editing.
- The server does not send patient updates back to the originating patient; it only broadcasts to staff.
- Focus tracking gives staff context about what the patient is working on without exposing intermediate typing before the field value change is sent.
