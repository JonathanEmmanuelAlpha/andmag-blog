import nodemailer from "nodemailer";

export default function (req, res) {
  const data = req.body;

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "andmagground@gmail.com",
      pass: process.env.NEXT_PUBLIC_MAIL_PASSWORD,
    },
    secure: true,
  });

  const mailData = {
    from: "andmagground@gmail.com",
    to: "andmagground@gmail.com",
    subject: `Message de ${data.name}`,
    text: data.message + " | Envoyé depuis: " + data.email,
    html: `<div>${data.message}</div><p>Envoyé depuis:${data.email}</p>`,
  };

  transporter.sendMail(mailData, (err, info) => {
    if (err) console.log(err);
    else console.log(info);
  });

  return res.status(200);
}
