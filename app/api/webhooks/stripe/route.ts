import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { writeClient } from "@/sanity/client";
import { Resend } from "resend";

// Tell Next.js not to parse the body — we need the raw bytes for signature verification
export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

// ---------------------------------------------------------------------------
// POST /api/webhooks/stripe
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Verify that the event genuinely came from Stripe
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // We only care about completed checkout sessions
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    await handleCheckoutCompleted(session);
  } catch (err) {
    // Log the error but still return 200 — Stripe will retry on non-2xx responses
    // and we don't want to double-process fulfilled orders
    console.error("[webhook] handleCheckoutCompleted error:", err);
  }

  return NextResponse.json({ received: true });
}

// ---------------------------------------------------------------------------
// Core handler
// ---------------------------------------------------------------------------
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Fetch the full line items (session object only contains a preview)
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
    limit: 100,
  });

  // Decrement stock for each purchased piece in Sanity
  const decrementPromises = lineItems.data.map(async (item) => {
    const product = item.price?.product as Stripe.Product | undefined;
    const sanityId = product?.metadata?.sanity_id;
    const qty = item.quantity ?? 1;

    if (!sanityId) {
      console.warn("[webhook] Line item has no sanity_id metadata — skipping stock decrement");
      return;
    }

    try {
      // Fetch current stock
      const piece = await writeClient.fetch<{ stockQuantity: number | null }>(
        `*[_type == "piece" && _id == $id][0]{ stockQuantity }`,
        { id: sanityId }
      );

      const current = piece?.stockQuantity ?? 0;
      const next = Math.max(0, current - qty);

      await writeClient.patch(sanityId).set({ stockQuantity: next }).commit();
      console.info(`[webhook] ${sanityId}: stock ${current} → ${next}`);
    } catch (err) {
      console.error(`[webhook] Failed to decrement stock for ${sanityId}:`, err);
    }
  });

  await Promise.all(decrementPromises);

  // Send order confirmation email to the customer
  const customerEmail = session.customer_details?.email;
  if (customerEmail) {
    await sendConfirmationEmail(session, lineItems.data, customerEmail);
  }
}

// ---------------------------------------------------------------------------
// Order confirmation email
// ---------------------------------------------------------------------------
async function sendConfirmationEmail(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[],
  customerEmail: string
) {
  const locale = (session.metadata?.locale as string) ?? "sv";
  const isSv = locale === "sv";

  const orderRef = session.id.replace("cs_", "").slice(-12).toUpperCase();
  const name = session.customer_details?.name ?? (isSv ? "kunden" : "you");

  const formattedTotal = new Intl.NumberFormat(isSv ? "sv-SE" : "en-SE", {
    style: "currency",
    currency: session.currency?.toUpperCase() ?? "SEK",
    minimumFractionDigits: 0,
  }).format((session.amount_total ?? 0) / 100);

  const itemRows = lineItems
    .map((item) => {
      const unitAmount = item.price?.unit_amount ?? 0;
      const qty = item.quantity ?? 1;
      const lineTotal = new Intl.NumberFormat(isSv ? "sv-SE" : "en-SE", {
        style: "currency",
        currency: session.currency?.toUpperCase() ?? "SEK",
        minimumFractionDigits: 0,
      }).format((unitAmount * qty) / 100);

      return `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d6; font-family: Georgia, serif; color: #2c2c2c;">
            ${item.description ?? ""}${qty > 1 ? ` ×${qty}` : ""}
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d6; text-align: right; font-family: sans-serif; color: #2c2c2c;">
            ${lineTotal}
          </td>
        </tr>`;
    })
    .join("");

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://wallensdesign.se";

  const subject = isSv
    ? `Tack för din beställning — ${orderRef}`
    : `Thank you for your order — ${orderRef}`;

  const html = `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background: #f5f0e8; font-family: sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f5f0e8; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background: #faf8f4; max-width: 560px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 24px; border-bottom: 1px solid #e8e0d6; text-align: center;">
              <a href="${siteUrl}" style="font-family: Georgia, serif; font-size: 22px; font-weight: 300; color: #2c4a3e; letter-spacing: 0.1em; text-decoration: none;">
                WALLENS DESIGN
              </a>
            </td>
          </tr>

          <!-- Hero text -->
          <tr>
            <td style="padding: 40px 40px 24px; text-align: center;">
              <p style="margin: 0 0 8px; font-family: sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #b8975a;">
                ${isSv ? "Beställning bekräftad" : "Order confirmed"}
              </p>
              <h1 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 28px; font-weight: 300; color: #2c4a3e; line-height: 1.3;">
                ${isSv ? `Tack, ${name}` : `Thank you, ${name}`}
              </h1>
              <div style="width: 32px; height: 1px; background: #b8975a; margin: 0 auto 16px;"></div>
              <p style="margin: 0; font-family: sans-serif; font-size: 14px; color: #2c2c2c; opacity: 0.7; line-height: 1.6;">
                ${
                  isSv
                    ? "Din betalning har behandlats och din beställning är bekräftad. Vi kontaktar dig snart med leveransinformation."
                    : "Your payment has been processed and your order is confirmed. We will be in touch shortly with shipping information."
                }
              </p>
            </td>
          </tr>

          <!-- Order reference -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <div style="border: 1px solid #e8e0d6; padding: 16px 24px; text-align: center;">
                <p style="margin: 0 0 4px; font-family: sans-serif; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #2c2c2c; opacity: 0.4;">
                  ${isSv ? "Orderreferens" : "Order reference"}
                </p>
                <p style="margin: 0; font-family: sans-serif; font-size: 14px; letter-spacing: 0.15em; color: #2c2c2c;">
                  ${orderRef}
                </p>
              </div>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0 0 12px; font-family: sans-serif; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #2c2c2c; opacity: 0.5;">
                ${isSv ? "Din beställning" : "Your order"}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
                <tr>
                  <td style="padding: 14px 0 0; font-family: sans-serif; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #2c2c2c; opacity: 0.5;">
                    ${isSv ? "Totalt" : "Total"}
                  </td>
                  <td style="padding: 14px 0 0; text-align: right; font-family: Georgia, serif; font-size: 20px; font-weight: 300; color: #2c4a3e;">
                    ${formattedTotal}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 40px; border-top: 1px solid #e8e0d6; text-align: center;">
              <p style="margin: 0 0 8px; font-family: sans-serif; font-size: 12px; color: #2c2c2c; opacity: 0.5;">
                ${isSv ? "Frågor om din beställning?" : "Questions about your order?"}
              </p>
              <a href="${siteUrl}${locale === "en" ? "/en" : ""}/contact"
                 style="font-family: sans-serif; font-size: 12px; color: #2c4a3e; text-decoration: underline;">
                ${isSv ? "Kontakta oss" : "Contact us"}
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: `Wallens Design <noreply@wallensdesign.se>`,
      to: customerEmail,
      subject,
      html,
    });
    console.info(`[webhook] Confirmation email sent to ${customerEmail}`);
  } catch (err) {
    // Non-fatal — the order is already processed, just log it
    console.error("[webhook] Failed to send confirmation email:", err);
  }
}
