import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { logToGoogleSheets } from '../../../lib/googleSheets';

// Function to convert basic Markdown formatting to HTML
function markdownToHtml(text: string): string {
  return text
    // Convert **bold** to <strong>bold</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert *italic* to <em>italic</em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert line breaks to <br> tags
    .replace(/\n/g, '<br>')
    // Convert numbered lists (1. item) to HTML lists
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Wrap list items in <ol> tags
    .replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>')
    // Convert bullet points (- item or * item) to HTML lists
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    // Clean up any double ol tags
    .replace(/<\/ol>\s*<ol>/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, department, description } = await req.json();

    if (!name || !email || !phone || !department || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Log the complete submission details for tracking
    console.log('=== NEW QUIZ SUBMISSION ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Department Match:', department);
    console.log('Full Description:', description);
    console.log('================================');

    // Log to Google Sheets (if configured)
    try {
      const sheetsLogged = await logToGoogleSheets({
        name,
        email,
        phone,
        department,
        description
      });
      
      if (sheetsLogged) {
        console.log('Successfully logged to Google Sheets');
      } else {
        console.log('Google Sheets logging failed or not configured');
      }
    } catch (sheetsError) {
      console.error('Error logging to Google Sheets:', sheetsError);
      // Don't fail the entire request if Google Sheets fails
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      secure: true, // Use TLS
      port: 465,
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json({ 
        error: 'Email configuration error. Please check your email server settings.',
        details: verifyError instanceof Error ? verifyError.message : 'SMTP verification failed'
      }, { status: 500 });
    }

    // Convert Markdown formatting in description to HTML
    const htmlDescription = markdownToHtml(description);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your IEC Department Match: ${department}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">IEC Department Classification Results</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Your Perfect Department Match:</h3>
              <h2 style="color: #333; font-size: 28px; margin: 10px 0;">${department}</h2>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #667eea; margin-top: 0;">Why This Department is Perfect for You:</h3>
              <p style="color: #555; line-height: 1.6; margin-bottom: 0;">${htmlDescription}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #e8f2ff; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="margin: 0; color: #333; font-size: 14px;">
                <strong>Next Steps:</strong> Connect with the ${department} department to learn more about opportunities, 
                projects, and how you can get involved. Your skills and interests align perfectly with what they're looking for!
              </p>
            </div>
            
            <div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center;">
              <h3 style="color: white; margin-top: 0; margin-bottom: 15px;">🚀 Take the Next Step!</h3>
              <p style="color: white; margin-bottom: 20px; font-size: 14px;">
                Ready to join the IEC Executive Team? Apply for an executive position and help shape the future of our community!
              </p>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSeKWN_DaG_4IZPdYt-pJNYs_0-QgvviTX_Tgkod58TAOQTsYA/viewform" 
                 style="display: inline-block; background-color: white; color: #667eea; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 14px; transition: all 0.3s ease;">
                Apply for Executive Position
              </a>
            </div>
          </div>
          
          <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">Thank you for taking the IEC Department Classification Quiz!</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #ccc;">This email was sent to: ${email}</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      
      // Also send a copy to yourself for record keeping
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: `[IEC Quiz] New Submission - ${department}`,
        html: `
          <h3>New Quiz Submission Received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Department Match:</strong> ${department}</p>
          <p><strong>Submission Time:</strong> ${new Date().toISOString()}</p>
          <hr>
          <h4>Full Description:</h4>
          <div>${htmlDescription}</div>
        `,
      };
      
      // Send admin notification (don't fail if this fails)
      try {
        await transporter.sendMail(adminMailOptions);
        console.log('Admin notification sent successfully');
      } catch (adminEmailError) {
        console.error('Failed to send admin notification:', adminEmailError);
        // Don't return error - user email was successful
      }
      
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return NextResponse.json({ 
        error: 'Failed to send email. Please check your email configuration.',
        details: emailError instanceof Error ? emailError.message : 'Unknown email error'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
