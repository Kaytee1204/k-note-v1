import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendProjectInviteParams {
  toEmail: string;
  projectName: string;
  addedByName: string;
  projectUrl: string;
}

export async function sendProjectInviteEmail({
  toEmail,
  projectName,
  addedByName,
  projectUrl,
}: SendProjectInviteParams) {
  if (!resend || !resendApiKey || resendApiKey.includes("your_resend_api_key")) {
    console.warn(
      `[Email Notification Mock] RESEND_API_KEY chưa cấu hình. Email sẽ gửi tới ${toEmail} cho dự án "${projectName}" bởi ${addedByName}. URL: ${projectUrl}`
    );
    return { success: true, mock: true };
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 20px; }
          .card { max-width: 600px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; box-shadow: 0 0 20px rgba(255, 45, 117, 0.2); }
          .header { text-align: center; border-b: 1px solid #27272a; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 900; color: #ff2d75; text-transform: uppercase; letter-spacing: 2px; }
          .title { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 24px; }
          .content { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 20px 0; }
          .highlight { color: #ff2d75; font-weight: 700; }
          .btn { display: inline-block; background: linear-gradient(135deg, #ff2d75 0%, #e11d61 100%); color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; margin-top: 16px; box-shadow: 0 0 15px rgba(255, 45, 117, 0.4); }
          .footer { text-align: center; font-size: 12px; color: #71717a; margin-top: 32px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="logo">StandupLogs</div>
          </div>
          <div class="title">🎉 Bạn đã được thêm vào Dự án mới!</div>
          <div class="content">
            Xin chào,<br/><br/>
            Thành viên <span class="highlight">${addedByName}</span> vừa thêm địa chỉ email của bạn vào dự án:
            <br/>
            <h3 style="color: #ffffff; background: #27272a; padding: 12px; border-radius: 8px; margin-top: 10px;">
              📁 ${projectName}
            </h3>
            <br/>
            Hãy bấm vào nút bên dưới để truy cập trực tiếp vào dự án và cập nhật nhật ký Standup cho Team.
          </div>
          <div style="text-align: center;">
            <a href="${projectUrl}" class="btn">Truy cập Dự án Ngay &rarr;</a>
          </div>
          <div class="footer">
            © 2026 StandupLogs Software Team • BlackPink Aesthetic Concept
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await resend.emails.send({
      from: "StandupLogs <onboarding@resend.dev>",
      to: [toEmail],
      subject: `[StandupLogs] 🎉 Bạn đã được thêm vào dự án "${projectName}"`,
      html: htmlContent,
    });

    console.log("Resend email sent successfully:", response);
    return { success: true, data: response };
  } catch (error) {
    console.error("Resend send email error:", error);
    return { success: false, error };
  }
}
