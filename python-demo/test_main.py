"""
测试文件
"""

import unittest
from src.calculator import Calculator
from src.utils import create_greeting

class TestCalculator(unittest.TestCase):
    """计算器测试类"""
    
    def setUp(self):
        self.calc = Calculator()
    
    def test_add(self):
        self.assertEqual(self.calc.add(2, 3), 5)
        self.assertEqual(self.calc.add(-1, 1), 0)
    
    def test_subtract(self):
        self.assertEqual(self.calc.subtract(5, 3), 2)
        self.assertEqual(self.calc.subtract(3, 5), -2)
    
    def test_multiply(self):
        self.assertEqual(self.calc.multiply(2, 3), 6)
        self.assertEqual(self.calc.multiply(-2, 3), -6)
    
    def test_divide(self):
        self.assertEqual(self.calc.divide(6, 3), 2)
        with self.assertRaises(ZeroDivisionError):
            self.calc.divide(5, 0)
    
    def test_factorial(self):
        self.assertEqual(self.calc.factorial(5), 120)
        self.assertEqual(self.calc.factorial(0), 1)
        
class TestUtils(unittest.TestCase):
    """工具函数测试"""
    
    def test_greeting(self):
        greeting = create_greeting("测试用户")
        self.assertIn("测试用户", greeting)

if __name__ == "__main__":
    unittest.main()