
from spreadsheet import SpreadsheetService
from fastapi import FastAPI,WebSocket, WebSocketDisconnect, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import logging

from websocket_handler import ConnectionManager
from comments import CommentService
from history import HistoryService
from csv_handler import csv_router
from auth import router as auth_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS origins from environment or use defaults
allowed_origins = os.environ.get("ALLOWED_ORIGINS", 
    "http://localhost:3000,http://localhost:5173,https://spreadsheet-application-nine.vercel.app"
).split(",")

# Strip whitespace from origins
allowed_origins = [origin.strip() for origin in allowed_origins]

# For development, also allow all localhost variants
if any("localhost" in origin for origin in allowed_origins):
    allowed_origins.extend([
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://0.0.0.0:5173"
    ])

# Remove duplicates while preserving order
allowed_origins = list(dict.fromkeys(allowed_origins))

logger.info(f"Configured CORS origins: {allowed_origins}")

# Manual CORS middleware for debugging
@app.middleware("http")
async def cors_handler(request: Request, call_next):
    origin = request.headers.get("origin")
    
    # Handle preflight requests
    if request.method == "OPTIONS":
        response = Response()
        if origin in allowed_origins or origin is None:
            response.headers["Access-Control-Allow-Origin"] = origin or "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
        return response
    
    # Process the request
    response = await call_next(request)
    
    # Add CORS headers to the response
    if origin in allowed_origins or origin is None:
        response.headers["Access-Control-Allow-Origin"] = origin or "*"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

# Allow specific origins for production deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporary wildcard for debugging
    allow_credentials=False,  # Must be False when using wildcard
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Add OPTIONS handler for preflight requests
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return {"message": "OK"}

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

@app.get("/api/health")
def health_check():
    """Health check endpoint that also shows CORS configuration"""
    return {
        "status": "healthy",
        "message": "Spreadsheet backend is running",
        "allowed_origins": allowed_origins,
        "cors_enabled": True
    }

@app.get("/api/cors-test")
def cors_test():
    """Simple CORS test endpoint"""
    return {
        "message": "CORS is working!",
        "timestamp": os.environ.get("PORT", "8000"),
        "origins": allowed_origins
    }

# Simple test endpoint without any dependencies
@app.get("/api/simple-test")
def simple_test():
    """Simplest possible test endpoint"""
    return {"status": "ok", "message": "Simple test endpoint working"}

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


