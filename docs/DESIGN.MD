# Design Overview

## Purpose
This project is designed as a real-time patient intake and monitoring system. Patients enter information through a guided form while staff view live updates, status changes, field focus, and submission state in a responsive dashboard.

## UI Design

- **Patient Page** (`app/patient/page.tsx`)
  - Uses a simple centered layout with a back button, title, description, and the patient form.
  - Shows a join dialog before the patient enters their nickname.
  - Displays a success dialog once the form is submitted.
  - Provides leave confirmation when the patient has unsaved changes.

- **Staff Page** (`app/staff/page.tsx`)
  - Uses a split responsive layout: patient list on the left, patient detail panel on the right.
  - On mobile, selected patient details slide up from the bottom as a panel.
  - Includes a back button and a clean dashboard heading.
  - Patient detail panel shows read-only form data and currently focused fields.

## Responsiveness and Interaction

- Layouts adapt to mobile and desktop using responsive Tailwind classes.
- The staff view panel appears conditionally on patient selection and slides in/out on smaller screens.
- Remote focus and update highlighting support real-time collaboration by showing which field the patient is interacting with.