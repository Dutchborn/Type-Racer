// Define text for each difficulty level
const difficultyTexts = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "Practice makes perfect, so keep typing every day.",
    "Typing is fun and helps improve your skills.",
    "The sun sets in the west and rises in the east.",
    "A watched pot never boils, so stay patient.",
    "Reading books can help you type faster.",
    "The cat sat on the mat and looked at the stars.",
    "Simple sentences are great for beginners."
  ],
  medium: [
    "Typing is a skill that improves with consistent practice and focus.",
    "The rain in Spain falls mainly on the plain.",
    "She sells seashells by the seashore, a classic tongue twister.",
    "A rolling stone gathers no moss, so keep moving forward.",
    "The quick brown fox is a great typing exercise.",
    "Typing tests are a fun way to measure your progress.",
    "The early bird catches the worm, so start early.",
    "A picture is worth a thousand words, but typing is priceless.",
    "The pen is mightier than the sword, but typing is faster."
  ],
  hard: [
    "Complex sentences with punctuation, numbers, and symbols test your typing accuracy.",
    "The quick, brown fox; jumps over: the lazy dog! (123)",
    "Typing tests require focus, speed, and accuracy to succeed.",
    "A stitch in time saves nine, but typing saves time.",
    "The quick brown fox jumps over the lazy dog, again and again.",
    "Typing is a skill that requires dedication and practice.",
    "The rain in Spain falls mainly on the plain, again.",
    "She sells seashells by the seashore, with punctuation!",
    "Complex sentences are a great way to improve your typing."
  ]
};

let currentSentenceIndex = 0;
let isTestRunning = false;
let timer = null;
let totalWordsTyped = 0;
let totalErrors = 0;

// Disable the typing area by default
document.getElementById("typing-area").disabled = true;

// Prevent copy-paste in the typing area
const typingArea = document.getElementById("typing-area");
typingArea.addEventListener("copy", (e) => e.preventDefault());
typingArea.addEventListener("cut", (e) => e.preventDefault());
typingArea.addEventListener("paste", (e) => e.preventDefault());

// Function to start the test
function startTest() {
  if (isTestRunning) return; // Prevent multiple starts
  isTestRunning = true;

  // Reset the test state
  currentSentenceIndex = 0;
  totalWordsTyped = 0;
  totalErrors = 0;

  updateDynamicTextarea();
  typingArea.value = ""; // Clear the typing area
  typingArea.disabled = false; // Enable the typing area
  typingArea.focus(); // Focus on the typing area

  // Display the selected difficulty in the results area
  const difficultySelect = document.getElementById("difficulty-select");
  document.getElementById("level-result").textContent = difficultySelect.value;

  // Start the timer
  startTimer();
}

// Function to stop the test
function stopTest() {
  if (!isTestRunning) return; // Do nothing if the test isn't running
  isTestRunning = false;

  // Stop the timer
  stopTimer();

  // Disable the typing area
  typingArea.disabled = true;

  alert("Test stopped. You can retry or start again.");
}

// Function to retry the test
function retryTest() {
  stopTest(); // Stop the current test

  // Reset the test state
  currentSentenceIndex = 0;
  totalWordsTyped = 0;
  totalErrors = 0;
  isTestRunning = false;

  // Clear the typing area and dynamic text container
  typingArea.value = "";
  typingArea.disabled = true; // Keep the typing area disabled
  document.getElementById("dynamic-text-container").innerHTML = "";

  // Reset the timer display
  document.getElementById("time-result").textContent = "0s";
  document.getElementById("wpm-result").textContent = "0";
  document.getElementById("accuracy-result").textContent = "0%";
  document.getElementById("errors-result").textContent = "0";

  alert("Test reset. Click 'Start Test' to begin again.");
}

// Function to update the dynamic textarea with the next sentence
function updateDynamicTextarea() {
  const difficultySelect = document.getElementById("difficulty-select");
  const dynamicTextContainer = document.getElementById("dynamic-text-container");

  // Get the selected difficulty level
  const selectedDifficulty = difficultySelect.value;

  // Clear any existing content in the container
  dynamicTextContainer.innerHTML = "";

  // Get the current sentence
  const currentSentence = difficultyTexts[selectedDifficulty][currentSentenceIndex];

  // Create a new textarea element
  const newTextarea = document.createElement("textarea");
  newTextarea.className = "form-control";
  newTextarea.rows = 5;
  newTextarea.readOnly = true; // Make it read-only
  newTextarea.value = currentSentence; // Set the text

  // Append the new textarea to the container
  dynamicTextContainer.appendChild(newTextarea);
}

// Event listener to update the dynamic textarea when the difficulty is changed
document.getElementById("difficulty-select").addEventListener("change", () => {
  currentSentenceIndex = 0; // Reset the sentence index
  updateDynamicTextarea(); // Update the dynamic textarea
});

// Set the initial sentence when the page loads
document.addEventListener("DOMContentLoaded", () => {
  updateDynamicTextarea(); // Display the first sentence for "easy" difficulty
});

// Function to calculate results (WPM, accuracy, errors)
function calculateResults() {
  const timeResult = document.getElementById("time-result").textContent;
  const totalTimeInSeconds = parseInt(timeResult.replace("s", ""), 10);

  // Calculate WPM
  const wpm = Math.round((totalWordsTyped / totalTimeInSeconds) * 60);
  document.getElementById("wpm-result").textContent = isNaN(wpm) ? "0" : wpm;

  // Calculate accuracy
  const totalCharactersTyped = totalWordsTyped * 5; // Assuming average word length is 5
  const accuracy = Math.max(
    0,
    Math.round(((totalCharactersTyped - totalErrors) / totalCharactersTyped) * 100)
  );
  document.getElementById("accuracy-result").textContent = isNaN(accuracy) ? "0%" : `${accuracy}%`;

  // Display total errors
  document.getElementById("errors-result").textContent = totalErrors;
}

// Function to start the timer
function startTimer() {
  const timeResult = document.getElementById("time-result");
  let seconds = 0;

  timer = setInterval(() => {
    seconds++;
    timeResult.textContent = `${seconds}s`;
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timer);
  timer = null;
}

// Event listeners for the buttons
document.getElementById("start-test-btn").addEventListener("click", startTest);
document.getElementById("stop-test-btn").addEventListener("click", stopTest);
document.getElementById("retry-test-btn").addEventListener("click", retryTest);

// Event listener to check if the user has completed the current sentence
typingArea.addEventListener("input", () => {
  const dynamicTextContainer = document.getElementById("dynamic-text-container");
  const currentSentence = dynamicTextContainer.querySelector("textarea").value;

  // Check if the typed text matches the current sentence
  if (typingArea.value.trim() === currentSentence.trim()) {
    totalWordsTyped += currentSentence.split(" ").length; // Count words in the sentence
    typingArea.value = ""; // Clear the typing area
    updateDynamicTextarea(); // Load the next sentence
  } else {
    // Count errors (difference in characters)
    const typedText = typingArea.value;
    totalErrors += Math.abs(currentSentence.length - typedText.length);
  }
});

