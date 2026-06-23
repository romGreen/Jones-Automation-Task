# Part B — Billing Widget Analysis

## a. Problems with the screen

**Security**
- **No CVV field** is shown, which card payments almost always require.

**Functional**
- **No Country field, but "State or Province" and "Postal Code (no dashes)" are required and assume a US format** — a non-US customer can't pick their region or enter a valid postal code, so they can't complete the form. *(Most severe — see c.)*

**Usability**
- **The second billing-address box has no label** — the user can't tell what it's for (Address Line 2? Apartment?).
- **The cardholder-name section is over-structured.** A "Cardholder Name" heading sits above three fields — First / MI / Last — with no input of its own, which is confusing. A card carries a single embossed name and processors expect the full "Name on card", so this should be one field. ("MI" is also unexplained.)
- **The amount has no currency** — it shows `30.00`, not `USD 30.00`. Ambiguous for a global product.

**Accessibility**
- The unlabeled second address box has **no accessible name**, so a screen reader can't tell the user what to enter.

**Would need runtime testing to confirm** (can't be sure in a static image):
- **Card-data handling / PCI** — I can't tell from a static image whether the card fields are a PCI-compliant provider's hosted/iframe fields or self-hosted inputs.
- **Idempotency** — double charge if **Continue** is clicked twice or retried after a timeout.
- **Amount validated server-side** — the price must be decided by the server, not trusted from the client (the browser value can be tampered with).

---

## b. Sample test cases

**Test case 1 — Successful payment with a valid card** 
- **Steps:** Fill valid card + billing details → click **Continue**.
- **Expected:** One charge; confirmation page shows amount, currency, and a reference ID.

**Test case 2 — No double charge on double submit** 
- **Steps:** Throttle the network → double-click **Continue** (or click again while it's processing).
- **Expected:** Button disables after the first click; only one charge is created.

**Test case 3 — Invalid / expired card is rejected**  
- **Steps:** Enter an invalid card number or a past expiry → submit.
- **Expected:** Not submitted; inline error next to the field; no charge created.

---

## c. Product solution for the most severe bug

**Most severe bug:** international customers can't complete the form. "State or Province" and "Postal Code (no dashes)" are required and assume a US format, and there is no Country field — so a non-US user can't select their region or enter a valid postal code, and therefore can't pay. The task describes the company as a **global SaaS**, so serving non-US customers is in scope — this is a defect, not intentional US-only scoping.

**Solution — make the billing address country-aware:**
- Add a **Country** selector as the first address field.
- Drive the rest from the selected country: show **State/Province** only where it applies (optional / free text otherwise), and **validate Postal Code per that country's format** (drop the "no dashes" US assumption).
- Localize the labels and required-field rules accordingly.

This unblocks paying customers worldwide — directly protecting revenue for a global SaaS.
