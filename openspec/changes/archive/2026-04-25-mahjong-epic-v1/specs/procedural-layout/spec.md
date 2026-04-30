# Procedural Layout Specification

## Purpose

Generate Mahjong board layouts dynamically with configurable difficulty — using seeded PRNG for reproducibility. Each level creates solvable boards with matching pairs.

## Requirements

### Requirement: Level Generation Parameters

The system MUST generate board layouts with controllable parameters: tile count (36-144), layer count (1-3), and symbol variety (9-34 unique symbols per level).

#### Scenario: Level 1 Easy Generation

- GIVEN difficulty "easy"
- WHEN generating new board
- THEN tile count is 36-48
- AND layer count is 1-2
- AND symbol variety is 9-12 unique symbols

#### Scenario: Level Medium Generation

- GIVEN difficulty "medium"
- WHEN generating new board
- THEN tile count is 48-72
- AND layer count is 2
- AND symbol variety is 12-18 unique symbols

#### Scenario: Level Hard Generation

- GIVEN difficulty "hard"
- WHEN generating new board
- THEN tile count is 72-144
- AND layer count is 2-3
- AND symbol variety is 18-34 unique symbols

### Requirement: Paired Symbol Distribution

The system MUST place tiles in pairs — each symbol MUST appear exactly 2 times on the board. Total tile count SHALL always be even.

#### Scenario: Even Tile Count

- GIVEN symbol variety of 12 unique symbols
- WHEN placing tiles
- THEN total tile count is 24 (12 × 2)
- AND all 24 tiles have matching pairs

#### Scenario: Valid Pair Exists

- GIVEN generated board with 48 tiles
- WHEN checking for pairs
- THEN at least one valid pair of unlocked tiles exists
- OR board is regenerated with new seed

### Requirement: Solvability Verification

The system SHOULD verify the generated board is solvable before presenting it to the player. If unsolvable, the system SHALL regenerate with a new seed.

#### Scenario: Solvable Board Accepted

- GIVEN generated board layout
- WHEN running solvability check (BFS)
- THEN solvable paths exist
- AND board is presented to player

#### Scenario: Unsolvable Board Regenerated

- GIVEN generated board layout
- WHEN running solvability check
- THEN NO solvable paths exist
- AND board is regenerated with new seed
- AND this repeats up to 3 times before fallback

### Requirement: Seeded Reproducibility

The system SHALL use seeded PRNG so that same seed produces identical layout for level replay/retry.

#### Scenario: Same Seed Same Layout

- GIVEN seed "level-1-easy" produces layout L1
- WHEN regenerating with same seed
- THEN layout L1 is identical to first generation