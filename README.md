# DSA Tracker

A full-stack web application to track and manage Data Structures & Algorithms (DSA) questions for interview preparation.

## 🚀 Features

- Track DSA questions by topic and difficulty
- Monitor revision progress
- User authentication
- Personalized settings
- Clean and intuitive UI

## 🧠 Spaced Repetition & Scientific Revision Strategy

<p align="center">
  <img src="https://github.com/user-attachments/assets/282a32bd-344a-409f-82a1-490241516576" />
</p>



DSA Tracker uses **Spaced Repetition**, a scientifically proven learning technique that maximizes knowledge retention and minimizes forgetting.

### How Spaced Repetition Works

Research shows that reviewing material at optimal intervals significantly improves long-term memory retention. Instead of cramming everything at once, spaced repetition spreads reviews over time to keep information in your active memory.

### Example: Revision Pattern (1, 3, 7, 14, 21 days)

Let's say you solve your first DSA question on **Day 0**:

| Timeline | Action | Why It Works |
|----------|--------|--------------|
| **Day 0** | 🎯 Solve a new DSA question | Knowledge acquisition - problem freshly learned |
| **Day 1** | 📝 Reminder: Revise the question | Review before forgetting - reinforces neural pathways |
| **Day 3** | 📝 Reminder: Revise again | Spaced interval - prevents memory decay |
| **Day 7** | 📝 Reminder: Revise again | Increasing intervals - long-term memory formation |
| **Day 14** | 📝 Reminder: Revise again | Extended spacing - ensures retention |
| **Day 21** | 📝 Reminder: Final revision | Mastery achieved - knowledge locked in memory |

### Why This Works

1. **Combats Forgetting Curve**: We forget ~50% of new information within 24 hours. Timely reviews counteract this.
2. **Strengthens Memory**: Each review strengthens neural connections, making recall faster and more reliable.
3. **Builds Muscle Memory**: Repeated practice on the same problem at intervals helps you internalize problem-solving patterns.
4. **Optimizes Study Time**: By reviewing at the right times, you avoid unnecessary repetition while ensuring retention.

### Customizable Reminder Patterns

DSA Tracker allows you to customize your revision pattern based on your learning pace:
- **Aggressive**: 1, 2, 4, 7, 14 (for intensive learning)
- **Balanced**: 1, 3, 7, 14, 21 (recommended)
- **Relaxed**: 1, 5, 10, 20, 30 (for slower-paced learning)

**Pro Tip**: Start with the balanced pattern and adjust based on your comfort level with DSA concepts.

##  Screenshots

### Dashboard
<img width="914" height="736" alt="image" src="https://github.com/user-attachments/assets/aa6aec7f-b8ec-43ef-8690-a32e5c23fd93" />

*Main dashboard showing all tracked DSA questions and statistics*

### Add Question
<img width="900" height="596" alt="image" src="https://github.com/user-attachments/assets/c79e030a-4f53-4057-b1e8-6e823cf72b7a" />
*Easy-to-use form to add new DSA questions with details and solutions*

### Question Details
<img width="929" height="717" alt="image" src="https://github.com/user-attachments/assets/84f063b3-e28f-4952-b731-50ea1a2c658c" />
*View detailed information about a question with revision schedule*

### Setting 
<img width="875" height="818" alt="image" src="https://github.com/user-attachments/assets/6dae2d0e-89a2-429e-a6c7-719e75e991a4" />
*Here you can , change your revision patter*

### User Profile
<img width="912" height="748" alt="image" src="https://github.com/user-attachments/assets/578b2733-6125-4cfe-b7d4-fdb0be2b83a3" />
*Manage your profile and customize revision patterns*


## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Git**
- **MongoDB Atlas account** (for database)

## 🔧 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/ankit23-exe/DSA-Tracker.git
cd DSA-Tracker
```

### Step 2: Setup Backend

#### Navigate to Backend folder:
```bash
cd Backend
```

#### Install dependencies:
```bash
npm i
```

#### Create `.env` file:
Create a new file named `.env` in the Backend folder and add the value as shown in the .env.example


#### Get MongoDB Atlas URL:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" and copy the connection string
5. Replace `your_mongodb_atlas_url_here` with your actual MongoDB connection string
6. Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dsa-tracker?retryWrites=true&w=majority`

#### Start the Backend:
```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
 Server is running on port 5000
 API URL: http://localhost:5000
 Health check: http://localhost:5000/api/health
```

### Step 3: Setup Frontend

#### Open a new terminal and navigate to Frontend folder:
```bash
cd frontend
```

#### Install dependencies:
```bash
npm i
```

#### Create `.env` file:
Create a new file named `.env` in the frontend folder and add:

```
VITE_API_URL=http://localhost:5000/api
```

#### Start the Frontend:
```bash
npm run dev
```

You should see output showing the local development server URL (typically `http://localhost:5173`)

### Step 4: Test the Application

1. Open your browser and go to the URL shown in the terminal (usually `http://localhost:5173`)
2. Create an account or login
3. Start tracking your DSA questions!

## ✅ Verification

- **Backend Health Check**: Visit `http://localhost:5000/api/health`
- **API Endpoints**: 
  - Auth: `http://localhost:5000/api/auth`
  - Questions: `http://localhost:5000/api/questions`
  - Revisions: `http://localhost:5000/api/revisions`
  - Settings: `http://localhost:5000/api/settings`

## 📁 Project Structure

```
DSA-Tracker/
├── Backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 is already in use, change the `PORT` in your Backend `.env` file and update `VITE_API_URL` accordingly.

### MongoDB Connection Error
- Verify your MongoDB connection string is correct
- Check your MongoDB Atlas IP whitelist settings (add your IP)
- Ensure your username and password are correct

### Frontend can't connect to Backend
- Verify the `VITE_API_URL` in frontend `.env` matches your backend URL
- Check if the backend is running on the correct port
- Ensure CORS is enabled on the backend



## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dsa-tracker` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

I **LOVE** contributions! This project is open source and welcomes contributions from everyone. Whether you're fixing bugs, adding features, improving documentation, or just using the app and sharing feedback, your contribution matters!

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes** and commit them (`git commit -m 'Add AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request** and describe your changes

### Ideas for Contributions

- 🐛 **Bug Fixes**: Found a bug? Help us squash it!
- ✨ **New Features**: Have ideas to improve DSA Tracker? We'd love to hear them!
- 📚 **Documentation**: Help improve our README, guides, or comments
- 🎨 **UI/UX Improvements**: Make the interface more beautiful and user-friendly
- 🧪 **Testing**: Write tests to ensure the app works flawlessly
- 🌍 **Localization**: Help translate the app to other languages

### Code of Conduct

Please be respectful and constructive in all interactions. We're building this together as a community!

**Questions about contributing?** Reach out to me on [Twitter](https://x.com/Ankit23_exe) or [Email](mailto:ankit23sep@gmail.com) - I'd be happy to help!

Thank you for making DSA Tracker better! ❤️


**Happy coding! 🚀 Good luck with your DSA preparation!**
