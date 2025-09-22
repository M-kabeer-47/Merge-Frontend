import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import send_email from "@/utils/send-email";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  user,
  account,
  session,
  verification,
  twoFactor,
} from "@/../auth-schema.ts";
import {
  admin,
  emailOTP,
  twoFactor as two_factor_plugin,
} from "better-auth/plugins";
import { eq } from "drizzle-orm";
import {
  generateVerificationEmailHTML,
  generateOTPEmailHTML,
  generateResetPasswordEmailHTML,
} from "@/lib/email/generateVerificationEmail";
dotenv.config();

const db = drizzle(process.env.DATABASE_URL!);

export const auth = betterAuth({
  appName: "Better-Auth",
  rateLimit: {
    enabled: true,
    window: 60,
    max: 15,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user: User, url }, request) => {
      if (request?.url.endsWith("sign-up/email")) {
        return;
      }
      // Non-blocking email sending for better performance
      process.nextTick(async () => {
        try {
          const htmlContent = generateVerificationEmailHTML(url, User.name);
          console.log("Verification Email: " + User.email);
          await send_email({
            to: User.email,
            subject: "🌍 Welcome to JourneyWise - Verify Your Email",
            text: `Welcome to JourneyWise! Click the link to verify your email: ${url}`,
            html: htmlContent, // Add the beautiful HTML content
          });
        } catch (error) {
          console.error("Failed to send verification email:", error);
        }
      });
    },
    sendOnSignUp: false, // You have this set to false
    autoSignInAfterVerification: true,
  },
  plugins: [
    two_factor_plugin({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }, request) {
          const htmlContent = generateOTPEmailHTML(otp);
          await send_email({
            to: user.email,
            subject: "🔐 JourneyWise - Your Security Code",
            text: `Your security code is: ${otp}`,
            html: htmlContent,
          });
        },
      },
    }),
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const htmlContent = generateOTPEmailHTML(otp);
          await send_email({
            to: email,
            subject: "🔐 JourneyWise - Your Security Code",
            text: `Your security code is: ${otp}`,
            html: htmlContent,
          });
        }
      },
    }),
  ],
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async (
        { user, newEmail, url, token },
        request
      ) => {
        await send_email({
          to: user.email, // verification email must be sent to the current user email to approve the change
          subject: "Approve email change",
          text: `Click the link to approve the change: ${url}`,
        });
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg", //@ts-ignore
    schema: {
      user,
      account,
      session,
      verification,
      twoFactor,
    },
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      //@ts-ignore
      mapProfileToUser: async (profile) => {
        let User = await db
          .select()
          .from(user)
          .where(eq(user.email, profile.email));
        if (User.length > 0) {
          if (User[0].image) {
            return {
              email: profile.email.toLowerCase(),
              name: profile.name,
              country: "",
              phoneNumber: "",
              dob: null,
            };
          }
        }
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }, request) => {
      const htmlContent = generateResetPasswordEmailHTML(url, user.name);
      await send_email({
        to: user.email,
        subject: "🔑 Reset Your JourneyWise Password",
        text: `Click the link to reset your password: ${url}`,
        html: htmlContent,
      });
    },
  },
});
