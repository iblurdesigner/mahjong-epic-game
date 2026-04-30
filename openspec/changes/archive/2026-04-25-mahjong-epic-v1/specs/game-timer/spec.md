# Game Timer Specification

## Purpose

Per-level countdown timer — game ends when timer reaches zero. Timer behavior must handle pause/resume correctly.

## Requirements

### Requirement: Timer Countdown

The system MUST decrease the timer every second. When timer reaches zero, the game state MUST transition to "game over".

#### Scenario: Timer Counts Down

- GIVEN game started with 180 seconds
- WHEN timer updates every second
- THEN timer decrements by 1 each tick
- AND display shows MM:SS format

#### Scenario: Game Over on Timer Expiry

- GIVEN timer at 1 second
- WHEN timer reaches zero
- THEN game enters "game over" state
- AND board becomes read-only
- AND "Game Over" modal displays with score

### Requirement: Timer Duration by Difficulty

The system SHALL set timer duration based on difficulty level — easy levels have more time, hard levels have less per-tile average.

#### Scenario: Easy Timer

- GIVEN difficulty "easy"
- WHEN starting level
- THEN timer is set to 5 minutes (300 seconds)

#### Scenario: Medium Timer

- GIVEN difficulty "medium"
- WHEN starting level
- THEN timer is set to 4 minutes (240 seconds)

#### Scenario: Hard Timer

- GIVEN difficulty "hard"
- WHEN starting level
- THEN timer is set to 3 minutes (180 seconds)

### Requirement: Timer Persistence During Pause

The system MUST NOT decrement timer while game is paused. On resume, timer SHALL continue from where it paused.

#### Scenario: Timer Paused

- GIVEN game with 120 seconds remaining
- WHEN player pauses game
- THEN timer displays as 120 (frozen)
- AND timer does NOT decrement during pause

#### Scenario: Timer Resumed

- GIVEN paused game with 120 seconds
- WHEN player resumes game
- THEN timer resumes counting from 120
- AND timer continues normal countdown