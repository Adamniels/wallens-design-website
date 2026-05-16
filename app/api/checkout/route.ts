import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { client } from "@/sanity/client";
import groq from "groq";

// Shape of each item sent from the browser
interface CartItemRequest {
  id: string;       // Sanity _id
  quantity: number;
}

// What we fetch from Sanity to validate each item
interface SanityPiece {
  _id: string;
  title: string;
  status: string;
  price: number | null;
  stockQuantity: number | null;
}

const piecesByIdsQuery = groq`
  *[_type == "piece" && _id in $ids] {
    _id,
    title,
    status,
    price,
    stockQuantity
  }
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { items: CartItemRequest[]; locale: string };
    const { items, locale = "sv" } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Fetch all referenced pieces from Sanity in one query
    const sanityIds = items.map((i) => i.id);
    const pieces = await client.fetch<SanityPiece[]>(piecesByIdsQuery, {
      ids: sanityIds,
    });

    // Build Stripe line_items, validating each piece server-side
    const lineItems: ReturnType<typeof buildLineItem>[] = [];

    for (const item of items) {
      const piece = pieces.find((p) => p._id === item.id);

      if (!piece) {
        return NextResponse.json(
          { error: `Piece not found. It may have been removed.` },
          { status: 400 }
        );
      }

      if (piece.status !== "available") {
        return NextResponse.json(
          {
            error:
              locale === "sv"
                ? `"${piece.title}" är inte längre tillgänglig för köp.`
                : `"${piece.title}" is no longer available for purchase.`,
          },
          { status: 400 }
        );
      }

      if (!piece.price || piece.price <= 0) {
        return NextResponse.json(
          {
            error:
              locale === "sv"
                ? `"${piece.title}" saknar pris. Kontakta oss för hjälp.`
                : `"${piece.title}" has no price set. Please contact us for help.`,
          },
          { status: 400 }
        );
      }

      const stock = piece.stockQuantity ?? 1;
      if (stock < item.quantity) {
        return NextResponse.json(
          {
            error:
              locale === "sv"
                ? `Endast ${stock} av "${piece.title}" finns i lager.`
                : `Only ${stock} of "${piece.title}" available in stock.`,
          },
          { status: 400 }
        );
      }

      lineItems.push(buildLineItem(piece, item.quantity));
    }

    // Determine the base URL for success/cancel redirects
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
      "http://localhost:3000";
    const localePrefix = locale === "en" ? "/en" : "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      // Allow discount codes created in the Stripe Dashboard
      allow_promotion_codes: true,

      // Collect shipping address — adjust allowed_countries as needed
      shipping_address_collection: {
        allowed_countries: ["SE", "NO", "DK", "FI", "DE", "GB", "NL", "FR", "US"],
      },

      // Collect phone number for shipping notifications
      phone_number_collection: { enabled: true },

      // Collect customer email so Stripe can send its own receipt
      customer_creation: "always",

      success_url: `${baseUrl}${localePrefix}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${localePrefix}/checkout/cancel`,

      metadata: {
        locale,
        // Snapshot of Sanity IDs in case the webhook needs them
        sanity_ids: sanityIds.join(","),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[/api/checkout]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

function buildLineItem(piece: SanityPiece, quantity: number) {
  return {
    price_data: {
      currency: "sek",
      // Stripe expects amounts in the smallest currency unit (öre for SEK)
      unit_amount: Math.round(piece.price! * 100),
      product_data: {
        name: piece.title,
        metadata: { sanity_id: piece._id },
      },
    },
    quantity,
  };
}
