import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Field, FormValues, HomeworkTemplate } from "@/lib/templates/types";

Font.registerHyphenationCallback((word) => [word]);

const ORANGE = "#FF8C42";
const INK = "#1A1614";
const MUTED = "#6F655E";
const LINE = "#E8DCCD";
const SAND = "#F6EEE3";

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: INK,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 22 },
  logo: { width: 36, height: 36, marginRight: 10 },
  brand: { fontFamily: "Helvetica-Bold", fontSize: 12 },
  brandSub: { fontSize: 9, color: MUTED, marginTop: 2 },
  accent: { height: 3, width: 56, backgroundColor: ORANGE, marginBottom: 12 },
  title: { fontFamily: "Times-Bold", fontSize: 26, marginBottom: 10 },
  meta: {
    flexDirection: "row",
    gap: 24,
    paddingVertical: 8,
    borderTop: `1 solid ${LINE}`,
    borderBottom: `1 solid ${LINE}`,
    marginBottom: 18,
  },
  metaLabel: { fontSize: 8, color: MUTED, textTransform: "uppercase", letterSpacing: 1 },
  metaValue: { fontSize: 11, marginTop: 2 },
  sectionTitle: { fontFamily: "Times-Bold", fontSize: 16, marginTop: 8, marginBottom: 8 },
  entry: { borderRadius: 6, border: `1 solid ${LINE}`, padding: 12, marginBottom: 12 },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#A34100",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  field: { marginBottom: 8 },
  fieldLabel: { fontFamily: "Helvetica-Bold", fontSize: 9, color: MUTED, marginBottom: 2 },
  fieldValue: { fontSize: 10.5, lineHeight: 1.45 },
  empty: { fontSize: 10.5, color: "#B5AAA1" },
  scaleRow: { flexDirection: "row", alignItems: "center" },
  scaleTrack: { height: 5, width: 140, backgroundColor: SAND, borderRadius: 3, marginRight: 8 },
  scaleFill: { height: 5, backgroundColor: ORANGE, borderRadius: 3 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: MUTED,
  },
});

/** Standardtypsnitten i PDF klarar bara Latin-1 + vanlig typografi – ta bort t.ex. emojis. */
export function pdfSafe(text: string): string {
  return text.replace(/[^\u0009\u000A\u000D -ÿ–—‘’“”•…€]/g, "");
}

function hasContent(entry: Record<string, string>): boolean {
  return Object.values(entry).some((v) => v.trim() !== "");
}

function FieldValue({ field, value }: { field: Field; value: string }) {
  if (!value.trim()) return <Text style={styles.empty}>–</Text>;

  if (field.type === "scale") {
    const pct = ((Number(value) - field.min) / (field.max - field.min)) * 100;
    return (
      <View style={styles.scaleRow}>
        <View style={styles.scaleTrack}>
          <View style={[styles.scaleFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.fieldValue}>
          {value}
          {field.unit ?? ""}{" "}
          <Text style={{ color: MUTED, fontSize: 9 }}>
            ({field.min} = {field.minLabel}, {field.max} = {field.maxLabel})
          </Text>
        </Text>
      </View>
    );
  }

  const unit = field.type === "number" && field.unit ? ` ${field.unit}` : "";
  return <Text style={styles.fieldValue}>{pdfSafe(value) + unit}</Text>;
}

export function HomeworkPdf({
  template,
  values,
  name,
  date,
  logoUrl,
}: {
  template: HomeworkTemplate;
  values: FormValues;
  name: string;
  date: string;
  logoUrl: string;
}) {
  return (
    <Document
      title={template.title}
      author="Optimental Hemuppgifter"
      creator="Optimental Hemuppgifter"
      language="sv"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf:s Image har ingen alt */}
          <Image src={logoUrl} style={styles.logo} />
          <View>
            <Text style={styles.brand}>Optimental</Text>
            <Text style={styles.brandSub}>Hemuppgift</Text>
          </View>
        </View>

        <View style={styles.accent} />
        <Text style={styles.title}>{template.title}</Text>

        <View style={styles.meta}>
          <View>
            <Text style={styles.metaLabel}>Namn</Text>
            <Text style={styles.metaValue}>{pdfSafe(name) || " "}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Datum</Text>
            <Text style={styles.metaValue}>{date}</Text>
          </View>
        </View>

        {template.sections.map((section) => {
          const entries = values[section.id] ?? [];
          const filled = entries.filter(hasContent);
          const shown = filled.length > 0 ? filled : entries.slice(0, 1);
          return (
            <View key={section.id}>
              {section.repeatable && <Text style={styles.sectionTitle}>{section.title}</Text>}
              {shown.map((entry, i) => (
                <View key={i} style={styles.entry} wrap={section.fields.length > 6}>
                  {section.repeatable ? (
                    <Text style={styles.entryTitle}>
                      {section.repeatable.itemLabel} {i + 1}
                    </Text>
                  ) : (
                    <Text style={styles.entryTitle}>{section.title}</Text>
                  )}
                  {section.fields.map((field) => (
                    <View key={field.id} style={styles.field} wrap={false}>
                      <Text style={styles.fieldLabel}>{field.label}</Text>
                      <FieldValue field={field} value={entry[field.id] ?? ""} />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          );
        })}

        <View style={styles.footer} fixed>
          <Text>Skapad i webbläsaren – inget har sparats hos Optimental.</Text>
          <Text render={({ pageNumber, totalPages }) => `Sida ${pageNumber} av ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
