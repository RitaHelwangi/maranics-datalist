# Maranics DataList

A schema-driven frontend interface for viewing and managing data collections. Built as a graduation project in collaboration with Maranics.

## Live Demo

https://ritahelwangi.github.io/maranics-datalist/

## About

Maranics is a software company that builds digital tools for the maritime industry. Their platform includes multiple applications, Flow Manager is one of them, focused on collecting and presenting operational data in real time. This project improves the DataList app, one of the core interfaces users interact with to view and manage data records.

The main focus was making the app mobile-friendly and generic enough to work with any kind of data collection without code changes.

## Features

* Schema-driven architecture: add a new collection in `data.ts`, zero code changes needed
* Table view for desktop with toggleable columns and inline editing
* Card view optimized for mobile with a "More" modal for full details
* Search across all fields
* Filter panel with searchable dropdowns per collection
* Saved filters: name and reuse filter combinations
* Add and edit items via a dynamic form generated from the schema
* Pagination
* Responsive design, mobile first

## Tech Stack

* React 19
* TypeScript
* Vite
* Tailwind CSS

## Project Structure

```
src/
  components/
    CardView.tsx       # Mobile-first card layout
    TableView.tsx      # Desktop table with column toggle
    FilterPanel.tsx    # Slide-in filter panel with saved filters
    FilterBar.tsx      # Search input and filter trigger
    ItemForm.tsx       # Add/edit form generated from schema
    Sidebar.tsx        # Collection navigation
    Pagination.tsx     # Page controls
    Badge.tsx          # Colored status/tag badge
    EditableCell.tsx   # Inline editing for table cells
  api.ts               # API service layer (Maranics Flow Manager REST API)
  data.ts              # Mock data modeled from real API response
  types.ts             # TypeScript interfaces
  App.tsx              # Main app state and layout
```

## API Integration

The app includes a real API integration layer (`api.ts`) that connects to the Maranics Flow Manager REST API. Collections were successfully fetched from the live API during development. Item fetching was implemented but the app currently runs on mock data that is modeled directly from the real API response.

To switch to live data, replace the mock imports in `App.tsx` with calls to `fetchCollections()` and `fetchItems(collectionId)` from `api.ts`.

Authentication uses a Bearer token stored in a `.env` file:

```
VITE_RITA_TOKEN=your_token_here
```

## Getting Started

```bash
npm install
npm run dev
```

## What's Next

* Connect to the live API and replace mock data
* Field configuration UI
* Bulk actions
* Dark mode

## Author

Rita Helwangi
