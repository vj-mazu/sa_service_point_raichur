/* SA Service Point — script.js */
/* ponytail: minimal, dependency-free vanilla JS */

// ── Loader ──
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hide");
      loader.addEventListener("transitionend", () => {
        loader.style.display = "none";
      }, { once: true });
    }, 2500);
  }
});

// ── Mobile Menu ──
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    menuBtn?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

// Service Details Dictionary
const serviceDetailsData = {
  "Home Deep Cleaning": {
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    price: "₹3,999 onwards",
    desc: "A complete floor-to-ceiling cleaning service delivered by 2-3 trained professionals using specialized industrial tools.",
    bullets: ["Complete kitchen degreasing & cabinet cleaning", "Deep bathroom floor descaling & sanitization", "Balcony, window frames, fans & doors dust extraction"]
  },
  "Water Tank Cleaning": {
    image: "overhead-tank.webp",
    price: "₹999 onwards",
    desc: "Overhead & underground tank cleaning using a multi-stage hygienic process to ensure safe, sludge-free water supply.",
    bullets: ["Automatic water draining & sludge vacuuming", "High-pressure wall scrubbing & algae removal", "Antibacterial spray & UV germicidal treatment"]
  },
  "Sofa & Upholstery Cleaning": {
    image: "sofa-cleaning.webp",
    price: "₹499 onwards",
    desc: "Specialized extraction washing to remove deep-seated dirt, food stains, odor, dust mites, and allergens from fabric.",
    bullets: ["Dry vacuuming followed by shampoo foam scrubbing", "Spot treatment of tough stains & ink marks", "Hot-water extraction vacuuming for quick drying"]
  },
  "Washroom Deep Cleaning": {
    image: "washroom-cleaning.webp",
    price: "₹399 onwards",
    desc: "Intensive sanitization of bathrooms to restore chrome shine, scrub hardwater scaling, and eliminate heavy odors.",
    bullets: ["Acid descaling of toilet commode & wash basin", "Wall tiles scrubbing & floor grout cleaning", "Chrome fixture polishing & exhaust fan shining"]
  },
  "Car Wash & Detailing": {
    image: "car-wash.webp",
    price: "₹599 onwards",
    desc: "Showroom-like car deep cleaning performed at your doorstep using high-pressure foam washers and vacuum tools.",
    bullets: ["Exterior snow foam wash & high-pressure rinse", "Interior dashboard, console & mats deep vacuuming", "Windshield crystal coating & tire dressing polish"]
  },
  "Packers & Movers": {
    image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=600&q=80",
    price: "₹4,999 onwards",
    desc: "Safe, secure, and hassle-free household relocation within or outside Raichur. Includes bubble-wrap packing.",
    bullets: ["Multi-layer bubble wrap packing for fragile items", "Heavy furniture lifting & secure truck loading", "Organized transport & door-to-door unpacking"]
  }
};

window.openSvcDetails = function(name) {
  const data = serviceDetailsData[name];
  if (!data) return;

  const body = document.getElementById("svcDetailsBody");
  if (body) {
    body.innerHTML = `
      <img src="${data.image}" alt="${name}" class="svc-details-img">
      <div class="svc-details-info">
        <h2>${name}</h2>
        <div class="svc-details-price">${data.price}</div>
        <p class="svc-details-desc">${data.desc}</p>
        <ul class="svc-details-checklist">
          ${data.bullets.map(b => `<li>${b}</li>`).join("")}
        </ul>
        <button class="btn btn-primary btn-block" onclick="confirmSelectDetails('${name}')" style="background:#000000;color:#ffffff;padding:12px;border-radius:8px;font-weight:700;width:100%;border:none;cursor:pointer">Book This Service</button>
      </div>
    `;
  }
  const modal = document.getElementById("svcDetailsModal");
  if (modal) modal.style.display = "flex";
};

window.closeSvcDetails = function() {
  const modal = document.getElementById("svcDetailsModal");
  if (modal) modal.style.display = "none";
};

window.confirmSelectDetails = function(name) {
  closeSvcDetails();
  window.selectService(name);
};

// ── Service Select & Search Filters ──
window.selectService = function(serviceName) {
  const serviceSelect = document.getElementById("bookService");
  if (serviceSelect) {
    serviceSelect.value = serviceName;
  }
  const bookingSec = document.getElementById("booking");
  if (bookingSec) {
    bookingSec.scrollIntoView({ behavior: "smooth" });
  }
};

// ── Hero Slide Auto Rotation ──
const heroSlides = document.querySelectorAll(".hero-slides .slide");
if (heroSlides.length > 1) {
  let activeIndex = 0;
  setInterval(() => {
    heroSlides[activeIndex].classList.remove("active");
    activeIndex = (activeIndex + 1) % heroSlides.length;
    heroSlides[activeIndex].classList.add("active");
  }, 4000);
}

// ── Scroll Reveal ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".anim-up").forEach(el => observer.observe(el));

// ── Video Play ──
function playVideo(card, url) {
  // Convert embed URL to standard reel URL for direct view
  const targetUrl = url.replace("/embed", "");
  window.open(targetUrl, "_blank");
}

// ── Header shrink on scroll ──
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;
  if (window.scrollY > 100) {
    header.style.height = "58px";
    header.style.boxShadow = "0 4px 20px rgba(0,0,0,.06)";
  } else {
    header.style.height = "";
    header.style.boxShadow = "";
  }
}, { passive: true });

// ── Review Carousel: duplicate cards for infinite scroll ──
const reviewTrack = document.getElementById("reviewTrack");
if (reviewTrack) {
  const cards = reviewTrack.innerHTML;
  reviewTrack.innerHTML = cards + cards; // duplicate for seamless loop
}

// ── Booking Form → Simulated OTP & WhatsApp Confirmation ──
const bookingForm = document.getElementById("bookingForm");
const bookPhone = document.getElementById("bookPhone");
const otpModal = document.getElementById("otpModal");
const otpCloseBtn = document.getElementById("otpCloseBtn");
const otpVerifyBtn = document.getElementById("otpVerifyBtn");
const otpInputs = document.querySelectorAll(".otp-input");
const otpErrorMsg = document.getElementById("otpErrorMsg");
const otpDisplayPhone = document.getElementById("otpDisplayPhone");
const otpStepVerification = document.getElementById("otpStepVerification");
const otpStepSuccess = document.getElementById("otpStepSuccess");
const waRedirectBtn = document.getElementById("waRedirectBtn");

let currentOTP = "";
let pendingBooking = null;

// Restrict phone to 10 digits only
bookPhone?.addEventListener("input", (e) => {
  let val = e.target.value.replace(/\D/g, "");
  if (val.length > 10) val = val.slice(0, 10);
  e.target.value = val;
});

// Set min date to today
const bookDate = document.getElementById("bookDate");
if (bookDate) {
  const today = new Date().toISOString().split("T")[0];
  bookDate.setAttribute("min", today);
}

// Auto-advance OTP inputs
otpInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
    if (e.target.value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
});

// Reset OTP inputs
function resetOTPInputs() {
  otpInputs.forEach(input => input.value = "");
  otpErrorMsg.style.display = "none";
  document.querySelector(".otp-content")?.classList.remove("otp-shake");
}

bookingForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("bookName")?.value || "";
  const phone = document.getElementById("bookPhone")?.value || "";
  const service = document.getElementById("bookService")?.value || "";
  const date = document.getElementById("bookDate")?.value || "";
  const address = document.getElementById("bookAddress")?.value || "";
  const time = document.querySelector('input[name="bookTime"]:checked')?.value || "09:00 AM";

  // Build the payload
  pendingBooking = {
    name,
    phone,
    service,
    date,
    slot: time,
    address
  };

  try {
    // Call our serverless Vercel backend database route
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pendingBooking)
    });

    const data = await response.json();
    if (data.success) {
      currentOTP = data.otp;
      pendingBooking = data.booking;
      pendingBooking.time = time; // map for backward compatibility

      // Show dynamic toast notification containing simulated OTP
      const toast = document.createElement("div");
      toast.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#000000;color:#ffffff;padding:16px 24px;border-radius:8px;z-index:3000;font-size:14px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,0.15);text-align:center";
      toast.innerHTML = `🔑 SA Verification Code: <strong style="color:var(--accent);font-size:16px">${currentOTP}</strong> (Simulated SMS)`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 10000);

      // Setup OTP Modal
      if (otpDisplayPhone) otpDisplayPhone.textContent = `+91 ${phone}`;
      resetOTPInputs();
      
      otpStepVerification.style.display = "block";
      otpStepSuccess.style.display = "none";
      otpModal.classList.add("show");
      otpInputs[0].focus();
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error("Backend error, falling back to client simulation...", err);
    // Fallback if running purely local without api
    currentOTP = Math.floor(1000 + Math.random() * 9000).toString();
    pendingBooking = {
      id: "BK" + Date.now().toString().slice(-6),
      name,
      phone,
      service,
      date,
      time,
      address,
      status: "Pending"
    };

    const toast = document.createElement("div");
    toast.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#000000;color:#ffffff;padding:16px 24px;border-radius:8px;z-index:3000;font-size:14px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,0.15);text-align:center";
    toast.innerHTML = `🔑 SA Verification Code: <strong style="color:var(--accent);font-size:16px">${currentOTP}</strong> (Simulated)`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 8000);

    if (otpDisplayPhone) otpDisplayPhone.textContent = `+91 ${phone}`;
    resetOTPInputs();
    otpStepVerification.style.display = "block";
    otpStepSuccess.style.display = "none";
    otpModal.classList.add("show");
    otpInputs[0].focus();
  }
});

// Close OTP modal
otpCloseBtn?.addEventListener("click", () => {
  otpModal.classList.remove("show");
});

// OTP validation logic
otpVerifyBtn?.addEventListener("click", () => {
  let userOTP = "";
  otpInputs.forEach(input => userOTP += input.value);

  if (userOTP === currentOTP) {
    // Save locally
    const savedBookings = JSON.parse(localStorage.getItem("sa_bookings") || "[]");
    savedBookings.unshift(pendingBooking);
    localStorage.setItem("sa_bookings", JSON.stringify(savedBookings));

    // Show Success screen inside modal
    otpStepVerification.style.display = "none";
    otpStepSuccess.style.display = "block";

    // Setup WhatsApp Redirect link (to Admin)
    const adminMsg = `Hello SA Service Point! 🙏\n\nNew Booking Request:\n\n🔧 Service: ${pendingBooking.service}\n📅 Date: ${pendingBooking.date}\n⏰ Time: ${pendingBooking.time || pendingBooking.slot}\n👤 Customer: ${pendingBooking.name}\n📞 Phone: ${pendingBooking.phone}\n📍 Address: ${pendingBooking.address}\n\nPlease confirm!`;
    const waURL = `https://wa.me/917411741418?text=${encodeURIComponent(adminMsg)}`;
    waRedirectBtn.href = waURL;

    // Setup SMS Redirect link (to Client)
    const customerMsg = `Hello ${pendingBooking.name}, your booking for ${pendingBooking.service} on ${pendingBooking.date} at ${pendingBooking.time || pendingBooking.slot} is successfully confirmed with SA Service Point Raichur!`;
    const smsRedirectBtn = document.getElementById("smsRedirectBtn");
    if (smsRedirectBtn) {
      smsRedirectBtn.href = `sms:${pendingBooking.phone}?body=${encodeURIComponent(customerMsg)}`;
    }

    // Reset Booking form
    bookingForm.reset();
  } else {
    // Shake animation on incorrect OTP
    const container = document.querySelector(".otp-content");
    container.classList.add("otp-shake");
    otpErrorMsg.style.display = "block";
    setTimeout(() => container.classList.remove("otp-shake"), 3000);
  }
});


// ── Process Track Scroll 3D Animation ──
const steps = document.querySelectorAll(".step");
if (steps.length > 0) {
  const stepsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = "1";
        e.target.style.transform = "perspective(800px) rotateX(0deg) translateY(0)";
      } else {
        e.target.style.opacity = "0";
        e.target.style.transform = "perspective(800px) rotateX(12deg) translateY(24px)";
      }
    });
  }, { threshold: 0.15 });
  
  steps.forEach(s => {
    s.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
    s.style.opacity = "0";
    s.style.transform = "perspective(800px) rotateX(12deg) translateY(24px)";
    stepsObserver.observe(s);
  });
}


// ── Mobile Video Reels Indicators ──
const videoGrid = document.querySelector(".video-grid");
const videoIndicators = document.getElementById("videoIndicators");
const mockups = document.querySelectorAll(".phone-mockup");

if (videoGrid && videoIndicators && mockups.length > 0) {
  videoIndicators.innerHTML = ""; // Clear existing first
  mockups.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("video-dot");
    if (i === 0) dot.classList.add("active");
    videoIndicators.appendChild(dot);
  });

  const vDots = videoIndicators.querySelectorAll(".video-dot");

  videoGrid.addEventListener("scroll", () => {
    const scrollLeft = videoGrid.scrollLeft;
    const width = videoGrid.clientWidth;
    const activeIndex = Math.round(scrollLeft / width);
    vDots.forEach((d, idx) => {
      d.classList.toggle("active", idx === activeIndex);
    });
  }, { passive: true });
}

// ── Generic Swipe Indicators Helper ──
function setupSwipeIndicators(containerId, dotsId, itemSelector) {
  const container = document.getElementById(containerId);
  const dotsContainer = document.getElementById(dotsId);
  if (!container || !dotsContainer) return;

  const items = container.querySelectorAll(itemSelector);
  if (items.length === 0) return;

  // Clear existing
  dotsContainer.innerHTML = "";
  
  // Create dots
  items.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".dot");

  container.addEventListener("scroll", () => {
    const scrollLeft = container.scrollLeft;
    const itemWidth = items[0].offsetWidth + 16; // Include gap
    const activeIndex = Math.round(scrollLeft / itemWidth);
    dots.forEach((d, idx) => {
      d.classList.toggle("active", idx === activeIndex);
    });
  }, { passive: true });
}

// Initialize indicators for mobile swipe components
setupSwipeIndicators("servicesGrid", "svcDots", ".svc-card");
setupSwipeIndicators("whyGrid", "whyDots", ".why-card");

// ── Vertical Progress Line Scroll Fill ──
window.addEventListener("scroll", () => {
  const track = document.querySelector(".process-vertical-timeline");
  const fill = document.getElementById("verticalTimelineFill");
  if (track && fill) {
    const rect = track.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate how much of the process track has passed the middle of the screen
    const totalHeight = rect.height;
    const currentPass = viewportHeight / 2 - rect.top;
    
    let progress = Math.max(0, Math.min(100, (currentPass / totalHeight) * 100));
    fill.style.height = `${progress}%`;
  }
}, { passive: true });


// ── 3D Card Tilt Interaction (Kushi-Agro-Food Style) ──
document.querySelectorAll(".svc-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const xVal = e.clientX - rect.left;
    const yVal = e.clientY - rect.top;
    
    const xRotation = -10 * ((yVal - rect.height / 2) / (rect.height / 2));
    const yRotation = 10 * ((xVal - rect.width / 2) / (rect.width / 2));
    
    card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
});

