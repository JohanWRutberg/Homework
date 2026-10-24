import type { Metadata } from "next";
import { Library } from "@/components/homework/Library";
import { PageHeader } from "@/components/layout/PageHeader";
import { templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Hemuppgifter",
  description: "KBT-hemuppgifter som formulär – med förklaringar, exempel och PDF-export.",
};

export default function HomeworkLibraryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Biblioteket"
        title={
          <>
            Välj din <span className="highlight italic">hemuppgift</span>
          </>
        }
      >
        Har du fått en länk av din behandlare kan du öppna den direkt. Annars hittar du övningen
        här. Varje hemuppgift har förklaringar och ett ifyllt exempel.
      </PageHeader>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Library templates={templates} />
      </section>
    </>
  );
}
