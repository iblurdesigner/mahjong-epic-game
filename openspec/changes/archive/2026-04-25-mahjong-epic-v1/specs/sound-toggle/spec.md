# Sound Toggle Specification

## Purpose

Global mute control persisted to device storage. Music plays during gameplay when enabled.

## Requirements

### Requirement: Sound Toggle Control

The system MUST provide a toggle in Settings to enable or disable background music. Sound MUST default to "on" on first launch.

#### Scenario: Sound Default On

- GIVEN first app launch (no stored preference)
- WHEN App starts
- THEN sound is enabled by default
- AND music begins playing on Home screen

#### Scenario: Sound Toggle Off

- GIVEN sound is enabled
- WHEN player toggles sound OFF in Settings
- THEN music stops immediately
- AND preference is persisted to storage

#### Scenario: Sound Toggle On

- GIVEN sound is disabled
- WHEN player toggles sound ON in Settings
- THEN music begins playing
- AND preference is persisted to storage

### Requirement: Sound Persistence

The system SHALL persist the sound preference to local storage. On app restart, the stored preference MUST be restored.

#### Scenario: Preference Persists

- GIVEN sound is disabled in Settings
- WHEN player closes and reopens app
- THEN sound remains disabled
- AND no music plays

### Requirement: Sound Setting UI

The system MUST display a switch/checkbox in Settings screen with clear label. Toggle SHALL have 64px minimum touch target.

#### Scenario: Settings Sound Toggle

- GIVEN player navigates to Settings
- THEN "Música" label displays with toggle switch
- AND toggle switch is at least 64px tall