# CampusMind — College RAG Assistant

A full-stack Retrieval-Augmented Generation (RAG) assistant for college documents, timetables, exam notices, attendance rules, scholarships, and fee guidelines.

---

## 🚀 Deployment Options

### Option 1: Direct 1-Click Deployment in Google AI Studio (Instant)

Your application is already hosted in the Google AI Studio Cloud Run environment!

1. Look at the top right of your screen in **Google AI Studio**.
2. Click the **Deploy** / **Share** button.
3. This generates your live public **Shared App URL**:
   - `https://ais-pre-ocx73f6hrxpjbjotsj3yks-850678896324.asia-southeast1.run.app`
4. Anyone with this link can interact with CampusMind immediately. AI Studio automatically manages the `GEMINI_API_KEY` and server lifecycle.

---

### Option 2: Docker / Google Cloud Run / AWS / VPS Deployment

If you want to host CampusMind on your own cloud infrastructure:

#### 1. Dockerfile
Create a `Dockerfile` in the root:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Build Vite frontend bundle
RUN npm run build

# Expose port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "run", "start"]
```

#### 2. Build and Run Container
```bash
# Build Docker image
docker build -t campusmind-rag .

# Run with your Gemini API Key
docker run -p 3000:3000 -e GEMINI_API_KEY="your_api_key_here" campusmind-rag
```

#### 3. Deploy to Google Cloud Run directly from CLI:
```bash
gcloud run deploy campusmind-rag \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your_gemini_api_key"
```

---

### Option 3: Deploy to Render / Railway / DigitalOcean

1. Push this repository to **GitHub**.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
3. Connect your GitHub repository.
4. Set the Build and Start commands:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google AI Studio API Key from https://aistudio.google.com/app/apikey)*
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
6. Click **Deploy**.

---

### Option 4: Local Production Run

```bash
# 1. Install dependencies
npm install

# 2. Build frontend assets
npm run build

# 3. Start full-stack Express server
npm run start
```
The server will start on `http://localhost:3000`.
