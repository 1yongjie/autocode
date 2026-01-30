"""
计算器模块
提供基本数学运算功能
"""

class Calculator:
    """计算器类"""
    
    def add(self, a: float, b: float) -> float:
        """加法"""
        return a + b
    
    def subtract(self, a: float, b: float) -> float:
        """减法"""
        return a - b
    
    def multiply(self, a: float, b: float) -> float:
        """乘法"""
        return a * b
    
    def divide(self, a: float, b: float) -> float:
        """除法"""
        if b == 0:
            raise ZeroDivisionError("除数不能为零")
        return a / b
    
    def sum_list(self, numbers: list) -> float:
        """计算列表总和"""
        return sum(numbers)
    
    def average(self, numbers: list) -> float:
        """计算平均值"""
        if not numbers:
            return 0
        return sum(numbers) / len(numbers)
    
    def factorial(self, n: int) -> int:
        """计算阶乘"""
        if n < 0:
            raise ValueError("阶乘不支持负数")
        if n == 0:
            return 1
        result = 1
        for i in range(1, n + 1):
            result *= i
        return result