# Quickstart: UI & Navigation Setup

## Mobile App Setup

### 1. Install Dependencies
Run the following in the `mobile/` directory:
```bash
npm install @react-navigation/drawer react-native-gesture-handler react-native-reanimated
npm install @gluestack-ui/themed @gluestack-style/react
npm install tamagui @tamagui/config
```

### 2. Configure Babel
Add `react-native-reanimated/plugin` to `babel.config.js`.

### 3. Initialize Tamagui & Gluestack
- Create `src/theme/tamagui.config.ts`.
- Wrap the root layout in `GluestackUIProvider` and `TamaguiProvider`.

### 4. Setup Drawer
Update `app/_layout.tsx` to use `Drawer` from `expo-router/drawer`.

## Backend Setup

### 1. Update Database
```bash
sqlite3 database.db "ALTER TABLE entries ADD COLUMN is_deleted BOOLEAN DEFAULT 0;"
```

### 2. Restart Server
```bash
python -m src.app
```
