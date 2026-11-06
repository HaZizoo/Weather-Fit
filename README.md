# 🌤️ Weather-Fit AI 

> A smart, real-time wardrobe assistant that generates dynamic outfit recommendations based on live weather data. 

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## 📱 Project Preview
*(Insert your screenshot or GIF here)*
`![Weather-Fit Demo](./assets/demo.gif)`

## 🚀 Overview
Weather-Fit was built to solve a simple daily problem: figuring out what to wear based on the actual weather. Instead of just showing the temperature, this app fetches real-time meteorological data and feeds it into an advanced Large Language Model (LLM) to generate a practical, stylish outfit recommendation.

### ✨ Key Features
- **Real-Time Weather Data:** Integrated with the OpenWeatherMap API for accurate current conditions, humidity, and wind speed.
- **AI-Powered Wardrobe:** Utilizes the `gpt-oss-120b` model via the Groq API to stream strictly typed JSON outfit recommendations.
- **Resilient UI/UX:** Features independent loading states (skeleton loaders) for the AI generation, graceful error handling, and a fully responsive Tailwind layout.
- **Native Fetch Implementation:** Built without heavy SDK dependencies, utilizing native browser `fetch` for optimal performance.

## 🧠 Developer Log: Challenges & Learnings
As a Computer Science student, I built this project to deepen my understanding of AI-integrated frontend architectures. 
- **Strict JSON Parsing:** One of the main challenges was ensuring the LLM consistently returned a parseable JSON structure instead of conversational text. I solved this by implementing strict system prompting and runtime validation for the expected `message` and `items` keys.
- **Asynchronous Chaining:** Handling the race conditions between the weather API fetching and the subsequent Groq API call required careful React state management. I separated `isLoading` (weather) from `isAiLoading` (LLM) so the user never sees a frozen UI.
- **Testing & Edge Cases:** Spent significant time testing extreme edge cases (e.g., searching for non-existent cities, handling API rate limits, and 401 Unauthorized errors) to ensure the app fails gracefully with user-friendly error messages and retry buttons.

## 🛠️ How to Run Locally

To run this project on your local machine, follow these steps:

**1. Clone the repository**
```bash
git clone [https://github.com/HaZizoo/ai-weather-wardrobe.git](https://github.com/HaZizoo/ai-weather-wardrobe.git)
cd ai-weather-wardrobe

```

**2. Install dependencies**

```bash
npm install

```

**3. Environment Variables**
Create a `.env` file in the root directory and add your API keys:

```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here

```

**4. Start the Development Server**

```bash
npm run dev

```

Navigate to `http://localhost:5173` to view the app.

## 👨‍💻 About the Author

Developed by **Mohamed Aziz Hamdi**

[LinkedIn](https://www.google.com/search?q=https://linkedin.com/in/Mohamed-Aziz-Hamdi) | [GitHub](https://www.google.com/search?q=https://github.com/HaZizoo)
