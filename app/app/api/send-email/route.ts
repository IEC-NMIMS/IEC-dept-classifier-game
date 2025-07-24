import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

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

    // Save to CSV
    const csvPath = path.join(process.cwd(), 'data', 'quiz_results.csv');
    const dataDir = path.join(process.cwd(), 'data');
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'department', title: 'Department' },
        { id: 'description', title: 'Description' }
      ],
      append: fs.existsSync(csvPath) // Append if file exists, create if not
    });

    const record = {
      timestamp: new Date().toISOString(),
      name,
      email,
      phone,
      department,
      description
    };

    await csvWriter.writeRecords([record]);

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
              <p style="color: #555; line-height: 1.6; margin-bottom: 0;">${description}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #e8f2ff; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="margin: 0; color: #333; font-size: 14px;">
                <strong>Next Steps:</strong> Connect with the ${department} department to learn more about opportunities, 
                projects, and how you can get involved. Your skills and interests align perfectly with what they're looking for!
              </p>
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
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return NextResponse.json({ 
        error: 'Failed to send email. Please check your email configuration.',
        details: emailError instanceof Error ? emailError.message : 'Unknown email error'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully and data saved to CSV' 
    });
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json({ 
      error: 'Failed to send email or save data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
