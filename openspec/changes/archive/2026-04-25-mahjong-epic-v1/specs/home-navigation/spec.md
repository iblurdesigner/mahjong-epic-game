# Home Navigation Specification

## Purpose

Entry point routing between Home, Game, Levels, and Settings screens. iPad-optimized navigation with large touch targets.

## Requirements

### Requirement: Home Screen Buttons

The system MUST display "JUGAR" and "AJUSTES" buttons on Home screen. Buttons SHALL have 64px minimum height, 18px+ bold text, using Celestial Jade colors.

#### Scenario: Home Renders Buttons

- GIVEN player opens app
- THEN Home screen displays
- AND "JUGAR" button is visible
- AND "AJUSTES" button is visible

#### Scenario: Play Button Navigation

- GIVEN player taps "JUGAR"
- THEN navigation transitions to Levels or Game screen

#### Scenario: Settings Button Navigation

- GIVEN player taps "AJUSTES"
- THEN navigation transitions to Settings screen

### Requirement: Settings Screen Back

The system MUST provide back navigation from Settings to Home.

#### Scenario: Settings Back Navigation

- GIVEN player is on Settings screen
- AND taps back button or "Volver" button
- THEN returns to Home screen

### Requirement: Levels Screen Navigation

The system MUST display a levels grid. Tapping a level navigates to Game screen with that level's configuration.

#### Scenario: Level Selection

- GIVEN player is on Levels screen
- WHEN player taps level 1
- THEN Game starts with level 1 configuration

#### Scenario: Back to Home from Levels

- GIVEN player is on Levels screen
- AND taps back button
- THEN returns to Home screen

### Requirement: iPad Accessibility Touch Targets

All navigation buttons and interactive elements MUST have 64px minimum touch target size.

#### Scenario: Button Touch Target

- GIVEN any navigation button
- THEN touch area is minimum 64×64 pixels