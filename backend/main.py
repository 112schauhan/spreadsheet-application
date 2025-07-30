
from spreadsheet import SpreadsheetService
from fastapi import FastAPI,WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from websocket_handler import ConnectionManager
from comments import CommentService
from history import HistoryService
from csv_handler import csv_router
from auth import router as auth_router

app = FastAPI()

# Configure CORS origins from environment or use defaults
allowed_origins = os.environ.get("ALLOWED_ORIGINS", 
    "http://localhost:3000,http://localhost:5173,https://spreadsheet-application-nine.vercel.app"
).split(",")

# Allow specific origins for production deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(csv_router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth")

manager = ConnectionManager()
comment_service = CommentService()
history_service = HistoryService()
spreadsheet_service = SpreadsheetService()


@app.websocket("/ws/spreadsheet/{sheet_id}")
async def websocket_endpoint(websocket: WebSocket, sheet_id: str):
    await manager.connect(websocket, sheet_id)
    try:
        await manager.receive(websocket, sheet_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, sheet_id)

@app.get("/")
def root():
    return {"message": "Spreadsheet backend running."}

@app.get("/api/comments/{sheet_id}/{cell_ref}")
async def get_comments(sheet_id: str, cell_ref: str):
    comments = comment_service.get_comments(sheet_id, cell_ref)
    return [
        {"comment_id": c.comment_id,
         "user_id": c.user_id,
         "cell_ref": c.cell_ref,
         "text": c.text,
         "timestamp": c.timestamp}
        for c in comments
    ]

@app.post("/api/comments/{sheet_id}/{cell_ref}/{user_id}")
async def post_comment(sheet_id: str, cell_ref: str, user_id: str, text: str):
    comment = comment_service.add_comment(sheet_id, cell_ref, user_id, text)
    return {"comment_id": comment.comment_id, "text": comment.text}


@app.get("/sheet/{sheet_id}/cell/{cell_ref}")
def get_cell(sheet_id: str, cell_ref: str):
    # Fetch a cell value for test purposes
    cell = spreadsheet_service.get_cell_value(sheet_id, cell_ref)
    return {
        "cellRef": cell_ref,
        "value": cell.value,
        "formula": cell.formula,
        "type": cell.cell_type.value,
        "version": cell.version,
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    )


