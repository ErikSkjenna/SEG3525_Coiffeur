const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config({ path: ".env", override: true });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Serveur Studio Élégance actif.");
});

app.get("/api/test-env", (req, res) => {
  res.json({
    emailUserLoaded: Boolean(process.env.EMAIL_USER),
    emailPassLoaded: Boolean(process.env.EMAIL_PASS),
    emailUser: process.env.EMAIL_USER || "Non chargé",
    emailPassLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
  });
});

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

app.get("/api/test-email", async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "EMAIL_USER ou EMAIL_PASS manque dans le fichier .env."
      });
    }

    const transporter = createTransporter();

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Studio Élégance" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Studio Élégance",
      text: "Si vous recevez ce courriel, Nodemailer fonctionne correctement."
    });

    res.status(200).json({
      success: true,
      message: "Courriel de test envoyé avec succès.",
      messageId: info.messageId
    });
  } catch (error) {
    console.error("Erreur dans /api/test-email :", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de l’envoi du courriel de test.",
      errorMessage: error.message,
      errorCode: error.code,
      errorCommand: error.command,
      errorResponse: error.response
    });
  }
});

app.post("/api/book", async (req, res) => {
  console.log("Réservation reçue :", req.body);

  const {
    name,
    email,
    service,
    price,
    duration,
    stylist,
    date,
    time,
    companyName
  } = req.body;

  if (!name || !email || !service || !stylist || !date || !time) {
    return res.status(400).json({
      success: false,
      message: "Informations de réservation incomplètes.",
      received: req.body
    });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({
      success: false,
      message: "EMAIL_USER ou EMAIL_PASS manque dans le fichier .env."
    });
  }

  const safeCompanyName = companyName || "Studio Élégance";
  const safePrice = price || "Non indiqué";
  const safeDuration = duration || "Non indiquée";

  try {
    const transporter = createTransporter();

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"${safeCompanyName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Votre rendez-vous est confirmé chez ${safeCompanyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
          <h2 style="color: #d96c8c;">Merci d’avoir choisi ${safeCompanyName} !</h2>

          <p>Bonjour ${name},</p>

          <p>Your order is booked. Votre réservation a bien été confirmée.</p>

          <h3>Détails du rendez-vous</h3>

          <ul>
            <li><strong>Service :</strong> ${service}</li>
            <li><strong>Prix :</strong> ${safePrice} $</li>
            <li><strong>Durée :</strong> ${safeDuration}</li>
            <li><strong>Coiffeuse / Barbier :</strong> ${stylist}</li>
            <li><strong>Date :</strong> ${date}</li>
            <li><strong>Heure :</strong> ${time}</li>
          </ul>

          <p>Merci d’avoir choisi ${safeCompanyName}. Nous avons hâte de vous accueillir.</p>

          <p>
            Cordialement,<br>
            L’équipe ${safeCompanyName}
          </p>
        </div>
      `
    });

    console.log("Courriel envoyé :", info.messageId);

    res.status(200).json({
      success: true,
      message: "Courriel envoyé avec succès.",
      messageId: info.messageId
    });
  } catch (error) {
    console.error("Erreur dans /api/book :", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de l’envoi du courriel.",
      errorMessage: error.message,
      errorCode: error.code,
      errorCommand: error.command,
      errorResponse: error.response
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log("EMAIL_USER chargé :", Boolean(process.env.EMAIL_USER));
  console.log("EMAIL_PASS chargé :", Boolean(process.env.EMAIL_PASS));
  console.log(
    "Longueur EMAIL_PASS :",
    process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
  );
});