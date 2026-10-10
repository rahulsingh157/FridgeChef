# 🥗 FridgeChef — AI-Powered Fridge Meal Planner

**Turn the ingredients in your fridge into delicious meal ideas!**

FridgeChef is a full-stack web application that helps users discover recipes based on the ingredients they already have. Users can upload a picture of their fridge, review detected ingredients, manage their pantry, and generate personalized meal suggestions using AI.

## ✨ Features

- 📸 **AI Fridge Scanning:** Upload a fridge image to identify available ingredients using AI vision.
- 🥕 **Pantry Management:** Review detected ingredients, edit the list, and add ingredients manually.
- 🍳 **AI-Powered Recipes:** Generate meal suggestions based on available pantry ingredients.
- 👤 **User Authentication:** Register and log in to access your account.
- 🛒 **Shopping List:** Manage ingredients you need to buy.
- 📱 **Responsive Interface:** A modern interface designed for convenient use across screen sizes.
- 🔄 **Dynamic Suggestions:** Request new meal ideas based on your available ingredients.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend development |
| JavaScript | Application logic |
| CSS | Styling and responsive UI |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | Database modeling |
| JWT | Authentication |
| Multer | Image upload handling |
| Groq API | AI-powered image analysis and recipe generation |

## 🏗️ Project Structure

```text
AI-Fridge-Meal-Planner/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── scratch/
│   ├── seedRecipes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

Follow these steps to run FridgeChef locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas database
- A [Groq API key](https://console.groq.com/) for AI functionality

### 1. Clone the repository

```bash
git clone https://github.com/rahulsingh157/FridgeChef.git
cd FridgeChef
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory and configure the environment variables required by your application.

Example:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GROQ_API_KEY=your_groq_api_key
```

Use the exact environment variable names expected by your backend code. Keep your actual `.env` file private.

Start the backend:

```bash
npm start
```

If your `backend/package.json` does not define a start script, use the appropriate script from that file or run:

```bash
node server.js
```

### 3. Set up the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local frontend URL in the terminal, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

**Note:** Configure the frontend API base URL to point to your running backend. The backend must also be configured with the correct CORS settings.

## 🔐 Environment Variables

Never commit real API keys, database credentials, or JWT secrets to GitHub.

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `GROQ_API_KEY` | API key for AI services |
| `PORT` | Backend server port |

Variable names and defaults should match the actual backend configuration.

## 🧠 How It Works

1. **Upload:** The user uploads a picture of their fridge.
2. **Analyze:** The backend sends the image to the AI vision service.
3. **Review:** The user reviews and modifies the detected ingredients.
4. **Save:** The confirmed pantry is associated with the authenticated user.
5. **Generate:** The recipe service requests meal suggestions based on the pantry.
6. **Discover:** The user explores recipes and manages their shopping list.

AI responses depend on API availability, configured credentials, and service limits.

## 🔮 Future Improvements

- More accurate ingredient recognition
- Dietary preferences and allergy-aware suggestions
- Recipe filtering by preparation time and difficulty
- Nutritional information and calorie estimates
- Recipe favorites and meal planning
- Production deployment and automated testing

## 👨‍💻 Author

**Rahul Singh**

- GitHub: [@rahulsingh157](https://github.com/rahulsingh157)
- Project Repository: [FridgeChef](https://github.com/rahulsingh157/FridgeChef)

---

If you find this project interesting, consider giving the repository a ⭐ on GitHub!

*Built to make everyday cooking smarter, simpler, and more creative.*