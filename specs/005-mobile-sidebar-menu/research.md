# Research: Drawer & Styling Setup

## Objective
Confirm technical feasibility and dependency compatibility for `expo-drawer`, `tamagui`, and `gluestack-ui` within the existing project structure.

## Drawer Navigation with Expo Router
- **Compatibility**: `expo-router` supports Drawer navigation via `@react-navigation/drawer`.
- **Implementation**: Move the root layout to use a Drawer navigator instead of just a Stack.
- **Header Management**: Headers will now be managed by the Drawer or nested Stacks.

## Styling & UI Libraries
- **Tamagui**: Requires a config file and a compiler setup in `metro.config.js` or `babel.config.js`. Need to check if it conflicts with existing CSS (Tailwind was mentioned in file structure but user prefers Tamagui/Gluestack).
- **Gluestack UI**: Provides accessible components. Can coexist with Tamagui but might increase bundle size.
- **Lucide Icons**: Already used in `index.tsx`.

## Backend Soft Delete
- **Models**: Add `is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)` to the `Entry` model in `models.py`.
- **CRUD**: Update `get_entries` to filter by `is_deleted=False` by default.
- **API**: Add a `DELETE /entries/{id}/trash` or update `DELETE` behavior. Add `GET /entries/trash`.

## Verification Steps
1. Install dependencies in `mobile/`.
2. Create a basic Drawer layout.
3. Test a Tamagui styled component.
4. Run a backend migration (manual SQLite update or script).
