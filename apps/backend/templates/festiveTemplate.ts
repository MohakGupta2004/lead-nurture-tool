import type { Realtor } from "./RealtorInterface";

interface FestiveTemplateProps {
  body: string;
  subject: string;
  realtor: Realtor;
  unsubscribeUrl: string;
  leadName?: string;
}

export const festiveTemplateProvider = ({
  body,
  subject,
  realtor,
  unsubscribeUrl,
  leadName,
}: FestiveTemplateProps) => {
  const formattedBody = body.replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .header {
      background: linear-gradient(135deg, #d4af37 0%, #f3e5ab 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 300;
      letter-spacing: 1px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .content {
      padding: 40px 30px;
    }
    .message {
      font-size: 16px;
      color: #4a4a4a;
      margin-bottom: 30px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #eeeeee;
    }
    .realtor-info {
      margin-bottom: 20px;
    }
    .realtor-name {
      font-weight: bold;
      color: #2c3e50;
      font-size: 18px;
    }
    .realtor-brokerage {
      color: #7f8c8d;
      font-size: 14px;
      margin-top: 4px;
    }
    .contact-info {
      font-size: 13px;
      color: #95a5a6;
      margin-top: 10px;
    }
    .unsubscribe {
      font-size: 12px;
      color: #bdc3c7;
      margin-top: 20px;
    }
    .unsubscribe a {
      color: #95a5a6;
      text-decoration: underline;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        border-radius: 0 !important;
      }
      .content {
        padding: 20px !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ Season's Greetings ✨</h1>
    </div>
    
    <div class="content">
      <!-- Greeting -->
      <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">Hi ${leadName || "there"},</p>
      
      <div class="message">
        ${formattedBody}
      </div>
    </div>

    <div class="footer">
      <div class="realtor-info" style="margin-bottom: 24px; text-align: center;">
        ${realtor.profileImageUrl ? `
        <div style="margin-bottom: 16px;">
          <img src="${realtor.profileImageUrl}" alt="Realtor" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid #d4af37; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); display: inline-block;" />
        </div>` : ''}
        <div class="realtor-name" style="font-weight: bold; color: #2c3e50; font-size: 20px; margin-bottom: 4px;">${realtor.firstName + " " + realtor.lastName || 'Your Realtor'}</div>
        ${realtor.brokerageName ? `<div class="realtor-brokerage" style="color: #7f8c8d; font-size: 16px; margin-bottom: 12px;">${realtor.brokerageName}</div>` : ''}
        ${realtor.markets && realtor.markets.length > 0 ? `
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
          <div style="font-size: 12px; color: #95a5a6; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Celebrating with clients in</div>
          <div style="color: #d4af37; font-weight: 600; font-size: 14px;">
            🎉 ${realtor.markets.join(' • ')}
          </div>
        </div>` : ''}
      </div>
      
      <div class="contact-info">
        ${realtor.professionalEmail ? `<div>${realtor.professionalEmail}</div>` : ''}
        ${realtor.phNo ? `<div>${realtor.phNo}</div>` : ''}
      </div>

      <div class="unsubscribe">
        <p>You received this email because you are subscribed to updates from ${realtor.firstName + " " + realtor.lastName || 'us'}.</p>
        <a href="${unsubscribeUrl}">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
