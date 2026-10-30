import { getSheetData } from "@/lib/google-sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Fanene nettsiden skal kunne hente/vise offentlig . listen over tillatte faner, definert inne i route.js.
const publicSheets = {
  produkter: "Produkter",
  tjenester: "Tjenester",
  innhold: "Innhold",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const sheetName = publicSheets[type];

  if (!sheetName) {
    return Response.json({ error: "Ugyldig innholdstype" }, { status: 400 });
  }

  try {
    const data = await getSheetData(sheetName);

    return Response.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Google Sheets:", error.message);

    return Response.json(
      { error: "Kunne ikke hente innhold" },
      { status: 500 },
    );
  }
}
