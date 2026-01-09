/**************************************
 * LOGIN LOGIC (RUNS FIRST)
 **************************************/
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "keralapolice" && pass === "12345") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    // Load dashboard ONLY after login
    initializeDashboard();
  } else {
    document.getElementById("error").innerText = "Invalid credentials!";
  }
}

/**************************************
 * DASHBOARD VARIABLES
 **************************************/
let map;
let mapLayers = [];

// Simulated live crime data
let crimeData = [
  { zone: "Zone A", lat: 10.9, lon: 76.3, baseRisk: 0.25 },
  { zone: "Zone B", lat: 10.5, lon: 76.0, baseRisk: 0.55 },
  { zone: "Zone C", lat: 11.2, lon: 76.7, baseRisk: 0.75 }
];

// Markov Transition Matrix
const transitionMatrix = {
  "Zone A": { "Zone A": 0.2, "Zone B": 0.5, "Zone C": 0.3 },
  "Zone B": { "Zone A": 0.3, "Zone B": 0.2, "Zone C": 0.5 },
  "Zone C": { "Zone A": 0.4, "Zone B": 0.3, "Zone C": 0.3 }
};

// Criminal network (Graph logic)
let crimeGraph = {
  "Criminal_1": ["Zone B", "Zone C"],
  "Criminal_2": ["Zone C"],
  "Criminal_3": ["Zone A", "Zone B"]
};

/**************************************
 * MATHEMATICAL FUNCTIONS
 **************************************/
function predictNextZone(currentZone) {
  let transitions = transitionMatrix[currentZone];
  return Object.keys(transitions).reduce((a, b) =>
    transitions[a] > transitions[b] ? a : b
  );
}

function updateRisk(baseRisk) {
  let evidence = Math.random() * 0.2;
  return Math.min(baseRisk + evidence, 1);
}

function networkInfluence(zone) {
  let count = 0;
  Object.values(crimeGraph).forEach(zones => {
    if (zones.includes(zone)) count++;
  });
  return count * 0.05;
}

/**************************************
 * DASHBOARD INITIALIZATION
 **************************************/
function initializeDashboard() {

  // Initialize map AFTER login
  map = L.map("map").setView([10.85, 76.27], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18
  }).addTo(map);

  updateDashboard();

  // Live update every 5 seconds
  setInterval(updateDashboard, 5000);
}

/**************************************
 * DASHBOARD UPDATE
 **************************************/
function updateDashboard() {

  // Clear previous layers
  mapLayers.forEach(layer => map.removeLayer(layer));
  mapLayers = [];

  let highRiskCount = 0;

  crimeData.forEach(z => {

    z.risk = updateRisk(z.baseRisk) + networkInfluence(z.zone);
    if (z.risk > 0.6) highRiskCount++;

    let color =
      z.risk > 0.6 ? "red" :
      z.risk > 0.4 ? "orange" :
                     "green";

    let circle = L.circle([z.lat, z.lon], {
      radius: 26000,
      color: color,
      fillOpacity: 0.55
    })
    .addTo(map)
    .bindPopup(
      `<b>${z.zone}</b><br>
       Risk: ${(z.risk * 100).toFixed(1)}%`
    );

    mapLayers.push(circle);
  });

  // KPI updates
  document.getElementById("zonesCount").innerText = crimeData.length;
  document.getElementById("highRiskCount").innerText = highRiskCount;

  let lastZone = "Zone B"; // simulated last crime
  let nextZone = predictNextZone(lastZone);

  document.getElementById("topZone").innerText = nextZone;
  document.getElementById("predictionText").innerText =
    `${nextZone} is the most likely next crime location based on mathematical prediction.`;
}


