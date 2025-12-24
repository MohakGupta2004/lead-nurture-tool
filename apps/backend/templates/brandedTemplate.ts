import type { Realtor } from "./RealtorInterface.js";

export const brandedTemplateProvider = (
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
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Libre Franklin', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #334155;
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-top: 6px solid #1e3a8a; /* Thicker Navy Top Bar */
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
            padding: 48px 48px 24px 48px;
            text-align: left;
            border-bottom: 1px solid #f1f5f9;
        }
        .logo {
            max-height: 80px;
            width: auto;
            display: block;
        }
        .content {
            padding: 48px;
            font-size: 16px;
            color: #1e293b;
        }
        .subject-line {
            font-family: 'Libre Franklin', sans-serif;
            font-size: 26px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 32px;
            line-height: 1.3;
            letter-spacing: -0.02em;
        }
        .button {
            display: inline-block;
            background-color: #1e3a8a; /* Navy Button */
            color: #ffffff;
            padding: 16px 32px;
            border-radius: 0px; /* Sharp corners for corporate feel */
            text-decoration: none;
            font-family: 'Libre Franklin', sans-serif;
            font-weight: 600;
            font-size: 14px;
            margin-top: 32px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .realtor-card {
            margin: 48px 48px 0 48px;
            padding: 32px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            gap: 24px;
        }
        .profile-img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border: 1px solid #cbd5e1;
        }
        .footer {
            background-color: #0f172a; /* Dark Navy Footer */
            padding: 48px;
            font-size: 13px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .footer p {
            margin: 0;
            line-height: 1.5;
        }
        .footer a {
            color: #cbd5e1;
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .container { margin: 0; border: none; border-top: 6px solid #1e3a8a; }
            .header, .content, .realtor-card, .footer { padding: 32px; margin: 0; }
            .realtor-card { margin: 32px; flex-direction: column; text-align: center; }
            .footer { flex-direction: column; gap: 24px; text-align: center; align-items: center; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            ${realtor.brandLogoUrl
        ? `<img src="${realtor.brandLogoUrl}" alt="Brand Logo" class="logo"/>`
        : `<h2 style="font-family: 'Libre Franklin', sans-serif; margin: 0; color: #1e3a8a; font-size: 24px; text-transform: uppercase; letter-spacing: 0.05em;">${realtor.brokerageName ?? "Real Estate"}</h2>`
    }
        </div>
        
        <div class="content">
            <h1 class="subject-line">${subject}</h1>
            
            ${body}
            
            ${realtor.calendlyLink
        ? `<div><a href="${realtor.calendlyLink}" class="button">Schedule Meeting</a></div>`
        : ""
    }
        </div>

        <div class="realtor-card">
            ${realtor.profileImageUrl ? `<img src="${realtor.profileImageUrl}" alt="Profile" class="profile-img"/>` : ''}
            <div>
                <p style="font-family: 'Libre Franklin', sans-serif; margin: 0 0 4px 0; font-weight: 700; color: #0f172a; font-size: 16px;">${realtor.brokerageName ?? ""}</p>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #334155;">${realtor.firstName + " " + realtor.lastName}</p>
                <p style="margin: 0; font-size: 14px; color: #64748b;">${realtor.phNo ?? ""}</p>
            </div>
        </div>

        <div class="footer">
            <div style="max-width: 60%;">
                <p style="font-family: 'Libre Franklin', sans-serif; font-weight: 600; color: #f1f5f9; margin-bottom: 8px;">${realtor.brokerageName ?? "Real Estate"}</p>
                <p>Serving: ${(realtor.markets ?? []).join(", ")}</p>
                <p style="margin-top: 16px;">© ${new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div>
                <a href="${unsubscribeUrl}">Unsubscribe</a>
            </div>
        </div>
    </div>
</body>
</html>`;