export async function importCSV(sheetId: string, file: File): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`/api/import/${sheetId}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(`Failed to import CSV: ${errMsg}`);
  }

  return (await response.json()) as { message: string };
}

/**
 * Exports the spreadsheet data as CSV.
 * Returns a Blob that can be used to trigger download.
 */
export async function exportCSV(sheetId: string): Promise<Blob> {
  const response = await fetch(`/api/export/${sheetId}`);

  if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(`Failed to export CSV: ${errMsg}`);
  }

  const blob = await response.blob();
  return blob;
}
