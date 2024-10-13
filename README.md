

# Truth Table Generator

This project is a **Truth Table Generator** that allows users to input logical expressions and generate corresponding truth tables. The project is built using Vue.js and ANTLR for parsing the logical expressions.

## Features

- Input logical expressions using common operators like AND (⋀), OR (⋁), NOT (¬), etc.
- Supports complex logical expressions with parentheses.
- Generates a complete truth table for any valid expression.
- Displays the expression in both Disjunctive Normal Form (DNF) and Conjunctive Normal Form (CNF).
- Interactive user interface with draggable input button groups for ease of use.

## Technologies Used

- **Vue.js**: Frontend framework for building user interfaces.
- **ANTLR 4.9.2**: For generating the lexer and parser for logical expressions.
- **TypeScript**: Typed superset of JavaScript for building safer and scalable applications.
- **Vite**: A fast build tool for modern web projects.
- **Tailwind CSS / Windi CSS**: Utility-first CSS framework for styling.
- **Vue I18n**: For internationalization support (English and Simplified Chinese).

## Project Setup

### Prerequisites

- **Node.js**: Make sure you have Node.js installed (version 12.x or later).
- **ANTLR 4.9.2**: Ensure that you have ANTLR installed and properly configured.

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/username/truth-table-generator.git
    cd truth-table-generator
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Generate the ANTLR parser** (if necessary):
    ```bash
    java -jar C:/My/software/antlr4-4.9.2/antlr-4.9.2-complete.jar -Dlanguage=JavaScript src/utils/Logic.g4
    ```

4. **Start the development server**:
    ```bash
    npm run dev
    ```

    The app will be running at `http://localhost:3000`.

### Build for Production

To build the project for production:

```bash
npm run build
```

The optimized files will be located in the `dist` directory.

### Linting

To run the linter:

```bash
npm run lint
```

## File Structure

```plaintext
├── public/                     # Public assets
├── src/                        # Main source files
│   ├── components/             # Vue components
│   ├── locales/                # Localization files
│   ├── pages/                  # Main pages
│   ├── utils/                  # Utility functions, including ANTLR files
│   └── styles/                 # Base CSS styles
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── vite.config.ts              # Vite configuration
├── package.json                # Project dependencies and scripts
├── README.md                   # Project readme (this file)
└── yarn.lock / package-lock.json # Lock file for dependencies
```

## Logical Operators Supported

The following logical operators are supported in the input expressions:

- **NOT (¬)**: Negation
- **AND (⋀)**: Conjunction
- **OR (⋁)**: Disjunction
- **IMPLIES (→)**: Implication
- **EQUIVALENT (⇔)**: Equivalence
- **XOR (⊕)**: Exclusive OR
- **XNOR (≡)**: Exclusive NOR

## Example Usage

Input the following logical expression in the input box:

```plaintext
(A ⋀ B) → (¬C ⋁ D)
```

This will generate the truth table for the given expression.