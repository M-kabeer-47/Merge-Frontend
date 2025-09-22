export const generateVerificationEmailHTML = (
  url: string,
  userName: string = "Traveler"
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - JourneyWise</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Raleway', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-radius: 16px;
            overflow: hidden;
            width: 100%;
        }
        
        .header {
            background-color: #003C7D;
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
            opacity: 0.3;
        }
        
        .logo-section {
            position: relative;
            z-index: 1;
        }
        
        .logo {
            font-family: 'Raleway', sans-serif;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .tagline {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 50px 40px;
            text-align: center;
        }
        
        .main-title {
            font-size: 28px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
            line-height: 1.3;
        }
        
        .subtitle {
            font-size: 18px;
            color: #6b7280;
            margin-bottom: 35px;
            line-height: 1.5;
        }
        
        .cta-button {
            display: inline-block;
            background-color: #003C7D;
            color: white !important;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 8px 25px rgba(0, 60, 125, 0.3);
            transition: all 0.3s ease;
            margin-bottom: 30px;
            width: auto;
            min-width: 200px;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(0, 60, 125, 0.4);
            background-color: #002a5c;
        }
        
        .features {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 40px 0;
            padding: 0 20px;
            flex-wrap: wrap;
            gap: 20px;
        }
        
        .feature {
            text-align: center;
            flex: 1;
            margin: 0 10px;
            min-width: 120px;
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
            border-radius: 50%;
            margin: 0 auto 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            line-height: 1;
        }
        
        .feature-title {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 4px;
        }
        
        .feature-desc {
            font-size: 12px;
            color: #6b7280;
            line-height: 1.4;
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 16px;
            line-height: 1.5;
        }
        
        .copyright {
            font-size: 12px;
            color: #9ca3af;
            line-height: 1.4;
        }
        
        .link-text {
            font-size: 12px;
            color: #6b7280;
            margin-top: 20px;
            word-break: break-all;
            line-height: 1.4;
        }
        
        /* Mobile Responsive */
        @media screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
                width: 100% !important;
            }
            
            .header {
                padding: 30px 20px;
                border-radius: 0;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .tagline {
                font-size: 14px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .main-title {
                font-size: 24px;
                line-height: 1.2;
            }
            
            .subtitle {
                font-size: 16px;
                margin-bottom: 25px;
            }
            
            .cta-button {
                width: 100%;
                padding: 16px 20px;
                font-size: 16px;
                min-width: auto;
                box-sizing: border-box;
            }
            
            .features {
                flex-direction: column;
                gap: 30px;
                margin: 30px 0;
                padding: 0;
            }
            
            .feature {
                margin: 0;
                min-width: auto;
            }
            
            .feature-icon {
                width: 70px;
                height: 70px;
                font-size: 32px;
            }
            
            .feature-title {
                font-size: 16px;
            }
            
            .feature-desc {
                font-size: 14px;
            }
            
            .footer {
                padding: 20px 15px;
            }
            
            .footer-text {
                font-size: 13px;
                margin-bottom: 12px;
                line-height: 1.4;
            }
            
            .copyright {
                font-size: 11px;
                line-height: 1.3;
            }
            
            .link-text {
                font-size: 11px;
                padding: 0 5px;
            }
        }
        
        /* Tablet Responsive */
        @media screen and (max-width: 768px) and (min-width: 601px) {
            .email-container {
                margin: 10px;
                width: calc(100% - 20px);
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .features {
                gap: 15px;
            }
            
            .feature {
                margin: 0 5px;
            }
            
            .footer {
                padding: 25px 30px;
            }
            
            .footer-text {
                font-size: 13px;
            }
            
            .copyright {
                font-size: 11px;
            }
        }
        
        /* Very small screens */
        @media screen and (max-width: 480px) {
            .logo {
                font-size: 24px;
            }
            
            .main-title {
                font-size: 20px;
            }
            
            .subtitle {
                font-size: 14px;
            }
            
            .cta-button {
                padding: 14px 20px;
                font-size: 14px;
            }
            
            .feature-icon {
                width: 65px;
                height: 65px;
                font-size: 30px;
            }
            
            .footer {
                padding: 15px 10px;
            }
            
            .footer-text {
                font-size: 12px;
                margin-bottom: 10px;
            }
            
            .copyright {
                font-size: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <div class="logo">🌍 JourneyWise</div>
                <div class="tagline">Your Gateway to Amazing Adventures</div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <h1 class="main-title">Welcome to JourneyWise, ${userName}!</h1>
            <p class="subtitle">
                You're just one click away from unlocking a world of travel possibilities. 
                Verify your email to start planning your next adventure.
            </p>
            
            <a href="${url}" class="cta-button">
                ✨ Verify My Email Address
            </a>
            
            
            
            <div class="link-text">
                <p><strong>Having trouble with the button?</strong> Copy and paste this link into your browser:</p>
                <p style="color: #003C7D; margin-top: 8px;">${url}</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">Thanks for joining our community of adventurous travelers!</p>
            <p class="copyright">© 2024 JourneyWise. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

// OTP Email Template
export const generateOTPEmailHTML = (otp: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Security Code - JourneyWise</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Raleway', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-radius: 16px;
            overflow: hidden;
            width: 100%;
        }
        
        .header {
            background-color: #003C7D;
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .logo {
            font-family: 'Raleway', sans-serif;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .tagline {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 50px 40px;
            text-align: center;
        }
        
        .main-title {
            font-size: 28px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
        }
        
        .subtitle {
            font-size: 18px;
            color: #6b7280;
            margin-bottom: 35px;
        }
        
        .otp-container {
            background: #f8fafc;
            border: 2px solid #003C7D;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        
        .otp-code {
            font-size: 36px;
            font-weight: 700;
            color: #003C7D;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        
        .otp-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 15px;
            font-weight: 500;
        }
        
        .security-note {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 16px;
            margin: 30px 0;
            text-align: left;
        }
        
        .security-note strong {
            color: #92400e;
            font-weight: 600;
        }
        
        .security-note p {
            font-size: 14px;
            color: #92400e;
            margin: 0;
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 16px;
            line-height: 1.5;
        }
        
        .copyright {
            font-size: 12px;
            color: #9ca3af;
            line-height: 1.4;
        }
        
        /* Mobile Responsive */
        @media screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
                width: 100% !important;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .tagline {
                font-size: 14px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .main-title {
                font-size: 24px;
            }
            
            .subtitle {
                font-size: 16px;
                margin-bottom: 25px;
            }
            
            .otp-container {
                padding: 20px;
                margin: 20px 0;
            }
            
            .otp-code {
                font-size: 28px;
                letter-spacing: 4px;
            }
            
            .footer {
                padding: 20px 15px;
            }
            
            .footer-text {
                font-size: 13px;
                margin-bottom: 12px;
                line-height: 1.4;
            }
            
            .copyright {
                font-size: 11px;
                line-height: 1.3;
            }
        }
        
        /* Tablet Responsive */
        @media screen and (max-width: 768px) and (min-width: 601px) {
            .email-container {
                margin: 10px;
                width: calc(100% - 20px);
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .footer {
                padding: 25px 30px;
            }
            
            .footer-text {
                font-size: 13px;
            }
            
            .copyright {
                font-size: 11px;
            }
        }
        
        /* Very small screens */
        @media screen and (max-width: 480px) {
            .logo {
                font-size: 24px;
            }
            
            .main-title {
                font-size: 20px;
            }
            
            .subtitle {
                font-size: 14px;
            }
            
            .otp-code {
                font-size: 24px;
                letter-spacing: 2px;
            }
            
            .footer {
                padding: 15px 10px;
            }
            
            .footer-text {
                font-size: 12px;
                margin-bottom: 10px;
            }
            
            .copyright {
                font-size: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🌍 JourneyWise</div>
            <div class="tagline">Your Gateway to Amazing Adventures</div>
        </div>
        
        <div class="content">
            <h1 class="main-title">Security Code</h1>
            
            
            <div class="otp-container">
                <div class="otp-label">Your Security Code</div>
                <div class="otp-code">${otp}</div>
            </div>
            
            
        </div>
        
        <div class="footer">
            <p class="footer-text">Thanks for keeping your JourneyWise account secure!</p>
            <p class="copyright">© 2024 JourneyWise. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

// Reset Password Email Template
export const generateResetPasswordEmailHTML = (
  url: string,
  userName: string = "Traveler"
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - JourneyWise</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Raleway', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-radius: 16px;
            overflow: hidden;
            width: 100%;
        }
        
        .header {
            background-color: #003C7D;
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .logo {
            font-family: 'Raleway', sans-serif;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .tagline {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 50px 40px;
            text-align: center;
        }
        
        .main-title {
            font-size: 28px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
        }
        
        .subtitle {
            font-size: 18px;
            color: #6b7280;
            margin-bottom: 35px;
        }
        
        .cta-button {
            display: inline-block;
            background-color: #003C7D;
            color: white !important;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 8px 25px rgba(0, 60, 125, 0.3);
            transition: all 0.3s ease;
            margin-bottom: 30px;
            width: auto;
            min-width: 200px;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(0, 60, 125, 0.4);
            background-color: #002a5c;
        }
        
        .info-box {
            background: #f0f9ff;
            border-left: 4px solid #003C7D;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
        }
        
        .info-box h3 {
            color: #003C7D;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .info-box p {
            font-size: 14px;
            color: #374151;
            margin: 0;
        }
        
        .security-note {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 16px;
            margin: 30px 0;
            text-align: left;
        }
        
        .security-note strong {
            color: #92400e;
            font-weight: 600;
        }
        
        .security-note p {
            font-size: 14px;
            color: #92400e;
            margin: 0;
        }
        
        .link-text {
            font-size: 12px;
            color: #6b7280;
            margin-top: 20px;
            word-break: break-all;
            line-height: 1.4;
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 16px;
            line-height: 1.5;
        }
        
        .copyright {
            font-size: 12px;
            color: #9ca3af;
            line-height: 1.4;
        }
        
        /* Mobile Responsive */
        @media screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
                width: 100% !important;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .tagline {
                font-size: 14px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .main-title {
                font-size: 24px;
            }
            
            .subtitle {
                font-size: 16px;
                margin-bottom: 25px;
            }
            
            .cta-button {
                width: 100%;
                padding: 16px 20px;
                font-size: 16px;
                min-width: auto;
                box-sizing: border-box;
            }
            
            .info-box {
                padding: 15px;
                margin: 20px 0;
            }
            
            .info-box h3 {
                font-size: 16px;
            }
            
            .info-box p {
                font-size: 13px;
            }
            
            .footer {
                padding: 20px 15px;
            }
            
            .footer-text {
                font-size: 13px;
                margin-bottom: 12px;
                line-height: 1.4;
            }
            
            .copyright {
                font-size: 11px;
                line-height: 1.3;
            }
            
            .link-text {
                font-size: 11px;
                padding: 0 5px;
            }
        }
        
        /* Tablet Responsive */
        @media screen and (max-width: 768px) and (min-width: 601px) {
            .email-container {
                margin: 10px;
                width: calc(100% - 20px);
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .footer {
                padding: 25px 30px;
            }
            
            .footer-text {
                font-size: 13px;
            }
            
            .copyright {
                font-size: 11px;
            }
        }
        
        /* Very small screens */
        @media screen and (max-width: 480px) {
            .logo {
                font-size: 24px;
            }
            
            .main-title {
                font-size: 20px;
            }
            
            .subtitle {
                font-size: 14px;
            }
            
            .cta-button {
                padding: 14px 20px;
                font-size: 14px;
            }
            
            .footer {
                padding: 15px 10px;
            }
            
            .footer-text {
                font-size: 12px;
                margin-bottom: 10px;
            }
            
            .copyright {
                font-size: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🌍 JourneyWise</div>
            <div class="tagline">Your Gateway to Amazing Adventures</div>
        </div>
        
        <div class="content">
            <h1 class="main-title">Reset Password for ${userName}</h1>
            <p class="subtitle">
                We received a request to reset your password. Click the button below to create a new password for your JourneyWise account.
            </p>
            
            <a href="${url}" class="cta-button">
                🔑 Reset My Password
            </a>
            
            <div class="info-box">
                <h3>What happens next?</h3>
                <p>After clicking the button, you'll be redirected to a secure page where you can create a new password. Make sure to choose a strong password that you haven't used before.</p>
            </div>
            
            <div class="security-note">
                <p><strong>🔒 Security Note:</strong> This password reset link will expire in 1 hour. If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.</p>
            </div>
            
            <div class="link-text">
                <p><strong>Having trouble with the button?</strong> Copy and paste this link into your browser:</p>
                <p style="color: #003C7D; margin-top: 8px;">${url}</p>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">Thanks for keeping your JourneyWise account secure!</p>
            <p class="copyright">© 2024 JourneyWise. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};
