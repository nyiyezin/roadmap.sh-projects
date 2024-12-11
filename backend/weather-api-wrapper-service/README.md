# Weather API Wrapper Service

Solution for the [weather-api-wrapper-service](https://roadmap.sh/projects/weather-api-wrapper-service)

## Requirements

To run this service, ensure you have the following installed on your computer

- **Node.js** (v16 or later)
- **Redis**
- **Git**

## Setup Instructions

Follow the steps below to set up and run the service locally

### 1. Clone the repository

```bash
git clone https://github.com/nyiyezin/roadmap.sh-projects
cd backend/weather-api-wrapper-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a new .env file in the project directory and add the following variables

```env
PORT=3000
API_KEY=your_weather_api_key
```

Replace `your_weather_api_key_here` with your actual API key from the [Visual Crossing Weather API](https://www.visualcrossing.com/).

### 4. Start redis server

```bash
redis-server
```

### 5. Run the Application

```bash
node index.js
```

## Usage

Once the application is running, you can access the weather data API by visiting:

```
https://localhost:3000/weather?city=your_city
```

Replace `your_city` with the desired city name (e.g., `yangon`).
