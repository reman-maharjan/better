import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface ForgotPasswordEmailProps {
    username: string;
    resetUrl: string;
    userEmail: string;
}

const ForgotPasswordEmail = (props: ForgotPasswordEmailProps) => {
  const { username,resetUrl,userEmail} = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - Action required</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[580px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                Reset Your Password
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                We received a request to reset your password
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[16px]">
                Hello, {username}
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[16px]">
                Someone requested a password reset for your account associated with <strong>{userEmail}</strong>. 
                If this was you, click the button below to reset your password.
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[24px]">
                If you didn&apos;t request this password reset, you can safely ignore this email. 
                Your password will remain unchanged.
              </Text>
            </Section>

            {/* Reset Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={resetUrl}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-[12px] px-[24px] rounded-[6px] text-[16px] no-underline box-border"
              >
                Reset Password
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[8px]">
                If the button above doesn&apos;t work, copy and paste this link into your browser:
              </Text>
              <Link
                href={resetUrl}
                className="text-blue-600 text-[14px] break-all underline"
              >
                {resetUrl}
              </Link>
            </Section>

            {/* Security Notice */}
            <Section className="border-t border-gray-200 pt-[24px] mb-[24px]">
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[8px]">
                <strong>Security tip:</strong> This link will expire in 24 hours for your security.
              </Text>
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0">
                If you continue to have problems, please contact our support team.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                Best regards,<br />
                The Security Team
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                123 Business Street, Suite 100<br />
                Kathmandu, Nepal 44600
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                <Link href="#" className="text-gray-500 underline">Unsubscribe</Link> | 
                © 2025 Your Company Name. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


export default ForgotPasswordEmail;