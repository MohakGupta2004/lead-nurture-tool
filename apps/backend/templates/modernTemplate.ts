import type { Realtor } from "./RealtorInterface.js";

export const modernTemplateProvider = (subject: string, body: string, realtor: Realtor, unsubscribeUrl: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <!-- Import Premium Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            margin: 0;
            padding: 0;
            background-color: #f9fafb; /* Soft Gray Background */
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid #f3f4f6;
        }
        .header {
            padding: 48px 40px 24px 40px;
            text-align: center;
            background-color: #ffffff;
        }
        .logo {
            max-height: 80px;
            width: auto;
            margin-bottom: 24px;
            display: inline-block;
        }
        .subject-line {
            font-family: 'Outfit', sans-serif; /* Premium Tech Heading */
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.02em;
            line-height: 1.1;
            color: #111827;
            margin: 0;
        }
        .content {
            padding: 0 40px 48px 40px;
            font-size: 17px; /* Slightly larger for readability */
            color: #4b5563;
            text-align: left;
        }
        .stats-row {
            display: flex;
            justify-content: center;
            gap: 48px;
            margin: 40px 0;
            padding: 32px 0;
            border-top: 1px solid #f3f4f6;
            border-bottom: 1px solid #f3f4f6;
        }
        .stat-item {
            text-align: center;
        }
        .stat-value {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            font-weight: 800;
            background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1;
            margin-bottom: 8px;
        }
        .stat-label {
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 700;
        }
        .button {
            display: block;
            width: 100%;
            text-align: center;
            background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); /* Gradient Button */
            color: #ffffff;
            padding: 18px 0;
            text-decoration: none;
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            font-size: 16px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
            transition: transform 0.1s;
        }
        .signature-section {
            margin-top: 48px;
            padding-top: 32px;
            border-top: 1px solid #f3f4f6;
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .profile-img {
            width: 72px;
            height: 72px;
            object-fit: cover;
            border-radius: 50%;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 2px solid #ffffff;
        }
        .footer {
            background-color: #f9fafb;
            padding: 32px 40px;
            text-align: center;
            font-size: 13px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }
        .footer a {
            color: #6b7280;
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .container { margin: 0; border-radius: 0; border: none; }
            .header, .content, .footer { padding: 32px 24px; }
            .stats-row { gap: 24px; }
            .stat-value { font-size: 28px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            ${realtor.brandLogoUrl ? `<img src="${realtor.brandLogoUrl}" alt="Logo" class="logo"/>` : `<div style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 24px; letter-spacing: -0.03em; margin-bottom: 24px; color: #111827;">${realtor.brokerageName ?? 'REAL ESTATE'}</div>`}
            
            <h1 class="subject-line">${subject}</h1>
        </div>
        
        <div class="content">
            ${body}
            
            <div class="stats-row">
                <div class="stat-item">
                    <div class="stat-value">${realtor.yearsInBusiness != null ? realtor.yearsInBusiness : '-'}</div>
                    <div class="stat-label">Years</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${(realtor.markets ?? []).length}</div>
                    <div class="stat-label">Markets</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">Top</div>
                    <div class="stat-label">Agent</div>
                </div>
            </div>
            
            ${realtor.calendlyLink ? `<div style="margin-top: 40px;"><a href="${realtor.calendlyLink}" class="button">Schedule Consultation</a></div>` : ''}

            <div class="signature-section">
                ${realtor.profileImageUrl ? `<img src="${realtor.profileImageUrl}" alt="Profile" class="profile-img"/>` : ''}
                <div>
                    <p style="font-family: 'Outfit', sans-serif; margin: 0 0 4px 0; font-weight: 700; color: #111827; font-size: 18px; letter-spacing: -0.01em;">${realtor.firstName + " " + realtor.lastName || 'Your Realtor'}</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">${realtor.phNo ?? ''}</p>
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
