const fs = require('fs');

// Function to decode a number from a given base
function decodeValue(base, value) {
    return parseInt(value, parseInt(base));
}

// Lagrange interpolation to find the constant term c
function lagrangeInterpolation(points) {
    let c = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let li = 1;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                li *= (0 - points[j][0]) / (xi - points[j][0]);
            }
        }
        c += li * yi;
    }
    return c;
}

// Function to process a single JSON file and calculate c
function processFile(filename) {
    // Read JSON input file
    const inputData = JSON.parse(fs.readFileSync(filename, 'utf8'));
    
    const n = inputData.keys.n;
    const k = inputData.keys.k;

    let points = [];

    // Collect points from inputData
    for (let i = 1; i <= n; i++) {
        const key = i.toString(); // Convert i to string to match JSON keys
        if (inputData[key]) { // Check if the key exists
            const base = inputData[key].base;
            const value = inputData[key].value;
            const decodedValue = decodeValue(base, value);
            points.push([parseInt(key), decodedValue]); // Push (x, y) pairs
        }
    }

    // Ensure we have enough points for interpolation
    if (points.length < k) {
        console.error(`Not enough points for interpolation in ${filename}. Found: ${points.length}, Required: ${k}`);
        return null;
    }

    // Calculate constant term c using Lagrange interpolation
    const constantTermC = lagrangeInterpolation(points.slice(0, k)); // Use first k points

    return constantTermC;
}

// Main function to read multiple JSON files and calculate c
function main() {
    const testFiles = ['input1.json', 'input2.json']; // Array of test case filenames
    const results = {};

    testFiles.forEach(file => {
        const result = processFile(file);
        if (result !== null) {
            results[file] = result; // Store the result with filename as key
        }
    });

    // Print results for both test cases
    for (const [file, result] of Object.entries(results)) {
        console.log(`The constant term c for ${file} is: ${result}`);
    }
}

main();