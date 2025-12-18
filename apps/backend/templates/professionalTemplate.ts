import type { Realtor } from "./RealtorInterface.js";

const safe = (value?: string | null) => value?.trim() || '';

const exists = (value?: string | null) => Boolean(value?.trim());

const joinIfExists = (items: (string | null | undefined)[], sep = '<br/>') =>
    items.filter(Boolean).join(sep);



export const professionalTemplateProvider = (
    subject: string,
    body: string,
    realtor: Realtor,
    unsubscribeUrl: string
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <!-- Import Premium Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Outfit:wght@500;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'DM Sans', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #4b5563;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
        }
        .top-bar {
            background-color: #0e3f4f; /* Dark Teal */
            padding: 12px 40px;
            text-align: center;
            font-size: 12px;
            color: #e5e7eb;
            font-weight: 500;
            letter-spacing: 0.05em;
        }
        .header {
            padding: 48px 40px 24px 40px;
            text-align: center;
        }
        .logo {
            max-height: 70px;
            width: auto;
            display: block;
            margin: 0 auto;
        }
        .hero-text {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 24px 0;
            line-height: 1.2;
            text-align: center;
        }
        .content {
            padding: 0 48px 48px 48px;
            font-size: 16px;
            color: #4b5563;
        }
        .button {
            display: inline-block;
            background-color: #0e3f4f; /* Dark Teal */
            color: #ffffff;
            padding: 16px 32px;
            text-decoration: none;
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            font-size: 15px;
            border-radius: 50px; /* Pill shape */
            margin-top: 32px;
            box-shadow: 0 4px 6px -1px rgba(14, 63, 79, 0.2);
            transition: transform 0.1s;
        }
        .agent-section {
            margin: 0 48px 48px 48px;
            background-color: #0e3f4f; /* Dark Teal */
            border-radius: 16px;
            padding: 32px;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 24px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .agent-profile-img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 3px solid #ffffff;
            object-fit: cover;
            flex-shrink: 0;
        }
        .agent-details {
            flex: 1;
        }
        .footer {
            background-color: #f9fafb;
            padding: 32px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 13px;
        }
        .footer a {
            color: #6b7280;
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .container { margin: 0; border-radius: 0; }
            .content, .header, .agent-section { padding: 32px 24px; margin: 0; }
            .agent-section { margin: 0 24px 32px 24px; flex-direction: column; text-align: center; }
            .hero-text { font-size: 28px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="top-bar">
            ${realtor.brokerageName ? realtor.brokerageName.toUpperCase() : 'REAL ESTATE'}
        </div>

        <div class="header">
            ${realtor.brandLogoUrl ? `<img src="${realtor.brandLogoUrl}" alt="Logo" class="logo"/>` : ''}
        </div>

        <div class="content">
            <h1 class="hero-text">${subject}</h1>
            
            ${body}
            
            ${realtor.calendlyLink ? `<div style="text-align: center;"><a href="${realtor.calendlyLink}" class="button">Schedule a Visit</a></div>` : ''}
        </div>

        <div class="agent-section">
            ${realtor.profileImageUrl ? `<img src="${realtor.profileImageUrl}" alt="Agent" class="agent-profile-img"/>` : ''}
            <div class="agent-details">
                <div style="font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 4px;">Your Realtor</div>
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">${realtor.brokerageName ?? 'Real Estate Agent'}</div>
                <div style="font-size: 13px; line-height: 1.6;">
                    ${realtor.phNo ? `<div>${realtor.phNo}</div>` : ''}
                    ${realtor.professionalEmail ? `<div>${realtor.professionalEmail}</div>` : ''}
                </div>
            </div>
        </div>

        <div class="footer">
            <p style="margin: 0 0 16px 0;">
                © ${new Date().getFullYear()} ${realtor.brokerageName ?? 'All rights reserved'}.
            </p>
            <a href="${unsubscribeUrl}">Unsubscribe</a>
        </div>
    </div>
</body>
</html>`;
