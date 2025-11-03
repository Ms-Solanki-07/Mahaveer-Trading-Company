import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"; 

interface InvoiceEmailProps {
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  totalAmount: number;
}

export default function InvoiceEmail({
  customerName,
  invoiceNumber,
  invoiceDate,
  totalAmount
}: InvoiceEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Invoice - Mahaveer Trading Company</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>
        Invoice #{invoiceNumber} from Mahaveer Trading Company
      </Preview>

      <Body style={{ backgroundColor: "#f4f6f8", fontFamily: "Roboto, Verdana" }}>
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "32px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header */}
          <Section style={{ textAlign: "center", marginBottom: "20px" }}>
            <Heading as="h1" style={{ fontSize: "24px", margin: 0 }}>
              Mahaveer Trading Company
            </Heading> 
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", marginBottom: "20px" }} />

          {/* Greeting */}
          <Section style={{ marginBottom: "16px" }}>
            <Text style={{ fontSize: "16px", color: "#111827" }}>
              Dear <strong>{customerName}</strong>,
            </Text>
            <Text style={{ fontSize: "15px", color: "#374151", lineHeight: "24px" }}>
              Thank you for your business with <strong>Mahaveer Trading Company</strong>.
              Please find attached your invoice for recent purchase.
            </Text>
          </Section>

          {/* Invoice Info */}
          <Section
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              padding: "16px",
              margin: "24px 0",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#111827", lineHeight: "22px" }}>
              <strong>Invoice Number:</strong> {invoiceNumber} <br />
              <strong>Invoice Date:</strong> {invoiceDate} <br />
              <strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}
            </Text>
          </Section>

          {/* Instructions */}
          <Section style={{ marginBottom: "16px" }}>
            <Text style={{ fontSize: "14px", color: "#6b7280", lineHeight: "22px" }}>
              The full invoice details are attached as a PDF file.
              For any questions or clarifications, please reach out at{" "}
              <a
                href={'mailto:info@mahaveertrading.com'}
                style={{ color: "#2563eb", textDecoration: "none" }}
              >
                info@mahaveertrading.com
              </a>{" "}
              or call us at +91 7568797580
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          {/* Footer */}
          <Section style={{ textAlign: "center" }}>
            <Text style={{ fontSize: "13px", color: "#374151", lineHeight: "20px" }}>
              Mahaveer Trading Company <br />
              Mata ka than, jodhpur, Rajasthan, 342001 <br />
            </Text>
            <Text style={{ fontSize: "12px", color: "#9ca3af", marginTop: "12px" }}>
              © {new Date().getFullYear()} Mahaveer Trading Company. All rights reserved.
              <br />
              Thank you for choosing us!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
