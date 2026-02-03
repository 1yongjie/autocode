#include <iostream>
#include "math_utils.h"

int main() {
    std::cout << "=== C++ Demo Program ===\n" << std::endl;
    
    // 测试加法
    int sum = add(10, 20);
    std::cout << "10 + 20 = " << sum << std::endl;
    
    // 测试阶乘
    int factorial = calculate_factorial(5);
    std::cout << "5! = " << factorial << std::endl;
    
    // 测试斐波那契数列
    int fibonacci = fibonacci_number(10);
    std::cout << "Fibonacci(10) = " << fibonacci << std::endl;
    
   
    
    std::cout << "\n=== Program Finished ===\n";
    return 0;
}