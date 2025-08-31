import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, 
  secure: true, 
  auth: {
    user: "kyalin.khanal@gmail.com", // Replace with your Gmail address
    pass: "pqhf aqui ieus ycup", // Use a specific app password, not your regular password
  },
});

const sendEmail = async ( to, content) => {
  try {
    const info = await transporter.sendMail({
      from: "kyalin.khanal@gmail.com",
      to: to,
      subject: "Hello ✔",
      text: "Hello world?", // plain-text body
      html: content, // HTML body
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;