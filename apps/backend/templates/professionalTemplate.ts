import type { Realtor } from "./RealtorInterface.js";

const safe = (value?: string | null) => value?.trim() || "";

export const professionalTemplateProvider = (
  subject: string,
  body: string,
  realtor: Realtor,
  unsubscribeUrl: string,
  leadName?: string
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>

<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, Helvetica, sans-serif; color:#4b5563;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f4f6">
  <tr>
    <td align="center" style="padding:24px 0;">

      <!-- MAIN CONTAINER -->
      <table width="600" cellpadding="0" cellspacing="0" border="0"
        style="width:600px; max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden;">

        <!-- TOP BAR -->
        <tr>
          <td align="center" bgcolor="#0e3f4f"
            style="padding:12px 20px; font-size:12px; color:#e5e7eb; font-weight:600; letter-spacing:1px;">
            ${(realtor.brokerageName ?? "REAL ESTATE").toUpperCase()}
          </td>
        </tr>

        <!-- LOGO -->
        ${
          realtor.brandLogoUrl
            ? `
            <tr>
              <td align="center" style="padding:36px 20px 16px 20px;">
                <img src="${realtor.brandLogoUrl}"
                  alt="Logo"
                  width="150"
                  style="display:block; max-width:150px; height:auto;" />
              </td>
            </tr>
            `
            : ""
        }

        <!-- SUBJECT -->
        <tr>
          <td align="center" style="padding:16px 40px 8px 40px;">
            <div style="font-size:28px; font-weight:700; line-height:1.2; color:#111827;">
              ${subject}
            </div>
          </td>
        </tr>

        <!-- GREETING -->
        <tr>
          <td style="padding:8px 40px 0 40px; font-size:16px;">
            <strong>Hi ${leadName || "there"},</strong>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:16px 40px 40px 40px; font-size:16px; line-height:1.6;">
            ${body}

            ${
              realtor.calendlyLink
                ? `
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
                  <tr>
                    <td align="center">
                      <a href="${realtor.calendlyLink}"
                        style="display:inline-block; padding:14px 28px;
                               background-color:#0e3f4f; color:#ffffff;
                               text-decoration:none; font-weight:600;
                               font-size:15px; border-radius:6px;">
                        Schedule a Visit
                      </a>
                    </td>
                  </tr>
                </table>
                `
                : ""
            }
          </td>
        </tr>

        <!-- AGENT SECTION -->
        <tr>
          <td bgcolor="#0e3f4f" style="padding:28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                ${
                  realtor.profileImageUrl
                    ? `
                    <td width="88" valign="top" style="padding-right:24px;">
                      <img src="${realtor.profileImageUrl}"
                        width="88" height="88"
                        style="display:block; border-radius:50%; border:3px solid #ffffff;" />
                    </td>
                    `
                    : ""
                }

                <td valign="top" style="color:#ffffff; font-size:14px; line-height:1.6;">
                  <div style="font-size:20px; font-weight:700; margin-bottom:6px;">
                    ${realtor.firstName} ${realtor.lastName}
                  </div>

                  <div style="color:#bfdbfe; font-size:15px; font-weight:600; margin-bottom:12px;">
                    ${realtor.brokerageName ?? "Real Estate Professional"}
                  </div>

                  ${realtor.phNo ? `<div style="margin-bottom:4px;">${realtor.phNo}</div>` : ""}
                  ${realtor.professionalEmail ? `<div>${realtor.professionalEmail}</div>` : ""}

                  ${
                    realtor.markets && realtor.markets.length
                      ? `
                      <div style="margin-top:14px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.25);">
                        <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#e5e7eb; margin-bottom:6px;">
                          Coverage Areas
                        </div>
                        <div style="font-size:14px; font-weight:600; color:#bfdbfe;">
                          ${realtor.markets.join(" • ")}
                        </div>
                      </div>
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
          <td align="center" bgcolor="#f9fafb"
            style="padding:20px 40px; font-size:13px; color:#9ca3af; border-top:1px solid #e5e7eb;">
            <div style="margin-bottom:8px;">
              © ${new Date().getFullYear()} ${realtor.brokerageName ?? "All rights reserved"}.
            </div>
            <a href="${unsubscribeUrl}" style="color:#6b7280; text-decoration:underline;">
              Unsubscribe
            </a>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>
`;
