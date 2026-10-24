export const site = {
  name: "Optimental Hemuppgifter",
  shortName: "Hemuppgifter",
  description:
    "Hemuppgifter och skattningar från Optimental. Fyll i direkt i mobilen, få hjälp att förstå varje steg och ta med en PDF till nästa besök. Ingenting sparas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  mainSite: "https://optimental.vercel.app",
  contactEmail: "mackan@optimental.se",
};

/** Hänvisningar som visas vid tecken på kris. */
export const crisisContacts = [
  { name: "Akut fara för liv", detail: "Ring 112", href: "tel:112" },
  {
    name: "Mind Självmordslinjen",
    detail: "Ring 90101 eller chatta via mind.se",
    href: "tel:90101",
  },
  {
    name: "1177 Vårdguiden",
    detail: "Ring 1177 för sjukvårdsrådgivning dygnet runt",
    href: "tel:1177",
  },
];
