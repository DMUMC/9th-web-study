// 매우 단순한 소수 판별: 2부터 n-1까지 모두 나눠본다.
export const isPrime = (num: number) => {
    if (num < 2) return false;
    for (let i = 2; i < num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// 2부터 max까지 순회하며 소수만 모으는 기본 구현
export const findPrimeNumbers = (max: number): number[] => {
    const primeNumbers = [];
    for (let i = 2; i <= max; i++) {
        if (isPrime(i)) {
            primeNumbers.push(i);
        }
    }
    return primeNumbers;
};
