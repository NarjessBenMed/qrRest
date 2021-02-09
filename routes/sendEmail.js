const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");

router.post(
  "/sendEmail",
  [
    body("username").trim().isLength({ min: 4 }),
    body("email").trim().isEmail(),
    body("message").trim().isLength({ min: 5 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const output = `<p> un nouveau contact </p>
 <ul>
 <li> username: ${req.body.username}</li>
 <li> email: ${req.body.email}</li>
 </ul>
 <h3> message : <p>${req.body.message}</p> </h3> `;

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "digit.menu.plz@gmail.com",
          pass: "digit123menu",
        },
      });

      let info = await transporter.sendMail({
        from: '"client",  <digit.menu.plz@gmail.com>',
        to: "digit.menu.plz@gmail.com",
        subject: "new contact ",

        html: output,
      });

      // console.log("Message sent: %s", info.messageId);

      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      res.status(201).json({
        message: "mail sent",
      });
    } catch (error) {
      next(error);
      // }
    }
  }
);
module.exports = router;
