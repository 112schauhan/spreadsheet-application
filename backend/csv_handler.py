from fastapi import APIRouter, UploadFile, File, HTTPException
import csv
import io
from spreadsheet import SpreadsheetService

csv_router = APIRouter()
spreadsheet_service = SpreadsheetService()


@csv_router.post("/import/{sheet_id}")
async def import_csv(sheet_id: str, file: UploadFile = File(...)):
    contents = await file.read()
    decoded = contents.decode("utf-8")
    reader = csv.reader(io.StringIO(decoded))
    sheet = spreadsheet_service.get_or_create_sheet(sheet_id)
    sheet.cells.clear()
    row_num = 1
    for row in reader:
        col_num = 0
        for cell_value in row:
            col_char = chr(ord("A") + col_num)
            if cell_value.strip():
                spreadsheet_service.set_cell_value(
                    sheet_id, f"{col_char}{row_num}", cell_value.strip())
            col_num += 1
        row_num += 1
    return {"message": f"Imported CSV for sheet {sheet_id}"}


@csv_router.get("/export/{sheet_id}")
def export_csv(sheet_id: str):
    import io
    from fastapi.responses import StreamingResponse

    sheet = spreadsheet_service.get_or_create_sheet(sheet_id)
    output = io.StringIO()
    writer = csv.writer(output)

    for row in range(1, sheet.rows + 1):
        row_data = []
        for col in range(sheet.columns):
            cell_ref = f"{chr(ord('A') + col)}{row}"
            cell = sheet.cells.get(cell_ref)
            val = cell.value if cell else ""
            row_data.append(str(val))
        writer.writerow(row_data)

    output.seek(0)
    return StreamingResponse(iter([output.read()]), media_type="text/csv",
                             headers={"Content-Disposition": f"attachment; filename={sheet_id}.csv"})
