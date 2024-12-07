const conversionRates = {
    cm: { mm: 10, dm: 0.1, m: 0.01 },
    mm: { cm: 0.1, dm: 0.01, m: 0.001 },
    dm: { cm: 10, mm: 100, m: 0.1 },
    m: { cm: 100, mm: 1000, dm: 10 }
};

// Function to perform the conversion
function convert() {
    const value = parseFloat(document.getElementById('value').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;

    if (isNaN(value) || value === '') {
        alert("Please enter a valid number!");
        return;
    }

    // If the units are the same, no conversion is needed
    if (fromUnit === toUnit) {
        document.getElementById('output').innerText = value;
        return;
    }

    // Perform the conversion
    const convertedValue = value * conversionRates[fromUnit][toUnit];
    
    // Display the result
    document.getElementById('output').innerText = convertedValue.toFixed(2);
}
