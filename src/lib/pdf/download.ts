import type { DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import type { FormValues, HomeworkTemplate } from "@/lib/templates/types";

/** Skapar PDF:en helt i webbläsaren. Biblioteket laddas först när patienten klickar. */
export async function downloadHomeworkPdf(
  template: HomeworkTemplate,
  values: FormValues,
  name: string
): Promise<void> {
  const [{ pdf }, { HomeworkPdf }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./HomeworkPdf"),
  ]);

  const today = new Date();
  const date = today.toLocaleDateString("sv-SE");
  const blob = await pdf(
    createElement(HomeworkPdf, {
      template,
      values,
      name,
      date,
      logoUrl: `${window.location.origin}/images/optimental-logo.jpg`,
    }) as ReactElement<DocumentProps> // HomeworkPdf renderar ett <Document> på toppnivå
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${template.slug}-${date}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
