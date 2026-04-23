const API = "https://crypto-app-y5vn.onrender.com/api";

// REGISTER
async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message || "Registered!");

  } catch (err) {
    alert("Register error");
  }
}

// LOGIN
async function login() {
  const email = document.getElementById("logEmail").value;
  const password = document.getElementById("logPassword").value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // redirect to dashboard
      window.location.href = "dashboard.html";
    } else {
      alert(data.message);
    }

  } catch (err) {
    alert("Login error");
  }
}
// DASHBOARD LOGIC
async function loadBalance() {
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${API}/user/balance/${userId}`);
  const data = await res.json();

  document.getElementById("balance").innerText = data.balance;
}

async function deposit() {
  const amount = Number(document.getElementById("amount").value);
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${API}/user/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, amount })
  });

  const data = await res.json();
  alert(data.message);
  loadBalance();
}

async function withdraw() {
  const amount = Number(document.getElementById("amount").value);
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${API}/user/withdraw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, amount })
  });

  const data = await res.json();
  alert(data.message);
  loadBalance();
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// Auto load balance
if (window.location.pathname.includes("dashboard.html")) {
  loadBalance();
}
