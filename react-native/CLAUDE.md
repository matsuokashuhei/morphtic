# Morphtic Development Guidelines

## Commands
- `npm start`: Start Expo dev server
- `npm run android`: Start Expo for Android
- `npm run ios`: Start Expo for iOS
- `npm run web`: Start Expo for web
- `npm test`: Run Jest with watch mode
- `npm test -- -t "test name"`: Run specific test
- `npm run lint`: Run Expo linting
- `npx biome check .`: Check code with Biome
- `npx biome format .`: Format code with Biome

## Code Style
- Use TypeScript for type safety; export explicit types for props
- Imports: Use absolute imports with '@/' prefix for project modules
- Formatting: 2 spaces, 80 char line limit, single quotes
- Components: Functional components with named exports
- Props: Pass props with destructuring, use rest pattern for unknown props
- Theming: Use ThemedText/ThemedView with light/dark colors
- Testing: Jest with snapshot testing in __tests__ directories
- Error handling: Use try/catch blocks appropriately
- State management: Redux for global state, React hooks for component state