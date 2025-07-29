# Spreadsheet Backend

## Setup

1. Create virtual environment, activate it:

2. Install dependencies:

3. Run server (auto-reload for dev):

```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

4. Server health check:
   Open `http://localhost:8000/` in browser; expect JSON response.

## Project Structure

- main.py: app entrypoint
- models.py: data models
- spreadsheet.py: core spreadsheet logic
  ... (see full README for details)
