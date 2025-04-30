# SchedEx: AI-Powered Viva Scheduling System

![Logo](https://github.com/user-attachments/assets/8cb31cf8-faff-4524-98d6-34c2d7d424f7)

*An intelligent scheduling system for academic institutions*

## 🚀 Overview
SchedEx automates viva examinations scheduling using **AI/NLP**, ensuring fairness and efficiency for students, examiners, and administrators. Key features include:
- **Role-based dashboards** (Student/Examiner/Admin)  
- **NLP-powered rescheduling** (e.g., "Move my viva to Monday 10 AM")  
- **Conflict resolution** with AI suggestions  
- **Real-time notifications** (SMS/Email)  
- **Automated reporting**


## 🔧 Technologies
### Frontend
| Tech | Usage |
|------|-------|
| React.js | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Syncfusion React Schedule | Calendar Dashboard |
| React Chat Widget | AI Chat Interface |

### Backend
| Tech | Usage |
|------|-------|
| Node.js | Runtime |
| Express.js | API Framework |
| MongoDB | Database |
| Mongoose | ODM |
| LangChain + Deepseek API | NLP Processing |
| NextAuth.js | Authentication |
| Twilio | SMS/Email Notifications |

## 📂 Project Structure
```bash
sched-ex/
├── backend/ # Backend server
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API endpoints
│ ├── controllers/ # Business logic
│ ├── server.js # Express server
│ └── .env # Environment variables
│
├── frontend/ # React application
│ ├── public/ # Static assets
│ ├── src/
│ │ ├── components/ # Reusable UI
│ │ ├── pages/ # Role-specific views
│ │ ├── App.jsx # Main app
│ │ └── index.css # Tailwind imports
│ └── vite.config.js # Vite config
│
├── .gitignore # Ignored files
└── README.md # This file
```


## 🛠️ Setup Guide
### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Twilio account (for notifications)
- Deepseek API key (for NLP)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sched-ex.git
   cd sched-ex
   ```
2. **Set up backend**

3. **Set up frontend**
  ```bash
  cd ../frontend
  npm install
  cp .env.example .env  # Add VITE_API_BASE_URL
  ```
4. **Run the system**

Backend:
```bash
cd ../backend
npm start  # Production
npm run dev  # Development (nodemon)
```

Frontend:
```bash
cd ../frontend
npm run dev
```
🌐 **API Endpoints**
Endpoint	Method	Description

/api/auth/login	POST	User login
/api/students/reschedule	POST	Submit reschedule request
/api/examiners/availability	POST	Set examiner slots
/api/admin/reports	GET	Generate PDF/Excel reports
/api/chatbot	POST	Process NLP queries

🤖 **AI Chatbot Flow**
![deepseek_mermaid_20250430_0147c6](https://github.com/user-attachments/assets/448a55e0-e9db-424d-98a1-f4b5e2de1393)



