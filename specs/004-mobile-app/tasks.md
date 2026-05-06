# Tasks: Mobile App Implementation

## Phase 1: Setup & Foundations
- [x] T001 - Initialize Expo project in `/mobile` with TypeScript
- [x] T002 - Configure NativeWind and Tailwind theme for "Apple Notes" aesthetic
- [x] T003 - Generate TypeScript types from root `openapi.yaml`
- [x] T004 - Set up Axios client with base URL configuration for local network

## Phase 2: Authentication & Settings
- [x] T005 - Implement `SecureStore` service for JWT and Encryption keys
- [x] T006 - Build Connection Settings screen (Set local IP/Port)
- [x] T007 - Implement Login and Register screens
- [x] T008 - Implement Auth Guard for protected routes

## Phase 3: Organization & Navigation
- [x] T009 - Build hierarchical Folder navigation list
- [x] T010 - Build polymorphic Entry list (Notes & Tasks)
- [x] T011 - Implement filtering by Tags and Folders
- [x] T012 - Implement search functionality using the `q` query parameter

## Phase 4: Rich Text & Media
- [x] T013 - Integrate Rich Text editor component
- [ ] T014 - Implement image insertion from camera/gallery
- [ ] T015 - Implement drawing/sketching component
- [x] T016 - Add autosave and versioning display

## Phase 5: Kanban Workflow
- [x] T017 - Implement horizontal-scrolling Kanban view
- [x] T018 - Implement drag-and-drop logic for moving tasks between columns
- [x] T019 - Build Task detail editor (Priority, Due Date)

## Phase 6: Encryption & Security
- [x] T020 - Implement client-side AES-256 encryption logic (`expo-crypto`)
- [x] T021 - Build decryption prompt for protected items
- [ ] T022 - Implement cascading folder protection UI

## Phase 7: Polish & Launch
- [x] T023 - Add haptic feedback for Kanban movements
- [x] T024 - Implement offline-caching with TanStack Query
- [x] T025 - Final UI/UX audit against Apple Notes benchmarks
