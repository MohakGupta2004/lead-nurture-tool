import type { Realtor } from "./RealtorInterface.js";

export const basicTemplateProvider = (
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
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #111827;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .logo {
            max-height: 80px;
            width: auto;
            display: block;
            margin-bottom: 40px;
        }
        .content {
            font-size: 17px;
            color: #374151;
        }
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #f3f4f6;
            font-size: 13px;
            color: #9ca3af;
        }
        .footer a {
            color: #6b7280;
            text-decoration: underline;
        }
        h1, h2, h3 {
            color: #111827;
            margin-top: 0;
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        a {
            color: #2563eb;
            text-decoration: none;
        }
        .signature {
            margin-top: 40px;
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .profile-img {
            width: 64px;
            height: 64px;
            object-fit: cover;
            border-radius: 12px; /* Soft square */
            background-color: #f3f4f6;
        }
    </style>
</head>
<body>
    <div class="container">
        ${realtor.brandLogoUrl ? `<img src="${realtor.brandLogoUrl}" alt="Logo" class="logo"/>` : ''}
        
        <div class="content">
            ${body}
        </div>
        
        <div class="signature">
            ${realtor.profileImageUrl ? `<img src="${realtor.profileImageUrl}" alt="Profile" class="profile-img"/>` : ''}
            <div>
                <p style="margin: 0 0 2px 0; font-weight: 700; color: #111827;">${realtor.professionalEmail ?? "Your Realtor"}</p>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">${realtor.phNo ?? ""}</p>
            </div>
        </div>

        <div class="footer">
            <p style="margin: 0;">
                <a href="${unsubscribeUrl}">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>`;