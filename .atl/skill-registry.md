# Skill Registry - Mahjong Epic

## Project Skills

This file documents the available skills for the Mahjong Epic project.

## Project Configuration

| Setting | Value |
|---------|-------|
| Stack | React Native 0.76.5 + Expo SDK 52 |
| Target | iPadOS |
| Artifacts | Hybrid (engram + openspec) |
| TDD | Strict mode enabled |

## Testing

- Test Runner: Jest 29.x + jest-expo
- Command: `npm test`
- Coverage: `npm test -- --coverage`

## Build

- Expo: `npx expo start`
- iOS: `npx expo start --ios`
- Android: `npx expo start --android`

## Quality

- Lint: `npm run lint`
- Type Check: `tsc --noEmit`