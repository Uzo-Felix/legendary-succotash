// Compression functions
function serialize(numbers) {
    // Sort numbers to help with run-length encoding
    const sorted = [...new Set(numbers)].sort((a, b) => a - b);
    
    // Convert to deltas between numbers to get smaller values
    const deltas = [];
    for (let i = 0; i < sorted.length; i++) {
      deltas.push(i === 0 ? sorted[i] : sorted[i] - sorted[i-1]);
    }
    
    // Convert to base64-like encoding using ASCII chars
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    let result = '';
    
    for (const delta of deltas) {
      let n = delta;
      do {
        result += chars[n & 63];
        n = n >> 6;
      } while (n > 0);
      result += ',';
    }
    
    return result;
  }
  
  function deserialize(str) {
    if (!str) return [];
    
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    const charMap = Object.fromEntries([...chars].map((c, i) => [c, i]));
    
    const numbers = [];
    let current = 0;
    let value = 0;
    let shift = 0;
    
    for (const char of str) {
      if (char === ',') {
        current += value;
        numbers.push(current);
        value = 0;
        shift = 0;
      } else {
        value |= charMap[char] << shift;
        shift += 6;
      }
    }
    
    return numbers;
  }
  
  // Test helper function
  function runTest(name, numbers) {
    const original = JSON.stringify(numbers);
    const compressed = serialize(numbers);
    const decompressed = deserialize(compressed);
    const ratio = (compressed.length / original.length * 100).toFixed(2);
    
    console.log(`\n${name}:`);
    console.log(`Original length: ${original.length}`);
    console.log(`Compressed length: ${compressed.length}`);
    console.log(`Compression ratio: ${ratio}%`);
    console.log(`Correctly decompressed: ${JSON.stringify(decompressed) === JSON.stringify([...new Set(numbers)].sort((a,b) => a-b))}`);
  }
  
  // Test cases
  function runAllTests() {
    // Simple test
    runTest("Simple test", [1, 5, 10, 15, 20]);
    
    // Random numbers tests
    const generateRandom = (count) => {
      return Array.from({length: count}, () => Math.floor(Math.random() * 300) + 1);
    };
    
    runTest("50 random numbers", generateRandom(50));
    runTest("100 random numbers", generateRandom(100));
    runTest("500 random numbers", generateRandom(500));
    runTest("1000 random numbers", generateRandom(1000));
    
    // Boundary tests
    const singleDigits = Array.from({length: 9}, (_, i) => i + 1);
    runTest("Single digits", singleDigits);
    
    const doubleDigits = Array.from({length: 90}, (_, i) => i + 10);
    runTest("Double digits", doubleDigits);
    
    const tripleDigits = Array.from({length: 201}, (_, i) => i + 100);
    runTest("Triple digits", tripleDigits);
    
    // 3 of each number (900 total)
    const repeatedNumbers = Array.from({length: 300}, (_, i) => [i + 1, i + 1, i + 1]).flat();
    runTest("3 copies of each number (900 total)", repeatedNumbers);
  }
  
  // Run all tests
  runAllTests();
  