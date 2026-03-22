document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const messages = document.getElementById("form-messages");
  const submitBtn = form.querySelector("button");

  function showMessage(text, type = "error") {
    messages.textContent = text;
    messages.className = type; // "error" or "success"
    messages.style.opacity = 1;

    // Fade out errors — success stays visible
    /*
    if (type === "error") {
      setTimeout(() => {
        messages.style.opacity = 0;
      }, 3000);
    }
    */
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const honeypot = form.website.value.trim(); // honeypot field

    // --- Honeypot check ---
    if (honeypot !== "") {
      return; // silently ignore bots
    }

    // --- Validation ---
    if (!name || !email || !message) {
      showMessage("Please fill out all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email address.");
      return;
    }

    // --- Sending state ---
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    const data = { name, email, message };

    try {
      const res = await fetch("https://n2kei5z6bg.execute-api.us-east-1.amazonaws.com/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        form.reset();
        showMessage("Message sent!", "success");

        // Disable all form fields after success
        Array.from(form.elements).forEach(el => {
          el.disabled = true;
        });

        // Button stays disabled and shows "Sent"
        submitBtn.textContent = "Sent ✓";
        return; // <-- IMPORTANT: prevents re-enabling the button
      } else {
        showMessage("Something went wrong. Please try again.");
      }

    } catch (err) {
      showMessage("Network error. Please try again.");
    }

    // --- Only re-enable button if there was an error ---
    submitBtn.disabled = false;
    submitBtn.textContent = "Send";
  });
});
