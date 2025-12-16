interface Realtor {
  clerkUserId: string;

  brokerageName?: string | null;
  professionalEmail?: string | null;
  phNo?: string | null;

  yearsInBusiness?: number | null;
  markets?: string[] | null;

  profileImageUrl?: string | null;
  realtorType?: 'Individual' | 'Agency' | null;

  calendlyLink?: string | null;
  signatureImageUrl?: string | null;
  brandLogoUrl?: string | null;
  brokerageLogoUrl?: string | null;
}


export const basicTemplate = (subject: string, body: string, realtor: Realtor) => `
<html>
    <head>
        <title>${subject}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .content { max-width: 600px; margin: 0 auto; padding: 20px; }
        </style>
    </head>
    <body>
        <div class="content">
            <h2>${subject}</h2>
            <div>${body}</div>
            <br>
            <p>Best regards,<br>
            ${realtor.professionalEmail ?? ''}<br>
            ${realtor.phNo ?? ''}</p>
        </div>
    </body>
</html>`;

export const brandedTemplate = (subject: string, body: string, realtor: Realtor) => `
<html>
    <head>
        <title>${subject}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background-color: #2c3e50; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .footer { background-color: #34495e; padding: 20px; text-align: center; color: white; font-size: 12px; }
            .logo { max-height: 60px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                ${realtor.brandLogoUrl ? `<img src="${realtor.brandLogoUrl}" alt="Brand Logo" class="logo"/>` : `<h1 style="color: white; margin: 0;">${realtor.brokerageName ?? ''}</h1>`}
            </div>
            <div class="content">
                <h2>${subject}</h2>
                <div>${body}</div>
            </div>
            <div class="footer">
                <p><strong>${realtor.brokerageName ?? ''}</strong></p>
                <p>Email: ${realtor.professionalEmail ?? ''} | Phone: ${realtor.phNo ?? ''}</p>
                ${realtor.calendlyLink ? `<p><a href="${realtor.calendlyLink}" style="color: #3498db;">Schedule a Meeting</a></p>` : ''}
                <p>Serving: ${(realtor.markets ?? []).length > 0 ? (realtor.markets ?? []).join(', ') : ''}</p>
                <p>© ${new Date().getFullYear()} ${realtor.brokerageName ?? ''}. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>`;

export const professionalTemplate = (subject: string, body: string, realtor: Realtor) => `
<html>
    <head>
        <title>${subject}</title>
        <style>
            body { font-family: 'Georgia', serif; margin: 0; padding: 0; background-color: #fff; }
            .container { max-width: 650px; margin: 0 auto; border: 1px solid #ddd; }
            .header { padding: 30px; border-bottom: 3px solid #d4af37; }
            .profile-section { display: flex; align-items: center; margin-bottom: 20px; }
            .profile-image { width: 80px; height: 80px; border-radius: 50%; margin-right: 20px; }
            .content { padding: 30px; line-height: 1.8; }
            .signature-section { margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #d4af37; }
            .footer { background-color: #2c3e50; color: white; padding: 15px; text-align: center; font-size: 11px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="profile-section">
                    ${realtor.profileImageUrl ? `<img src="${realtor.profileImageUrl}" alt="Profile" class="profile-image"/>` : ''}
                    <div>
                        <h1 style="margin: 0; color: #2c3e50;">${realtor.brokerageName ?? ''}</h1>
                        <p style="margin: 5px 0; color: #7f8c8d;">${realtor.realtorType ?? ''} Real Estate Professional</p>
                        <p style="margin: 5px 0; color: #7f8c8d;">${realtor.yearsInBusiness != null ? realtor.yearsInBusiness + ' years of experience' : ''}</p>
                    </div>
                </div>
            </div>
            <div class="content">
                <h2 style="color: #2c3e50; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">${subject}</h2>
                <div>${body}</div>
                <div class="signature-section">
                    ${realtor.signatureImageUrl ? `<img src="${realtor.signatureImageUrl}" alt="Signature" style="max-height: 40px;"/><br>` : ''}
                    <p style="margin: 10px 0 0 0;"><strong>Professional Contact Information:</strong><br>
                    📧 ${realtor.professionalEmail ?? ''}<br>
                    📱 ${realtor.phNo ?? ''}<br>
                    ${realtor.calendlyLink ? `🗓️ <a href="${realtor.calendlyLink}" style="color: #d4af37;">Schedule Consultation</a>` : ''}</p>
                </div>
            </div>
            <div class="footer">
                <p>Licensed Real Estate Professional | Specializing in: ${(realtor.markets ?? []).length > 0 ? (realtor.markets ?? []).join(', ') : ''}</p>
                ${realtor.brokerageLogoUrl ? `<img src="${realtor.brokerageLogoUrl}" alt="Brokerage Logo" style="max-height: 25px; margin-top: 10px;"/>` : ''}
            </div>
        </div>
    </body>
</html>`;

export const modernTemplate = (subject: string, body: string, realtor: Realtor) => `
<html>
    <head>
        <title>${subject}</title>
        <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
            .content { padding: 40px 30px; }
            .cta-button { display: inline-block; padding: 12px 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .stats { display: flex; justify-content: space-around; background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .stat { text-align: center; }
            .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
            .stat-label { font-size: 12px; color: #6c757d; text-transform: uppercase; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                ${realtor.brandLogoUrl ? `<img src="${realtor.brandLogoUrl}" alt="Brand Logo" style="max-height: 50px; margin-bottom: 15px;"/>` : ''}
                <h1 style="margin: 0; font-size: 28px; font-weight: 300;">${subject}</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">${realtor.brokerageName ?? ''}</p>
            </div>
            <div class="content">
                <div>${body}</div>
                
                <div class="stats">
                    <div class="stat">
                        <div class="stat-number">${realtor.yearsInBusiness != null ? realtor.yearsInBusiness + '+' : ''}</div>
                        <div class="stat-label">Years Experience</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${(realtor.markets ?? []).length}</div>
                        <div class="stat-label">Markets Served</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${realtor.realtorType ?? ''}</div>
                        <div class="stat-label">Service Type</div>
                    </div>
                </div>
                
                ${realtor.calendlyLink ? `<div style="text-align: center;"><a href="${realtor.calendlyLink}" class="cta-button">Schedule Your Consultation</a></div>` : ''}
            </div>
            <div class="footer">
                <p style="margin: 0; font-weight: 500;">${realtor.professionalEmail ?? ''} | ${realtor.phNo ?? ''}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #6c757d;">Proudly serving: ${(realtor.markets ?? []).length > 0 ? (realtor.markets ?? []).join(' • ') : ''}</p>
            </div>
        </div>
    </body>
</html>`;
