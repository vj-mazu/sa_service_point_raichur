// Vercel Serverless Function: api/bookings.js
// Simulates a backend API database for SA Service Point Bookings

let bookingsDatabase = [];

export default function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      bookings: bookingsDatabase
    });
  }

  if (req.method === "POST") {
    const { name, phone, service, date, slot, address } = req.body;

    if (!name || !phone || !service || !date || !slot || !address) {
      return res.status(400).json({
        success: false,
        error: "Missing required booking details."
      });
    }

    const newBooking = {
      id: "BK-" + Math.floor(100000 + Math.random() * 900000),
      name,
      phone,
      service,
      date,
      slot,
      address,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    bookingsDatabase.unshift(newBooking);

    // Return the created booking and a simulated OTP code for verification
    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

    return res.status(200).json({
      success: true,
      booking: newBooking,
      otp: generatedOTP,
      message: "Booking registered on server backend database. Verification code generated."
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
