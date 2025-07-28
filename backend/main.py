from spreadsheet import SpreadsheetService
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins for development; adjust in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

spreadsheet_service = SpreadsheetService()


@app.get("/")
def root():
    return {"message": "Spreadsheet backend running."}


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
