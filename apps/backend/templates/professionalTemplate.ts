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
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: 'DM Sans', Helvetica, Arial, sans-serif; color:#4b5563;">

<!-- Wrapper Table -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f4f6">
    <tr>
        <td align="center" style="padding:20px 0;">
            <!-- Main Container -->
            <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius:12px; overflow:hidden;">
                
                <!-- Top Bar -->
                <tr>
                    <td align="center" bgcolor="#0e3f4f" style="padding:12px 20px; font-size:12px; color:#e5e7eb; font-weight:500; letter-spacing:0.05em;">
                        ${realtor.brokerageName ? realtor.brokerageName.toUpperCase() : 'REAL ESTATE'}
                    </td>
                </tr>

                <!-- Header / Logo -->
                <tr>
                    <td align="center" style="padding:40px 20px 20px 20px;">
                        ${realtor.brandLogoUrl ? `<img src="${realtor.brandLogoUrl}" alt="Logo" width="150" style="display:block; max-width:150px; height:auto;" />` : ''}
                    </td>
                </tr>

                <!-- Hero / Subject -->
                <tr>
                    <td align="center" style="padding:20px 40px 20px 40px;">
                        <h1 style="margin:0; font-family:'Outfit', sans-serif; font-size:28px; font-weight:700; line-height:1.2; color:#111827;">${subject}</h1>
                    </td>
                </tr>

                <!-- Body Content -->
                <tr>
                    <td style="padding:0 40px 40px 40px; font-size:16px; line-height:1.6; color:#4b5563;">
                        <p>${body}</p>
                        ${realtor.calendlyLink ? `
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
                            <tr>
                                <td align="center">
                                    <a href="${realtor.calendlyLink}" style="display:inline-block; padding:16px 32px; background-color:#0e3f4f; color:#ffffff; text-decoration:none; font-family:'Outfit', sans-serif; font-weight:600; font-size:15px; border-radius:50px;">Schedule a Visit</a>
                                </td>
                            </tr>
                        </table>` : ''}
                    </td>
                </tr>

                <!-- Agent Section -->
                <tr>
                    <td bgcolor="#0e3f4f" style="padding:20px 40px; border-radius:0 0 12px 12px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                ${realtor.profileImageUrl ? `
                                <td width="80" valign="top" style="padding-right:20px;">
                                    <img src="${realtor.profileImageUrl}" alt="Agent" width="80" height="80" style="border-radius:50%; display:block; border:3px solid #ffffff;"/>
                                </td>` : ''}
                                <td valign="top" style="color:#ffffff; font-size:14px; line-height:1.5;">
                                    <div style="font-family:'Outfit', sans-serif; font-weight:700; font-size:18px; margin-bottom:4px;">${realtor.firstName + ' ' + realtor.lastName}</div>
                                    <div style="opacity:0.9; margin-bottom:8px;">${realtor.brokerageName ?? 'Real Estate Agent'}</div>
                                    <div>
                                        ${realtor.phNo ? `<div>${realtor.phNo}</div>` : ''}
                                        ${realtor.professionalEmail ? `<div>${realtor.professionalEmail}</div>` : ''}
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td align="center" bgcolor="#f9fafb" style="padding:20px 40px; font-size:13px; color:#9ca3af; border-top:1px solid #e5e7eb;">
                        <p style="margin:0 0 8px 0;">© ${new Date().getFullYear()} ${realtor.brokerageName ?? 'All rights reserved'}.</p>
                        <a href="${unsubscribeUrl}" style="color:#6b7280; text-decoration:underline;">Unsubscribe</a>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
`;
