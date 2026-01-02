import type { Realtor } from "./RealtorInterface.js";

export const modernTemplateProvider = (
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

<body style="margin:0; padding:0; background-color:#f9fafb; font-family: Arial, Helvetica, sans-serif; color:#374151;">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="padding:32px 0;">

      <!-- MAIN CARD -->
      <table width="600" cellpadding="0" cellspacing="0" border="0"
        style="width:600px; max-width:600px; background-color:#ffffff; border:1px solid #f3f4f6; border-radius:12px;">

        <!-- HEADER -->
        <tr>
          <td align="center" style="padding:40px 40px 24px 40px;">
            ${
              realtor.brandLogoUrl
                ? `<img src="${realtor.brandLogoUrl}" alt="Logo" height="56" style="display:block; margin-bottom:20px;" />`
                : `<div style="font-size:22px; font-weight:800; color:#111827; letter-spacing:-0.02em; margin-bottom:20px;">
                    ${realtor.brokerageName ?? "REAL ESTATE"}
                   </div>`
            }

            <div style="font-size:30px; font-weight:800; line-height:1.2; color:#111827;">
              ${subject}
            </div>
          </td>
        </tr>

        <!-- GREETING -->
        <tr>
          <td style="padding:0 40px 16px 40px; font-size:16px; color:#4b5563;">
            <strong>Hi ${leadName || "there"},</strong>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:0 40px 32px 40px; font-size:16px; line-height:1.7; color:#4b5563;">
            ${body}
          </td>
        </tr>

        <!-- STATS ROW -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
              style="border-top:1px solid #f3f4f6; border-bottom:1px solid #f3f4f6;">
              <tr>
                <td align="center" style="padding:24px 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding:0 24px;">
                        <div style="font-size:28px; font-weight:800; color:#2563eb;">
                          ${realtor.yearsInBusiness ?? "-"}
                        </div>
                        <div style="font-size:11px; color:#6b7280; letter-spacing:1px; font-weight:700;">
                          YEARS
                        </div>
                      </td>

                      <td align="center" style="padding:0 24px;">
                        <div style="font-size:28px; font-weight:800; color:#2563eb;">
                          ${(realtor.markets ?? []).length}
                        </div>
                        <div style="font-size:11px; color:#6b7280; letter-spacing:1px; font-weight:700;">
                          MARKETS
                        </div>
                      </td>

                      <td align="center" style="padding:0 24px;">
                        <div style="font-size:28px; font-weight:800; color:#2563eb;">
                          TOP
                        </div>
                        <div style="font-size:11px; color:#6b7280; letter-spacing:1px; font-weight:700;">
                          AGENT
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        ${
          realtor.calendlyLink
            ? `
            <tr>
              <td style="padding:24px 40px 40px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center">
                      <a href="${realtor.calendlyLink}"
                        style="display:block; width:100%; background-color:#2563eb;
                               color:#ffffff; text-decoration:none; padding:16px 0;
                               font-size:15px; font-weight:700; border-radius:8px;">
                        Schedule Consultation
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            `
            : ""
        }

        <!-- SIGNATURE -->
        <tr>
          <td style="padding:32px 40px; border-top:1px solid #f3f4f6;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                ${
                  realtor.profileImageUrl
                    ? `
                    <td valign="top" style="padding-right:16px;">
                      <img src="${realtor.profileImageUrl}"
                        width="72" height="72"
                        style="display:block; border-radius:50%; border:2px solid #ffffff;" />
                    </td>
                    `
                    : ""
                }

                <td valign="top" style="font-size:14px; line-height:1.6; color:#4b5563;">
                  <strong style="font-size:18px; color:#111827;">
                    ${realtor.firstName} ${realtor.lastName}
                  </strong><br/>
                  <span style="color:#4f46e5; font-weight:600;">
                    ${realtor.brokerageName ?? "Real Estate Professional"}
                  </span><br/>
                  ${realtor.phNo ?? ""}<br/>
                  ${realtor.professionalEmail ?? ""}

                  ${
                    realtor.markets && realtor.markets.length
                      ? `
                      <table cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                        <tr>
                          <td style="font-size:11px; color:#9ca3af; letter-spacing:1px; font-weight:700;">
                            MARKET EXPERTISE
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size:14px; font-weight:600; color:#2563eb;">
                            ${realtor.markets.join(" • ")}
                          </td>
                        </tr>
                      </table>
                      `
                      : ""
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td align="center"
            style="background-color:#f9fafb; padding:24px 40px; font-size:12px; color:#9ca3af; border-top:1px solid #f3f4f6;">
            © ${new Date().getFullYear()} ${realtor.brokerageName ?? "All rights reserved"}<br/><br/>
            <a href="${unsubscribeUrl}" style="color:#6b7280; text-decoration:underline;">
              Unsubscribe
            </a>
          </td>
        </tr>

      </table>
      <!-- END CARD -->

    </td>
  </tr>
</table>

</body>
</html>
`;
