import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { RESEND_API_KEY, CONTACT_EMAIL } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export async function POST({ request }) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            );
        }

        const { error } = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: CONTACT_EMAIL,
            replyTo: email,
            subject: `New message from ${name}`,
            html: `
                <h2>New Contact Message</h2>

                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>

                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        if (error) {
            console.error(error);

            return json(
                { success: false, message: 'Failed to send email' },
                { status: 500 }
            );
        }

        return json({
            success: true,
            message: 'Email sent successfully'
        });
    } catch (error) {
        console.error(error);

        return json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        );
    }
}