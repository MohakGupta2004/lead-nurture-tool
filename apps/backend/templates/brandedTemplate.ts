import type { Realtor } from "./RealtorInterface.js";

export const brandedTemplateProvider = (
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

<body style="margin:0; padding:0; background-color:#f1f5f9; font-family: Arial, Helvetica, sans-serif; color:#334155;">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="padding:32px 0;">

      <!-- MAIN CONTAINER -->
      <table width="600" cellpadding="0" cellspacing="0" border="0"
        style="width:600px; max-width:600px; background-color:#ffffff; border:1px solid #e2e8f0;">

        <!-- TOP NAVY BAR -->
        <tr>
          <td style="background-color:#1e3a8a; height:6px; font-size:0; line-height:0;">
            &nbsp;
          </td>
        </tr>

        <!-- HEADER -->
        <tr>
          <td style="padding:32px 40px 20px 40px; border-bottom:1px solid #f1f5f9;">
            ${
              realtor.brandLogoUrl
                ? `<img src="${realtor.brandLogoUrl}" alt="Logo" height="48" style="display:block;" />`
                : `<div style="font-size:22px; font-weight:700; color:#1e3a8a; letter-spacing:1px; text-transform:uppercase;">
                    ${realtor.brokerageName ?? "Real Estate"}
                   </div>`
            }
          </td>
        </tr>

        <!-- GREETING -->
        <tr>
          <td style="padding:24px 40px 0 40px; font-size:15px; color:#1e293b;">
            <strong>Hi ${leadName || "there"},</strong>
          </td>
        </tr>

        <!-- CONTENT -->
        <tr>
          <td style="padding:24px 40px 32px 40px; font-size:15px; line-height:1.7; color:#1e293b;">
            <div style="font-size:24px; font-weight:700; color:#0f172a; margin-bottom:24px;">
              ${subject}
            </div>

            ${body}

            ${
              realtor.calendlyLink
                ? `
                <table cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">
                  <tr>
                    <td>
                      <a href="${realtor.calendlyLink}"
                        style="display:inline-block; background-color:#1e3a8a; color:#ffffff;
                               padding:14px 28px; text-decoration:none; font-size:13px;
                               font-weight:700; letter-spacing:1px; text-transform:uppercase;">
                        Schedule Meeting
                      </a>
                    </td>
                  </tr>
                </table>
                `
                : ""
            }
          </td>
        </tr>

        <!-- REALTOR CARD -->
        <tr>
          <td style="padding:0 40px 40px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
              style="background-color:#f8fafc; border:1px solid #e2e8f0;">
              <tr>
                <td style="padding:24px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      ${
                        realtor.profileImageUrl
                          ? `
                          <td valign="top" style="padding-right:20px;">
                            <img src="${realtor.profileImageUrl}"
                              width="80" height="80"
                              style="display:block; border-radius:50%; border:1px solid #cbd5e1;" />
                          </td>
                          `
                          : ""
                      }

                      <td valign="top" style="font-size:14px; line-height:1.6; color:#1e293b;">
                        <strong style="font-size:16px; color:#0f172a;">
                          ${realtor.firstName} ${realtor.lastName}
                        </strong><br/>

                        <span style="color:#1e3a8a; font-weight:600;">
                          ${realtor.brokerageName ?? ""}
                        </span><br/>

                        ${realtor.phNo ?? ""}<br/>
                        ${realtor.professionalEmail ?? ""}

                        ${
                          realtor.markets && realtor.markets.length
                            ? `
                            <table cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                              <tr>
                                <td style="font-size:11px; color:#64748b; font-weight:700;
                                           text-transform:uppercase; letter-spacing:1px;">
                                  Serving Markets
                                </td>
                              </tr>
                              <tr>
                                <td style="font-size:14px; color:#1e3a8a; font-weight:600;">
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
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#0f172a; padding:32px 40px; font-size:12px; color:#94a3b8;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="top">
                  <strong style="color:#f1f5f9;">
                    ${realtor.brokerageName ?? "Real Estate"}
                  </strong><br/>
                  © ${new Date().getFullYear()} All rights reserved.
                </td>
                <td align="right" valign="top">
                  <a href="${unsubscribeUrl}"
                     style="color:#cbd5e1; text-decoration:underline;">
                    Unsubscribe
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!-- END MAIN -->

    </td>
  </tr>
</table>

</body>
</html>
`;
