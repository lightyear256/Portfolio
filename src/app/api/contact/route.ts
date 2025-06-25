import nodemailer from 'nodemailer';
import type { NextRequest } from 'next/server';
import type { Transporter, SendMailOptions } from 'nodemailer';

interface ContactRequestBody {
  name: string;
  email: string;
  message: string;
}





interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const VALIDATION_RULES = {
  name: { min: 2, max: 100 },
  message: { min: 10, max: 1000 }
} as const;


const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const entry = rateLimitStore.get(ip) || { timestamps: [] };

  entry.timestamps = entry.timestamps.filter(timestamp => timestamp > windowStart);

  if (entry.timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.timestamps.push(now);
  rateLimitStore.set(ip, entry);

  return false;
};


const validateInput = (name: string, email: string, message: string): string[] => {
  const errors: string[] = [];
  
  if (!name?.trim() || name.trim().length < VALIDATION_RULES.name.min || name.trim().length > VALIDATION_RULES.name.max) {
    errors.push(`Name must be between ${VALIDATION_RULES.name.min} and ${VALIDATION_RULES.name.max} characters`);
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.trim() || !emailRegex.test(email.trim())) {
    errors.push('Please provide a valid email address');
  }
  
  if (!message?.trim() || message.trim().length < VALIDATION_RULES.message.min || message.trim().length > VALIDATION_RULES.message.max) {
    errors.push(`Message must be between ${VALIDATION_RULES.message.min} and ${VALIDATION_RULES.message.max} characters`);
  }
  
  return errors;
};


const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') 
    .trim();
};


const createTransporter = (): Transporter => {

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};


const getClientIp = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded 
    ? forwarded.split(',')[0]
    : request.headers.get('x-real-ip') || 'unknown';
  
  return ip;
};


const createNotificationEmailHtml = (name: string, email: string, message: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #10b981; margin-bottom: 20px; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; margin-bottom: 10px;">Contact Details:</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; margin-bottom: 10px;">Message:</h3>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; border-left: 4px solid #10b981;">
            <p style="margin: 0; line-height: 1.6; color: #374151;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      </div>
    </div>
  `;
};


const createAutoReplyEmailHtml = (name: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #10b981; margin-bottom: 20px;">Hi ${name}! 👋</h2>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          Thank you for reaching out through my portfolio! I've received your message and really appreciate you taking the time to connect.
        </p>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
          <p style="margin: 0; color: #166534; font-weight: 500;">
            📧 Your message has been received and I'll get back to you within 24-48 hours.
          </p>
        </div>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          In the meantime, feel free to:
        </p>
        
        <ul style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          <li>Check out my latest projects on <a href="https://github.com/lightyear256" style="color: #10b981; text-decoration: none;">GitHub</a></li>
          <li>Connect with me on <a href="https://linkedin.com/in/ayushmaan-kumar" style="color: #10b981; text-decoration: none;">LinkedIn</a></li>
          <li>Explore more of my work on my portfolio</li>
        </ul>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 30px;">
          Looking forward to our conversation!
        </p>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p style="margin: 0; color: #374151; font-weight: 500;">Best regards,</p>
          <p style="margin: 5px 0 0 0; color: #10b981; font-weight: 600; font-size: 18px;">Ayushmaan Kumar</p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Full Stack Developer</p>
        </div>
      </div>
    </div>
  `;
};


export async function POST(request: NextRequest) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.error('Missing required environment variables: EMAIL_USER or EMAIL_APP_PASSWORD');
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

   
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return Response.json(
        { error: 'Too many contact attempts. Please try again later.' },
        { status: 429 }
      );
    }

    let body: ContactRequestBody;
    try {
      body = await request.json();
    } catch (error) {
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return Response.json(
        {
          error: 'Missing required fields',
          details: ['Name, email, and message are all required']
        },
        { status: 400 }
      );
    }

    const validationErrors = validateInput(name, email, message);
    if (validationErrors.length > 0) {
      return Response.json(
        {
          error: 'Please check your input fields',
          details: validationErrors
        },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);

    const transporter = createTransporter();
    await transporter.verify();

    const notificationMailOptions: SendMailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: 'ayushmaank25@gmail.com',
      subject: `New Portfolio Contact: ${sanitizedName}`,
      html: createNotificationEmailHtml(sanitizedName, sanitizedEmail, sanitizedMessage),
      text: `
        New Contact Form Submission
        
        Name: ${sanitizedName}
        Email: ${sanitizedEmail}
        Submitted: ${new Date().toLocaleString()}
        
        Message:
        ${sanitizedMessage}
      `.trim(),
    };

    const autoReplyOptions: SendMailOptions = {
      from: `"Ayushmaan Kumar" <${process.env.EMAIL_USER}>`,
      to: sanitizedEmail,
      subject: 'Thanks for reaching out! - Ayushmaan Kumar',
      html: createAutoReplyEmailHtml(sanitizedName),
      text: `
        Hi ${sanitizedName}!
        
        Thank you for reaching out through my portfolio! I've received your message and really appreciate you taking the time to connect.
        
        Your message has been received and I'll get back to you within 24-48 hours.
        
        In the meantime, feel free to:
        - Check out my latest projects on GitHub: https://github.com/lightyear256
        - Connect with me on LinkedIn: https://linkedin.com/in/ayushmaan-kumar
        - Explore more of my work on my portfolio
        
        Looking forward to our conversation!
        
        Best regards,
        Ayushmaan Kumar
        Full Stack Developer
      `.trim(),
    };

    await Promise.all([
      transporter.sendMail(notificationMailOptions),
      transporter.sendMail(autoReplyOptions)
    ]);

    console.log(`Contact form submission from ${sanitizedName} (${sanitizedEmail}) processed successfully`);

    return Response.json(
      {
        success: true,
        message: 'Message sent successfully! You should receive a confirmation email shortly.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);

    return Response.json(
      { error: 'Failed to send message. Please try again later or contact me directly.' },
      { status: 500 }
    );
  }
}