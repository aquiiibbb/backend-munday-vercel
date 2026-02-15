const User = require('../Models/user.Models'); // models lowercase hona chahiye
const { sendMail } = require('../utils/mailer');

exports.Usercreate = async (req, res) => {
    try {
        // User create karo
        const user = await User.create(req.body);

        // Email send karo
        await sendMail({
            to: user.email,
            subject: "Welcome! Form submission received",
            text: `Hi ${user.name}, thanks for contacting us!`,
            html: `
                <h2>Hi ${user.name}!</h2>
                <p>Thanks for reaching out. We received your message:</p>
                <blockquote>"${user.message}"</blockquote>
                <p>We'll get back to you soon at ${user.email}</p>
            `
        });

        res.status(201).json({
            success: true,
            message: "User created and email sent successfully",
            data: user
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
}