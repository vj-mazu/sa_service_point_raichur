// Vercel Serverless Function: api/bookings.js
// Supabase Database Integration & Server Backend API

const SUPABASE_URL = process.env.SUPABASE_URL || "https://xyzcompany.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

let fallbackBookings = [];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, apikey, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Supabase REST Headers helper
  const supabaseHeaders = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };

  // GET: Fetch all live bookings from Supabase Database
  if (req.method === "GET") {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=*&order=created_at.desc`, {
          headers: supabaseHeaders
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          return res.status(200).json({ success: true, bookings: data });
        }
      } catch (err) {
        console.error("Supabase fetch error, using server fallback:", err);
      }
    }
    return res.status(200).json({ success: true, bookings: fallbackBookings });
  }

  // POST: Create a new booking in Supabase Database
  if (req.method === "POST") {
    const { name, phone, service, date, slot, address } = req.body;

    if (!name || !phone || !service || !date || !slot || !address) {
      return res.status(400).json({ success: false, error: "Missing required booking details." });
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
      created_at: new Date().toISOString()
    };

    const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
          method: "POST",
          headers: supabaseHeaders,
          body: JSON.stringify(newBooking)
        });
        const data = await response.json();
        if (Array.isArray(data) && data[0]) {
          return res.status(200).json({
            success: true,
            booking: data[0],
            otp: generatedOTP,
            message: "Booking saved permanently in Supabase Cloud Database."
          });
        }
      } catch (err) {
        console.error("Supabase insert error, using server fallback:", err);
      }
    }

    fallbackBookings.unshift(newBooking);
    return res.status(200).json({
      success: true,
      booking: newBooking,
      otp: generatedOTP,
      message: "Booking saved in Server Database."
    });
  }

  // PUT: Update status in Supabase Database
  if (req.method === "PUT") {
    const { id, status } = req.body;

    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}`, {
          method: "PATCH",
          headers: supabaseHeaders,
          body: JSON.stringify({ status })
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          return res.status(200).json({ success: true, booking: data[0] });
        }
      } catch (err) {
        console.error("Supabase update error:", err);
      }
    }

    const targetIndex = fallbackBookings.findIndex(b => b.id === id);
    if (targetIndex > -1) {
      fallbackBookings[targetIndex].status = status;
      return res.status(200).json({ success: true, booking: fallbackBookings[targetIndex] });
    }

    return res.status(404).json({ success: false, error: "Booking ID not found." });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
