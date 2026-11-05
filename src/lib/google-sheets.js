import "server-only";
import { google } from "googleapis";
import { JWT } from "google-auth-library";

export async function getSheetData(sheetName) {
  if (!sheetName || !/^[\p{L}\p{N}_ -]+$/u.test(sheetName)) {
    throw new Error("Ugyldig fanenavn");
  }

  const { GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } =
    process.env;

  if (
    !GOOGLE_SHEET_ID ||
    !GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !GOOGLE_PRIVATE_KEY
  ) {
    throw new Error("Google Sheets configuration is missing");
  }

  const auth = new JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({
    version: "v4",
    auth,
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: `'${sheetName}'!A1:Z`,
  });

  const [headers = [], ...rows] = response.data.values ?? [];

  return rows
    .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
    .map((row) =>
      Object.fromEntries(
        headers.flatMap((header, index) => {
          const key = String(header ?? "").trim();

          if (!key) return [];

          return [[key, row[index] ?? ""]];
        }),
      ),
    );
}

// import "server-only";
// import { google } from "googleapis";
// import { JWT } from "google-auth-library";

// export async function getSheetData(sheetName) {
//   if (!sheetName || !/^[\p{L}\p{N}_ -]+$/u.test(sheetName)) {
//     throw new Error("Ugyldig fanenavn");
//   }

//   const auth = new JWT({
//     email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//     key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
//   });

//   const sheets = google.sheets({
//     version: "v4",
//     auth,
//   });

//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId: process.env.GOOGLE_SHEET_ID,
//     range: `'${sheetName}'!A1:Z`,
//   });

//   const [headers = [], ...rows] = response.data.values ?? [];

//   return rows
//     .filter((row) => row.some((cell) => cell !== ""))
//     .map((row) =>
//       Object.fromEntries(
//         headers
//           .filter(Boolean)
//           .map((header, index) => [header, row[index] ?? ""]),
//       ),
//     );
// }
