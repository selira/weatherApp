# Vue 3 + Vite Weather App

This is a simple weather application built with Vue 3 and Vite.

## Prerequisites

-   [Node.js](https://nodejs.org/) (which includes npm)

## Installation & Setup

1.  **Clone the repository.**

2.  **Navigate to the project directory:**
    ```bash
    cd path/to/your/weatherApp
    ```

3.  **Install dependencies:**
    This command will download and install all the necessary packages defined in `package.json`.
    ```bash
    npm install
    ```

4.  **Set up your Environment Variables:**
    This project requires an API key from [OpenWeatherMap](https://openweathermap.org/api) to fetch weather data.
    *   Create a new file named `.env` in the root of your project directory.
    *   Add your OpenWeatherMap API key to this file in the following format:

        ```env
        VITE_API_KEY=your_actual_api_key_here
        ```
        Replace `your_actual_api_key_here` with the API key you obtained from OpenWeatherMap.
        **Important:** Vite exposes environment variables prefixed with `VITE_` to your client-side code.

5.  **Run the development server:**
    This command starts the Vite development server, usually on `http://localhost:5173`.
    ```bash
    npm run dev
    ```
    Open your browser and navigate to the provided local URL to see the application running. The server will automatically reload if you make changes to the code.