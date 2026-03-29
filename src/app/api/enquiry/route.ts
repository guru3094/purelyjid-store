import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const filePath = path.join(process.cwd(), 'data', 'enquiries.json');

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newEntry = {
      id: Date.now(),
      ...body,
      created_at: new Date().toISOString()
    };

    // ✅ Save locally
    let existing = [];

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      existing = JSON.parse(fileData || '[]');
    }

    existing.push(newEntry);

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    // ✅ Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'purelyjid@gmail.com',
        pass: 'WEBapp&*(1995'
      }
    });

    await transporter.sendMail({
      from: 'purelyjid@gmail',
      to: 'purelyjid@gmail.com',
      subject: 'New Enquiry - PurelyJid',
      text: `
New Enquiry Received:

Product: ${newEntry.product_name}
Name: ${newEntry.name}
Email: ${newEntry.email}
Phone: ${newEntry.phone}
Message: ${newEntry.message}
Event Date: ${newEntry.event_date}
Budget: ${newEntry.budget}
      `
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
