// Функции сжатия
function serialize(numbers) {
    // Сортируем числа для помощи в кодировании серий
    const sorted = [...new Set(numbers)].sort((a, b) => a - b);
    
    // Конвертируем в дельты между числами для получения меньших значений
    const deltas = [];
    for (let i = 0; i < sorted.length; i++) {
      deltas.push(i === 0 ? sorted[i] : sorted[i] - sorted[i-1]);
    }
    
    // Конвертируем в base64-подобную кодировку используя ASCII символы
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
  
  // Вспомогательная функция для тестов
  function runTest(name, numbers) {
    const original = JSON.stringify(numbers);
    const compressed = serialize(numbers);
    const decompressed = deserialize(compressed);
    const ratio = (compressed.length / original.length * 100).toFixed(2);
    
    console.log(`\n${name}:`);
    console.log(`Исходная длина: ${original.length}`);
    console.log(`Длина после сжатия: ${compressed.length}`);
    console.log(`Степень сжатия: ${ratio}%`);
    console.log(`Корректно распаковано: ${JSON.stringify(decompressed) === JSON.stringify([...new Set(numbers)].sort((a,b) => a-b))}`);
  }
  
  // Тестовые случаи
  function runAllTests() {
    // Простой тест
    runTest("Простой тест", [1, 5, 10, 15, 20]);
    
    // Тесты со случайными числами
    const generateRandom = (count) => {
      return Array.from({length: count}, () => Math.floor(Math.random() * 300) + 1);
    };
    
    runTest("50 случайных чисел", generateRandom(50));
    runTest("100 случайных чисел", generateRandom(100));
    runTest("500 случайных чисел", generateRandom(500));
    runTest("1000 случайных чисел", generateRandom(1000));
    
    // Граничные тесты
    const singleDigits = Array.from({length: 9}, (_, i) => i + 1);
    runTest("Однозначные числа", singleDigits);
    
    const doubleDigits = Array.from({length: 90}, (_, i) => i + 10);
    runTest("Двузначные числа", doubleDigits);
    
    const tripleDigits = Array.from({length: 201}, (_, i) => i + 100);
    runTest("Трёхзначные числа", tripleDigits);
    
    // По 3 копии каждого числа (всего 900)
    const repeatedNumbers = Array.from({length: 300}, (_, i) => [i + 1, i + 1, i + 1]).flat();
    runTest("По 3 копии каждого числа (всего 900)", repeatedNumbers);
  }
  
  // Запуск всех тестов
  runAllTests();
  