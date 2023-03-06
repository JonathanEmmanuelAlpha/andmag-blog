import nodemailer from "nodemailer";

export default function (req, res) {
  const data = req.body;

  if (
    data.name.length < 3 ||
    data.name.length > 125 ||
    data.message.length < 25 ||
    data.message.length > 255
  )
    return res.status(400);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "andmagground@gmail.com",
      pass: process.env.NEXT_PUBLIC_MAIL_PASSWORD,
    },
  });

  const mailData = {
    from: "andmagground@gmail.com",
    to: "andmagground@gmail.com",
    subject: `Message de ${data.name}`,
    text: data.message + " | Envoyé depuis: " + data.email,
    html: `<div>${data.message}</div><p>Envoyé depuis: ${data.email}</p>`,
  };

  transporter.sendMail(mailData, (err, info) => {
    if (err) return res.status(400);
    else return res.status(200);
  });

  return res.status(200);
}
