// Predefined checkpoints with max times
const checkpoints = [
  { name: "Red Light Green Light", maxTime: 5 },
  { name: "Guess the Word", maxTime: 6 },
  { name: "Lost Find", maxTime: 7 },
  { name: "Spinning Wheel", maxTime: 8 },
  { name: "Race with Balloon", maxTime: 9 },
  { name: "Scavenger Hunt", maxTime: 10 },
  { name: "Quiz Board", maxTime: 11 },
  { name: "Morse Code", maxTime: 12 },
  { name: "Switch Right or Die", maxTime: 13 },
  { name: "Password Box", maxTime: 15 }
];

// Initialize app
let currentCheckpoint = null;
const BASE_SCORE = 100;

document.addEventListener('DOMContentLoaded', () => {
  // Populate checkpoint dropdown
  const select = document.getElementById('checkpoint');
  checkpoints.forEach((cp, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = cp.name;
    select.appendChild(option);
  });

  // Handle checkpoint selection
  select.addEventListener('change', (e) => {
    const index = e.target.value;
    if (index === "") {
      currentCheckpoint = null;
      document.getElementById('maxTime').textContent = "-";
      return;
    }

    currentCheckpoint = checkpoints[index];
    document.getElementById('maxTime').textContent = currentCheckpoint.maxTime;
    loadStoredReferenceTime();
  });
});

function setReferenceTime() {
  if (!currentCheckpoint) {
    alert("Please select a checkpoint first!");
    return;
  }

  const refTime = parseFloat(document.getElementById('refTime').value);
  if (isNaN(refTime) || refTime <= 0 || refTime > currentCheckpoint.maxTime) {
    alert(`Please enter a valid time (1-${currentCheckpoint.maxTime} minutes)`);
    return;
  }

  // Store reference time in localStorage
  localStorage.setItem(`refTime_${currentCheckpoint.name}`, refTime);
  alert(`Reference time set to ${refTime} minutes for ${currentCheckpoint.name}`);
}

function calculateScore() {
  if (!currentCheckpoint) {
    alert("Please select a checkpoint first!");
    return;
  }

  const refTime = parseFloat(localStorage.getItem(`refTime_${currentCheckpoint.name}`));
  if (!refTime) {
    alert("Please set reference time first!");
    return;
  }

  const teamTime = parseFloat(document.getElementById('teamTime').value);
  if (isNaN(teamTime) || teamTime <= 0) {
    alert("Please enter a valid team time!");
    return;
  }

  const maxTime = currentCheckpoint.maxTime;
  let score = calculateBaseScore(refTime, teamTime, maxTime);

  displayResult(refTime, teamTime, score);
}

// app.js (corrected)
function calculateBaseScore(refTime, teamTime, maxTime) {
  if (teamTime <= refTime) {
    const timeSaved = refTime - teamTime;
    return BASE_SCORE + Math.round((timeSaved / refTime) * 20);
  }
  else if (teamTime <= maxTime) {
    const timeOver = teamTime - refTime;
    const penalty = Math.round((timeOver / (maxTime - refTime)) * 50); // Added closing )
    return BASE_SCORE - penalty;
  }
  else if (teamTime <= maxTime * 1.5) {
    return 50;
  }
  else {
    return 0;
  }
}

function displayResult(refTime, teamTime, score) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `
        <h3>Score Calculation:</h3>
        <p>Checkpoint: ${currentCheckpoint.name}</p>
        <p>Reference Time: ${refTime} mins</p>
        <p>Team Time: ${teamTime} mins</p>
        <p class="final-score">Final Score: ${score}/100</p>
    `;
}

function loadStoredReferenceTime() {
  if (!currentCheckpoint) return;

  const storedTime = localStorage.getItem(`refTime_${currentCheckpoint.name}`);
  document.getElementById('refTime').value = storedTime || "";
}
// Add these new functions
function resetReferenceTime() {
  if (!currentCheckpoint) {
    alert("Please select a checkpoint first!");
    return;
  }

  localStorage.removeItem(`refTime_${currentCheckpoint.name}`);
  document.getElementById('refTime').value = "";
  document.getElementById('refStatus').innerHTML =
    `<span style="color: #e74c3c">Reference time cleared for ${currentCheckpoint.name}</span>`;
}

// Modified displayResult function
function displayResult(refTime, teamTime, score) {
  const scoreContent = `
        <p><strong>Checkpoint:</strong> ${currentCheckpoint.name}</p>
        <p><strong>Reference Time:</strong> ${refTime} mins</p>
        <p><strong>Team Time:</strong> ${teamTime} mins</p>
        <p class="final-score">Final Score: ${score}/100</p>
    `;

  document.getElementById('scoreContent').innerHTML = scoreContent;
  document.getElementById('results').style.display = 'block';
}

// Modified setReferenceTime function
function setReferenceTime() {
  if (!currentCheckpoint) {
    alert("Please select a checkpoint first!");
    return;
  }

  const refTime = parseFloat(document.getElementById('refTime').value);
  if (isNaN(refTime) || refTime <= 0 || refTime > currentCheckpoint.maxTime) {
    alert(`Please enter a valid time (1-${currentCheckpoint.maxTime} minutes)`);
    return;
  }

  localStorage.setItem(`refTime_${currentCheckpoint.name}`, refTime);
  document.getElementById('refStatus').innerHTML =
    `<span style="color: #27ae60">Reference time set to ${refTime} mins for ${currentCheckpoint.name}</span>`;

  // Hide results when new reference is set
  document.getElementById('results').style.display = 'none';
}
function resetTeamData() {
  document.getElementById('teamTime').value = '';
  document.getElementById('results').style.display = 'none';
  document.getElementById('scoreContent').innerHTML = '';
}