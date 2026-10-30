import "server-only";
import { google } from "googleapis";
import { JWT } from "google-auth-library";

export async function getSheetData(sheetName) {
  if (!sheetName || !/^[\p{L}\p{N}_ -]+$/u.test(sheetName)) {
    throw new Error("Ugyldig fanenavn");
  }

  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({
    version: "v4",
    auth,
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `'${sheetName}'!A1:Z`,
  });

  const [headers = [], ...rows] = response.data.values ?? [];

  return rows
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) =>
      Object.fromEntries(
        headers
          .filter(Boolean)
          .map((header, index) => [header, row[index] ?? ""]),
      ),
    );
}
