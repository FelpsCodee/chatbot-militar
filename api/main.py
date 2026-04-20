from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq 
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("GROQ_API_KEY")
SYSTEM_PROMPT = os.getenv("SYSTEM_PROMPT")

client = Groq(api_key=API_KEY)

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.join(current_dir, "..")
class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    
    index_path = os.path.join(root_dir, "index.html")
    return FileResponse(index_path)


@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:

      response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": request.message}
        ],
        temperature=0.7
        )

      return {"response": response.choices[0].message.content}

    except Exception as e:
          print(f"ERRO CRÍTICO NA OPERAÇÃO: {e}")
          raise HTTPException(status_code=500, detail=str(e))
      
app.mount("/", StaticFiles(directory=root_dir, html=True), name="static")