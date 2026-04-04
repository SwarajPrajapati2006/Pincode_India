# PinCode India 📌

PinCode India is a modern, enterprise-grade Full-Stack MERN portal providing lightning-fast access to India's complete postal directory. The platform allows users to explore over 154,000+ Indian pincode records via cascaded geographic filtering, intelligent search, and paginated data tables.

## 🚀 Features
- **Comprehensive Database**: Fully indexed MongoDB Atlas cluster with customized normalization to ensure pristine postal mapping.
- **Dynamic Exploration**: Advanced cascaded filtering system (State → District → Taluk).
- **Debounced Search**: Lightning-fast predictive text search across Pincodes, Office Names, and Districts.
- **Analytical Dashboard**: Modern "Subtle Saffron Dark Theme" UI featuring responsive Bar and Pie charts (via Recharts).
- **Data Export**: One-click CSV export logic from the backend aggregation pipeline.
- **Fully Responsive**: Mobile-first architecture with glassmorphic navbar and premium card components.

## 💻 Tech Stack
**Frontend:**
- React.js 18
- Vite
- Tailwind CSS (v4)
- React Router v6
- Recharts
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas & Mongoose
- CORS & dotenv

## 🛠️ Run Locally 

### 1. Clone the repository
```bash
git clone https://github.com/SwarajPrajapati2006/Pincode_India.git
cd Pincode_India
```

### 2. Set up Backend
- Install dependencies:
```bash
npm install
```
- Create a `.env` file in the root directory and add your MongoDB connection string:
```env
MONGODB_URI=your_mongo_db_connection_string
PORT=3000
```
- Start the server:
```bash
node index.js
```

### 3. Set up Frontend
- Open a new terminal and navigate to the client folder:
```bash
cd client
npm install
```
- Start the Vite development server:
```bash
npm run dev
```

## 🌐 Deployment Ready
- The backend is optimized for deployment on platforms like Render.com.
- The frontend dynamically listens to `import.meta.env.VITE_API_URL` for seamless Vercel/Netlify hosting.

---
*Built with React & Node.js*
