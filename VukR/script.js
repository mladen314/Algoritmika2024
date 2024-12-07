// Variables to store the current input and the result
let currentInput = '0';
let operator = '';
let previousInput = '';

// Update the display
function updateDisplay(value) {
    document.getElementById('display').textContent = value;
}

// Append a number or operator to the display
function appendToDisplay(value) {
    if (currentInput === '0') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay(currentInput);
}

// Clear the display and reset variables
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    updateDisplay(currentInput);
}

// Calculate the result of the current expression
function calculateResult() {
    try {
        // Use eval to evaluate the expression
        currentInput = eval(currentInput).toString();
    } catch (e) {
        currentInput = 'Error';
    }
    updateDisplay(currentInput);
}
