# n8n_chatbot
# Chatbot with File Upload (n8n + Bolt)

This project is a **Retrieval-Augmented Generation (RAG) chatbot** built using **n8n** for orchestration and **Bolt** for the user interface.  
The chatbot allows users to **send text messages or upload files (e.g., PDFs)**, and then intelligently answers questions using the uploaded content.

---

## 🚀 Features
- ✅ **Chat with AI** – Send text queries and get intelligent responses.  
- ✅ **File Upload Support** – Upload PDF files and interact with their content.  
- ✅ **RAG Pipeline** – Uses embeddings and vector store retrieval for context-aware answers.  
- ✅ **Memory Support** – Maintains conversation history for smooth interaction.  
- ✅ **Webhook Integration** – Connects the UI (Bolt) with the backend workflow (n8n).  

---

## 🖼️ Project Screenshots  

### Chatbot UI (Bolt)  
This is the frontend interface where users can send messages or upload files.  

<img width="1361" height="654" alt="chatbot" src="https://github.com/user-attachments/assets/2a966907-3ea2-4d30-8720-c85a92bd688f" />


---

### Workflow in n8n  
This is the backend workflow that powers the chatbot logic.  

 <img width="871" height="494" alt="image" src="https://github.com/user-attachments/assets/7989083e-5286-4c73-bc21-b1033957b910" /> 

---

## ⚙️ Workflow Explanation  

The workflow is built in **n8n** and triggered via a **Webhook**. Below is the step-by-step flow:  

1. **Webhook Node**  
   - Entry point of the chatbot.  
   - Receives user input (text or file upload) from the Bolt interface.  

2. **Code Node**  
   - Processes input and generates a session ID.  
 

3. **Switch Node**  
   - Routes the workflow based on input type:  
     - 📂 File Upload Path  
     - 💬 Text Query Path  

---

### 📂 File Upload Path
- **Extract from File** → Extracts text from uploaded PDF.  
- **Default Data Loader** → Cleans and formats text.  
- **Recursive Character Text Splitter** → Splits large documents into chunks.  
- **OpenAI Embeddings** → Converts text chunks into embeddings.  
- **Simple Vector Store** → Stores embeddings for retrieval.  
- **Respond to Webhook** → Confirms that the file has been successfully processed.  

---

### 💬 Text Query Path
- **Edit Fields** → Formats the user query.  
- **AI Agent** → Core brain of the chatbot.  
- **OpenAI Chat Model + Simple Memory** → Generates conversational responses and maintains chat history.  
- **Vector Store Retrieval** → Fetches relevant document chunks for context.  
- **Respond to Webhook** → Returns the AI’s answer back to the user.  

---

## 🏗️ System Architecture  

**Frontend (UI):**  
- Built in **Bolt**  
- Provides chat box and file upload option  

**Backend (Workflow):**  
- Built in **n8n**  
- Orchestrates logic for text and file handling  
- Uses OpenAI for embeddings and response generation  

**Storage:**  
- Vector Store (Simple Vector Store in n8n)  
- Stores embeddings for efficient retrieval  


---

## 🔧 How It Works
1. User enters a **text query** or **uploads a file** in the Bolt chatbot.  
2. The request is sent to **n8n workflow** via webhook.  
3. If it’s a **file**, the system extracts text, creates embeddings, and stores them.  
4. If it’s a **text query**, the system fetches relevant chunks from the vector store and generates an AI-powered response.  
5. The final answer is sent back to the chatbot UI.  

---

## 📌 Use Cases
- Customer Support Chatbots  
- Knowledge Base Assistants  
- Document Q&A Systems  
- Research Assistants  

---

## 🛠️ Tech Stack
- **Frontend:** Bolt (Chat UI)  
- **Orchestration:** n8n  
- **AI Models:** OpenAI (Chat & Embeddings)  
- **Vector Database:** Simple Vector Store (inside n8n)  

---

## 🎯 Future Improvements
- Support for multiple file types (DOCX, TXT).  
- Advanced vector store integrations (Pinecone, Weaviate, FAISS).  
- Improved session handling and multi-user support.  

---

## 🙌 Acknowledgements
- [n8n](https://n8n.io/) – Workflow Automation  
- [Bolt](https://bolt.new/) – Chat UI Builder  
- [OpenAI](https://openai.com/) – AI Models  

---




