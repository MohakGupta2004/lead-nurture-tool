import type { Realtor } from "./RealtorInterface.js";

const safe = (value?: string | null) => value?.trim() || "";
const exists = (value?: string | null) => Boolean(value?.trim());

export const basicTemplateProvider = (
  subject: string,
  body: string,
  realtor: Realtor,
  unsubscribeUrl: string,
  leadName?: string
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif; color:#1f2937;">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="padding:30px 0;">

      <!-- MAIN CARD -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" 
        style="max-width:600px; width:100%; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

        <!-- TOP BRAND BAR -->
        <tr>
          <td style="background-color:#0f3d3e; padding:14px 24px; color:#ffffff; font-size:13px; letter-spacing:0.5px;">
            ${safe(realtor.brokerageName) || "REAL ESTATE PROFESSIONAL"}
          </td>
        </tr>

        <!-- HEADER LOGO -->
        ${exists(realtor.brandLogoUrl) ? `
        <tr>
          <td align="center" style="padding:28px 24px 10px 24px;">
            <img 
              src="${realtor.brandLogoUrl}" 
              alt="Logo" 
              height="36" 
              style="display:block;"
            />
          </td>
        </tr>` : ``}

        <!-- GREETING -->
        <tr>
          <td style="padding:20px 32px 10px 32px; font-size:15px;">
            <strong>Hi ${leadName || "there"},</strong>
          </td>
        </tr>

        <!-- MESSAGE BODY -->
        <tr>
          <td style="padding:0 32px 24px 32px; font-size:14px; line-height:1.7; color:#374151;">
            ${body}
          </td>
        </tr>

        <!-- SECTION DIVIDER -->
        <tr>
          <td style="padding:0 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-top:1px solid #e5e7eb;"></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA TEXT -->
        <tr>
          <td style="padding:24px 32px; font-size:14px; line-height:1.6; background-color:#f9fafb;">
            Feel free to contact me if you have any questions or would like to explore suitable properties. 
            I’d be happy to guide you through the process.
          </td>
        </tr>

        <!-- SIGNATURE -->
        <tr>
          <td style="padding:20px 32px 10px 32px; font-size:14px;">
            Regards,<br/>
            <strong>${realtor.firstName} ${realtor.lastName}</strong>
          </td>
        </tr>

        <!-- AGENT INFO CARD -->
        <tr>
          <td style="padding:16px 32px 28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" 
              style="border:1px solid #e5e7eb; border-radius:12px; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);">
              <tr>
                <td style="padding:24px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      ${exists(realtor.profileImageUrl) ? `
                      <td valign="top" style="padding-right:20px;">
                        <img 
                          src="${realtor.profileImageUrl}" 
                          width="72" 
                          height="72" 
                          style="border-radius:50%; display:block; border:3px solid #ffffff; box-shadow:0 4px 12px rgba(0,0,0,0.1);"
                          alt="Agent"
                        />
                      </td>` : ``}

                      <td valign="top" style="font-size:13px; line-height:1.8; color:#374151;">
                        <div style="margin-bottom:8px;">
                          <strong style="font-size:16px; color:#1f2937;">${realtor.firstName} ${realtor.lastName}</strong>
                        </div>
                        <div style="margin-bottom:4px; color:#6b7280;">
                          ${safe(realtor.brokerageName)}
                        </div>
                        <div style="margin-bottom:4px;">
                          📞 ${safe(realtor.phNo)}
                        </div>
                        <div style="margin-bottom:8px;">
                          ✉️ ${safe(realtor.professionalEmail)}
                        </div>
                        ${realtor.markets && realtor.markets.length > 0 ? `
                        <div style="margin-top:12px; padding-top:8px; border-top:1px solid #e5e7eb;">
                          <div style="font-size:12px; color:#6b7280; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Serving Areas</div>
                          <div style="color:#059669; font-weight:500;">
                            📍 ${realtor.markets.join(' • ')}
                          </div>
                        </div>` : ''}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td align="center" style="padding:18px 24px; font-size:12px; color:#6b7280; background-color:#f9fafb;">
            Don’t want to receive alerts?
            <a href="${unsubscribeUrl}" style="color:#2563eb; text-decoration:underline;">Unsubscribe</a>
          </td>
        </tr>

      </table>
      <!-- END MAIN CARD -->

    </td>
  </tr>
</table>

</body>
</html>
`;
