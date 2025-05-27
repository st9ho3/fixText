# Text Editor (fixText)

This project is a React-based web application that utilizes the Google Generative AI (Gemini) to help users edit and reformat their text. Users can input text and then choose to either generate a well-structured academic paragraph or outline the main points of the provided text.

## Features

* **Text Input**: Allows users to enter or paste text they want to work with.
* **Create Paragraph**: Leverages AI to reconstruct the input text into a single, cohesive, and academically-toned paragraph in Greek.
* **Outline Main Points**: Uses AI to analyze the input Greek text and extract its main points, presenting them as a numbered list.
* **Display Response**: Shows the AI-generated text.
* **Copy to Clipboard**: Allows users to easily copy the generated response.
* **Local Storage**: Saves the last entered text for persistence.
* **Loading and Error States**: Provides feedback to the user during API calls and if any errors occur.

## Technologies Used

* **React**: A JavaScript library for building user interfaces.
* **Vite**: A fast build tool and development server for modern web projects.
* **Google Generative AI (Gemini 2.0 Flash)**: The AI model used for text generation and manipulation.
* **JavaScript (ESModules)**
* **CSS**: For styling the application.

## Usage

-> [Visit Here](https://txet.netlify.app)

After setup, you can run the application using the scripts defined in `package.json`.

1.  Enter your text into the input field.
2.  Click "Enter Text" to submit your text. This will also store the text for the AI processing.
3.  Click either "Create paragraph" or "Outline main points" to send the text to the AI for processing.
4.  The AI's response will be displayed below the input form.
5.  You can click "Copy Text" to copy the AI-generated response to your clipboard.

## Scripts

The following scripts are available in the `package.json` file:

* `npm run dev`: Starts the development server using Vite.
* `npm run build`: Builds the application for production using Vite.
* `npm run lint`: Lints the project files using ESLint.
* `npm run preview`: Serves the production build locally for preview.

## Project Structure Overview

* `public/`: Contains static assets like `1.png` (favicon).
* `src/`: Contains the main application code.
    * `App.jsx`: The main React component that handles the application logic, state, and UI.
    * `App.css`: Styles for the `App` component.
    * `main.jsx`: The entry point of the React application.
    * `index.css`: Global styles.
    * `ProgressiveRenderer.jsx`: A component to display text with a progressive (typing) effect.
    * `prompt.js`: Contains functions to build the prompts sent to the Google Generative AI model for different tasks (`createParagraph`, `outlineMainPoints`).
* `index.html`: The main HTML file for the Vite project.
* `vite.config.js`: Configuration file for Vite.
* `eslint.config.js`: Configuration file for ESLint.
* `package.json`: Lists project dependencies and scripts.
* `package-lock.json`: Records the exact versions of dependencies.
* `README.md`: (This file) Provides information about the project.
