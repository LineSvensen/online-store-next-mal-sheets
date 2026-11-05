import { getFreshProducts } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only publicly supported content types.
const publicSheets = {
  produkter: true,
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!Object.hasOwn(publicSheets, type)) {
    return Response.json(
      { error: "Ugyldig innholdstype" },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  try {
    // Fresh data with the same validation as the store.
    const products = await getFreshProducts();

    // Explicitly allow public fields only.
    const publicProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      image: product.image,
      tilgjengelig: product.tilgjengelig,
      kategori: product.kategori,
    }));

    return Response.json(publicProducts, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Public Sheets API failed:", error);

    return Response.json(
      { error: "Kunne ikke hente innhold" },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

// import { getSheetData } from "@/lib/google-sheets";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// Fanene nettsiden skal kunne hente/vise offentlig . listen over tillatte faner, definert inne i route.js.
// const publicSheets = {
//   produkter: "Produkter",
//   tjenester: "Tjenester",
//   innhold: "Innhold",
// };

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const type = searchParams.get("type");

//   const sheetName = publicSheets[type];

//   if (!sheetName) {
//     return Response.json({ error: "Ugyldig innholdstype" }, { status: 400 });
//   }

//   try {
//     const data = await getSheetData(sheetName);

//     return Response.json(data, {
//       headers: {
//         "Cache-Control": "no-store",
//       },
//     });
//   } catch (error) {
//     console.error("Google Sheets:", error.message);

//     return Response.json(
//       { error: "Kunne ikke hente innhold" },
//       { status: 500 },
//     );
//   }
// }
