const f = document.getElementById("contactForm"), status = document.getElementById("status");
const rules = {
  name: v => v ? "" : "Enter your name.",
  email: v => !v ? "Enter your email address." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email, like name@example.com.",
  phone: v => !v ? "Enter your phone number." : /^\d+$/.test(v) ? "" : "Use digits only, with no spaces or symbols.",
  message: v => v ? "" : "Enter your message."
};
function check(id) {
  const el = document.getElementById(id), msg = rules[id](el.value.trim());
  document.getElementById(id + "Err").textContent = msg; el.classList.toggle("bad", !!msg); return !msg;
}
Object.keys(rules).forEach(id => document.getElementById(id).addEventListener("blur", () => check(id)));
f.addEventListener("submit", async e => {
  e.preventDefault(); status.textContent = "";
  const ok = Object.keys(rules).map(check).every(Boolean);
  if (!ok) return;
  const btn = f.querySelector("button[type=submit]");
  btn.disabled = true; btn.textContent = "Sending…";
  try {
    const data = new FormData(f);
    const res = await fetch("https://formspree.io/f/mjyyvbwl", {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });
    if (res.ok) {
      status.textContent = "Thanks, your message was sent!";
      status.className = "ok";
      f.reset();
    } else {
      const json = await res.json();
      status.textContent = (json.errors || []).map(err => err.message).join(", ") || "Oops, something went wrong.";
      status.className = "err";
    }
  } catch (err) {
    status.textContent = "Oops, something went wrong.";
    status.className = "err";
  } finally {
    btn.disabled = false; btn.textContent = "Send message";
  }
});