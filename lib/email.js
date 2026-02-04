const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendAlertEmail({ editor, brand, tool, prompt, detectedTopic, reason, timestamp }) {
  const adminEmail = process.env.ADMIN_EMAIL || 'narjes@w16media.co';

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc3545; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; }
    .script-box { background: #fff; border: 1px solid #dc3545; padding: 15px; margin: 15px 0; border-radius: 4px; white-space: pre-wrap; font-family: monospace; font-size: 13px; max-height: 400px; overflow-y: auto; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #666; }
    .value { color: #333; }
    .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin: 15px 0; }
    .footer { padding: 15px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0;">🚨 OFF-BRAND CONTENT DETECTED</h2>
    </div>
    <div class="content">
      <div class="info-row">
        <span class="label">Editor:</span>
        <span class="value" style="color: #dc3545; font-weight: bold;">${editor.name}</span>
      </div>
      <div class="info-row">
        <span class="label">Assigned Brand:</span>
        <span class="value">${brand.name} (${brand.website})</span>
      </div>
      <div class="info-row">
        <span class="label">Tool Used:</span>
        <span class="value">${tool}</span>
      </div>
      <div class="info-row">
        <span class="label">Time:</span>
        <span class="value">${new Date(timestamp).toLocaleString()}</span>
      </div>

      <div class="warning">
        <strong>⚠️ Content Analysis:</strong><br>
        <strong>Detected Topic:</strong> ${detectedTopic}<br>
        <strong>Expected:</strong> ${brand.description}<br>
        <strong>Reason:</strong> ${reason}
      </div>

      <div class="info-row">
        <span class="label">SCRIPT THEY TRIED TO GENERATE:</span>
      </div>
      <div class="script-box">${escapeHtml(prompt)}</div>

      <p style="margin-top: 20px; color: #666;">
        This editor may be using company AI tools for unauthorized work.
        Please review and take appropriate action.
      </p>
    </div>
    <div class="footer">
      Editor Monitor System | W16 Media
    </div>
  </div>
</body>
</html>
  `;

  const emailText = `
🚨 OFF-BRAND CONTENT DETECTED

Editor: ${editor.name}
Assigned Brand: ${brand.name} (${brand.website})
Tool Used: ${tool}
Time: ${new Date(timestamp).toLocaleString()}

⚠️ Content Analysis:
Detected Topic: ${detectedTopic}
Expected: ${brand.description}
Reason: ${reason}

SCRIPT THEY TRIED TO GENERATE:
────────────────────────────────
${prompt}
────────────────────────────────

This editor may be using company AI tools for unauthorized work.
Please review and take appropriate action.

---
Editor Monitor System | W16 Media
  `;

  try {
    // Use Resend's default domain (works without domain verification)
    const response = await resend.emails.send({
      from: 'Editor Monitor <onboarding@resend.dev>',
      to: adminEmail,
      subject: `OFF-BRAND ALERT: ${editor.name} (${tool})`,
      html: emailHtml,
      text: emailText
    });

    console.log('Alert email sent:', response);
    return { success: true, id: response.id };
  } catch (error) {
    console.error('Failed to send alert email:', error);
    return { success: false, error: error.message };
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

module.exports = { sendAlertEmail };
