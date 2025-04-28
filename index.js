// Selecting all required DOM elements
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = "!@#$%^&*()_+[]{}\\|?.,<>"; // List of possible symbols

// Initial setup values
let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider(); // Set initial slider and display
setIndicator("#ccc"); //set initial indicator value
// =================== FUNCTIONS ===================

// Update the slider and number display
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength - min)*100 /(max - min)) + "%";
}
// Set the background color of the strength indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Generate a random integer between min and max (exclusive of max)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Generate one random number (0–9)
function generateRandomNumber() {
    return getRndInteger(0, 10); // 10 exclusive, so gives 0–9
}

// Generate one lowercase letter using ASCII (a–z)
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

// Generate one uppercase letter using ASCII (A–Z)
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

// Generate one random symbol from the `symbols` string
function generateSymbol() {
    const randomIndex = getRndInteger(0, symbols.length);
    return symbols.charAt(randomIndex);
}

// Calculate password strength based on selected options and length
function calcStrength() {
    let hasUpper = upperCaseCheck.checked;
    let hasLower = lowerCaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    // Strong password
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0"); // Green
    }
    // Medium strength
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0"); // Yellow
    }
    // Weak password
    else {
        setIndicator("#f00"); // Red
    }
}

// Copy password to clipboard and show "Copied" message
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }

    // Show copied message temporarily
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Listen to slider change and update password length
inputSlider.addEventListener('input', (eventObj) => {
    passwordLength = eventObj.target.value;
    handleSlider();
});

// Handle copy button click
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

// Count how many checkboxes are selected and adjust length if needed
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    // Ensure password length is not less than number of selected character types
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// Add change listeners to all checkboxes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// Shuffle password string using Fisher-Yates algorithm
function shufflePassword(shufflepassword) {
    for (let i = shufflepassword.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        // Swap i and j
        let temp = shufflepassword[i];
        shufflepassword[i] = shufflepassword[j];
        shufflepassword[j] = temp;
    }
    return shufflepassword.join(""); // Convert array back to string
}

// Password generate button click event
generateBtn.addEventListener('click', () => {
    // No checkbox selected → can't generate password
    if (checkCount === 0) return;

    // Empty previous password
    password = "";

    // Array to store selected functions
    let funcArr = [];

    if (upperCaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowerCaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);

    // Add one character from each selected type (compulsory)
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Add remaining characters randomly
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randomIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    // Shuffle final password to avoid predictable patterns
    password = shufflePassword(Array.from(password));

    // Display the password
    passwordDisplay.value = password;

    // Update password strength indicator
    calcStrength();
});
