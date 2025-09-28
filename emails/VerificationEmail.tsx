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

interface VerificationEmailProps {
  fullName: string; 
  otp: string;
}

export default function VerificationEmail({
  fullName, 
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify Your Email</title>
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
      <Preview>Your verification code is {otp}</Preview>
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
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <Heading as="h1" style={{ fontSize: "24px", margin: 0 }}>
              Mahaveer Trading Company
            </Heading>
            <Text style={{ color: "#6b7280", fontSize: "14px", margin: "4px 0" }}>
              Secure Verification
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", marginBottom: "24px" }} />

          {/* Greeting */}
          <Section style={{ marginBottom: "16px" }}>
            <Text style={{ fontSize: "16px", color: "#111827" }}>
              Hello <strong>{fullName}</strong>,
            </Text>
            <Text style={{ fontSize: "16px", color: "#374151", lineHeight: "24px" }}>
              Thank you for signing up with <strong>Mahaveer Trading Company</strong>.  
              To complete your registration, Please use the following verification code:
            </Text>
          </Section>

          {/* OTP Box */}
          <Section
            style={{
              textAlign: "center",
              margin: "24px 0",
              padding: "16px",
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Text
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                letterSpacing: "6px",
                color: "#111827",
              }}
            >
              {otp}
            </Text>
          </Section>

          {/* Additional Info */}
          <Section>
            <Text style={{ fontSize: "14px", color: "#6b7280", lineHeight: "22px" }}>
              This code will expire in 5 minutes. If you didn’t request this,
              please ignore this email.
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          {/* Footer */}
          <Section style={{ textAlign: "center" }}>
            <Text style={{ fontSize: "12px", color: "#9ca3af" }}>
              © {new Date().getFullYear()} Mahaveer Trading Company. All rights reserved.
              <br />
              This is an automated email, please do not reply.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
















// import {Font, Head, Heading, Html, Preview, Row, Section, Text} from '@react-email/components'

// interface VerificationEmailProps {
//     fullName: string,
//     email: string,
//     otp: string
// }


// export default function VerificationEmail({fullName, email, otp}: VerificationEmailProps){
//     return (
//     <Html lang="en" dir="ltr">
//       <Head>
//         <title>Verification Code</title>
//         <Font
//           fontFamily="Roboto"
//           fallbackFontFamily="Verdana"
//           webFont={{
//             url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
//             format: 'woff2',
//           }}
//           fontWeight={400}
//           fontStyle="normal"
//         />
//       </Head>
//       <Preview>Here&apos;s your verification code: {otp}</Preview>
//       <Section>
//         <Row>
//           <Heading as="h2">Hello {fullName},</Heading>
//         </Row>
//         <Row>
//           <Text>
//             Thank you for registering. Please use the following verification
//             code to complete your registration:
//           </Text>
//         </Row>
//         <Row>
//           <Text>{otp}</Text>
//         </Row>
//         <Row>
//           <Text>
//             If you did not request this code, please ignore this email.
//           </Text>
//         </Row> 
//       </Section>
//     </Html>
//   );
// }