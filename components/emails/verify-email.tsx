import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from '@react-email/components';

interface VerifyEmailProps{
    username:string,
    verifyUrl:string,
  
}
const VerifyEmail = (props: VerifyEmailProps) => {
    const {username,verifyUrl}=props
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] p-[32px] max-w-[600px] mx-auto">
            <Section>
              <Text className="text-[24px] font-bold text-gray-900 mb-[16px] mt-0">
                Verify Your Email Address
              </Text>
              
              <Text className="text-[16px] text-gray-700 mb-[24px] mt-0 leading-[24px]">
                Thank you {username} for signing up! To complete your registration and secure your account, 
                please verify your email address by clicking the button below.
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href={verifyUrl}
                  className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-semibold no-underline box-border"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px] mt-0 leading-[20px]">
                If you didn&apos;t create an account with us, you can safely ignore this email.
              </Text>

              <Hr className="border-gray-200 my-[24px]" />

              <Text className="text-[12px] text-gray-500 mb-[8px] mt-0">
                Best regards,<br />
                The Team
              </Text>

              <Text className="text-[12px] text-gray-400 m-0">
                123 Business Street, Suite 100<br />
                City, State 12345<br />
                <a href="mailto:unsubscribe@example.com" className="text-gray-400 underline">
                  Unsubscribe
                </a> | © 2025 Company Name
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyEmail;