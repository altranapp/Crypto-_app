const API = "https://crypto-app-y5vn.onrender.com/api";

// REGISTER
async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message);
}

// LOGIN
async function login() {
  const email = document.getElementById("logEmail").value;
  const password = document.getElementById("logPassword").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);

  window.location.href = "dashboard.html";
}

// LOAD BALANCE
async function loadBalance() {
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${API}/user/balance/${userId}`);
  const data = await res.json();

  document.getElementById("balance").innerText =
    "Balance: $" + data.balance;
}

// DEPOSIT
async function deposit() {
  const amount = document.getElementById("depositAmount").value;
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${API}/user/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, amount: Number(amount) })
  });

  const data = await res.json();
  alert(data.message);
  loadBalance();
}

// WITHDRAW
async function withdraw() {
  const amount = document.getElementById("withdrawAmount").value;
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${API}/user/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, amount: Number(amount) })
  });

  const data = await res.json();
  alert(data.message);
  loadBalance();
}

// KYC
async function submitKYC() {
  const userId = localStorage.getItem("userId");

  const body = {
    userId,
    name: document.getElementById("name").value,
    country: document.getElementById("country").value,
    phone: document.getElementById("phone").value,
    sex: document.getElementById("sex").value
  };

  const res = await fetch(`${API}/kyc/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  alert(data.message);
}

// AUTO LOAD
if (window.location.pathname.includes("dashboard")) {
  loadBalance();
    }
