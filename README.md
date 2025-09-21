
# ⚖️ LegalAI  

LegalAI is an **AI-powered assistant** that helps analyze, summarize, and answer questions from **legal documents**.  
It combines **domain-specific embeddings (InLegalBERT)** with **LLMs (Google Gemini)** and **semantic search (FAISS)** to make legal text easy to search, understand, and use.  

---

## 🔍 Overview  

Legal documents are long, complex, and time-consuming to review.  
**LegalAI** solves this by:  
- Extracting and chunking text from uploaded documents  
- Generating embeddings for semantic search  
- Summarizing key points with LLMs  
- Providing direct answers to user queries  

This makes it useful for **lawyers, students, and professionals** who need faster insights into contracts, policies, and case files.  

---

## 🚀 Features  

- 📂 Upload **legal PDFs or documents**  
- ✨ Automatic text extraction & chunking  
- 🔎 **Semantic search** with FAISS & InLegalBERT  
- 🤖 **Summaries and Q&A** powered by Gemini + Hugging Face  
- 🌐 Modern chat-style frontend with file upload support  
- 💻 Works in both **offline (FAISS)** and **cloud-enabled** modes  

---

## 🛠️ Tech Stack  

**Frontend**  
- React / Next.js  
- Tailwind CSS + shadcn/ui  

**Backend**  
- Node.js + Express  
- Faiss (Vector DB)  
- MongoDB  

**AI/ML**  
- Google Gemini (summarization & QnA)  
- Hugging Face (InLegalBERT for embeddings)  

**Other Tools**  
- Postman (API testing)  
- Git & GitHub (version control)  

---

## 📂 Project Structure  

```bash
LegalAI/
│── backend/            # API routes, embeddings, text processing
│── frontend/           # React/Next.js UI
│── Microservice/       # Gemini, embeddings, Hugging Face models
│── test_integration.js # Static files
│── .env.example        # Example environment variables
│── README.md           # Main documentation
````


---

## ⚡ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/LegalAI.git
cd LegalAI
```

### 2️⃣ Install dependencies

#### Backend

```bash
cd Backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

#### Microservice (Python)

```bash
cd Microservice
pip install -r requirements.txt
```

### 3️⃣ Setup environment variables

Create a `.env` file inside `backend/` with:

```env
PORT=5000
MONGO_URI=your-mongodb-uri
GEMINI_API_KEY=your-gemini-key
HF_API_KEY=your-huggingface-key
```

### 4️⃣ Run the app

Backend

```bash
cd Backend
npm start
```

Frontend

```bash
cd frontend
npm run dev
```

Microservice

```bash
cd ai-service
python app.py
```

Now open [http://localhost:5000](http://localhost:8000) 🎉

---

## 📖 Usage

1. **Upload** a legal document (PDF/DOC).
2. Backend extracts and **splits text into chunks**.
3. System generates embeddings and stores them in FAISS.
4. User asks questions via chat UI.
5. Relevant chunks retrieved → Gemini summarizes → provides answer.

---

## 📊 Process Flow

```
User → Frontend (Upload / Ask) → Backend (API) → 
Text Extraction → Embeddings (Hugging Face / InLegalBERT) → 
FAISS Vector DB → Query → Gemini (Summarization/QnA) → 
Answer → Frontend
```

---

## 🤝 Contribution

We welcome contributions!

1. Fork the repo
2. Create a new branch (`feature-xyz`)
3. Commit your changes
4. Push & open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🙌 Acknowledgements

* [Google Gemini](https://ai.google)
* [Hugging Face](https://huggingface.co)
* [FAISS](https://github.com/facebookresearch/faiss)

---

```
