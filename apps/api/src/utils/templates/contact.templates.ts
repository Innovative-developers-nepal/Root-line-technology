export function contactConfirmationTemplate(firstName: string, subject: string, message: string): string {
    const messagePreview = message.length > 200 ? message.substring(0, 200) + "..." : message;
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting us</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;padding:20px 0">
        <tr>
            <td align="center">
                <!-- Container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
                    <!-- Header with Gradient -->
                    <tr>
                        <td align="center" style="background:linear-gradient(135deg, #059669, #0d9488);padding:40px 20px">
                            <div style="margin-bottom:16px">
                                <span style="font-size:28px;font-weight:bold;color:#ffffff">AiReachly</span>
                            </div>
                            <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:600">Thank you for reaching out!</h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding:32px 40px">
                            <p style="color:#1a1a1a;font-size:16px;line-height:1.6;margin:0 0 16px">
                                Hi <strong>${firstName}</strong>,
                            </p>
                            <p style="color:#555555;font-size:15px;line-height:1.6;margin:0 0 24px">
                                We've received your message regarding <strong style="color:#059669">${subject}</strong>. 
                                Our team will get back to you within <strong>1–2 business days</strong>.
                            </p>
                            
                            <!-- Message Preview -->
                            <div style="background:#f9fafb;border-left:4px solid #059669;border-radius:8px;padding:16px;margin:24px 0">
                                <p style="color:#666;font-size:13px;margin:0 0 8px">YOUR MESSAGE:</p>
                                <p style="color:#333;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap">${messagePreview}</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background:#f9fafb;padding:20px;border-top:1px solid #e5e7eb">
                            <p style="color:#999;font-size:12px;margin:0">
                                © 2024 AiReachly · You received this because you submitted a contact form.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

export function contactNotificationTemplate(data: {
    firstName: string;
    lastName:  string;
    email:     string;
    subject:   string;
    message:   string;
}): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;padding:20px 0">
        <tr>
            <td align="center">
                <!-- Container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background:linear-gradient(135deg, #059669, #0d9488);padding:32px 20px">
                            <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:600">New Contact Submission</h1>
                        </td>
                    </tr>
                    
                    <!-- Details -->
                    <tr>
                        <td style="padding:32px 40px">
                            <table width="100%" cellpadding="12" cellspacing="0" border="0">
                                <tr style="background:#f9fafb">
                                    <td style="font-weight:600;color:#333;width:120px;border-radius:6px 0 0 6px">Name</td>
                                    <td style="color:#555">${data.firstName} ${data.lastName}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight:600;color:#333;">Email</td>
                                    <td style="color:#555"><a href="mailto:${data.email}" style="color:#059669;text-decoration:none">${data.email}</a></td>
                                </tr>
                                <tr style="background:#f9fafb">
                                    <td style="font-weight:600;color:#333;border-radius:6px 0 0 6px">Subject</td>
                                    <td>
                                        <span style="display:inline-block;background:linear-gradient(135deg, #059669, #0d9488);color:#fff;padding:4px 12px;border-radius:20px;font-size:13px">${data.subject}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-weight:600;color:#333;vertical-align:top">Message</td>
                                    <td style="color:#555;line-height:1.6;white-space:pre-wrap">${data.message}</td>
                                </tr>
                            </table>
                            
                            <!-- CTA -->
                            <div style="margin-top:24px;text-align:center">
                                <a href="mailto:${data.email}" style="display:inline-block;background:linear-gradient(135deg, #059669, #0d9488);color:#ffffff;padding:12px 32px;border-radius:24px;text-decoration:none;font-weight:600;font-size:14px">
                                    Reply to ${data.firstName}
                                </a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background:#f9fafb;padding:20px;border-top:1px solid #e5e7eb">
                            <p style="color:#999;font-size:12px;margin:0">
                                © 2024 AiReachly · Internal notification
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}
