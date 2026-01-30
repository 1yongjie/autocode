#!/usr/bin/env python3
"""
OpenSumi Python Demo - 主程序
"""

import sys
import time
import debugpy
print(debugpy.__file__)
from calculator import Calculator
from utils import format_output, get_current_time

def main():
    """主函数"""
    print("🎉 OpenSumi Python Demo 启动!")
    print("=" * 50)
    
    
    # 创建计算器实例
    calc = Calculator()
    
    # 演示基本运算
    print("\n🧮 计算器演示:")
    print(f"5 + 3 = {calc.add(5, 3)}")
    print(f"10 - 4 = {calc.subtract(10, 4)}")
    print(f"6 × 7 = {calc.multiply(6, 7)}")
    print(f"15 ÷ 3 = {calc.divide(15, 3)}")
    
    # 演示高级功能
    print("\n📊 高级计算:")
    numbers = [1, 2, 3, 4, 5]
    print(f"列表 {numbers} 的总和: {calc.sum_list(numbers)}")
    print(f"列表 {numbers} 的平均值: {calc.average(numbers)}")
    
    # 阶乘计算
    n = 5
    print(f"{n} 的阶乘: {calc.factorial(n)}")
    
    # 使用工具函数
    print("\n⏰ 系统信息:")
    print(f"当前时间: {get_current_time()}")
    print(f"Python版本: {sys.version}")
    
    # 格式化输出演示
    result = calc.add(10, 20)
    formatted = format_output("加法结果", result)
    print(f"\n✨ {formatted}")
    
    print("\n" + "=" * 50)
    print("✅ 演示完成!")

def interactive_mode():
    """交互模式"""
    calc = Calculator()
    
    print("\n💻 交互模式 (输入 'q' 退出)")
    print("支持的操作: +, -, *, /, ! (阶乘), avg (平均值)")
    
    while True:
        try:
            user_input = input("\n请输入表达式 (例如: 5 + 3): ").strip()
            
            if user_input.lower() == 'q':
                print("👋 再见!")
                break
            
            if '!' in user_input:
                num = int(user_input.replace('!', '').strip())
                result = calc.factorial(num)
                print(f"{num}! = {result}")
                
            elif 'avg' in user_input:
                nums = [float(x) for x in user_input.replace('avg', '').strip().split()]
                result = calc.average(nums)
                print(f"平均值: {result}")
                
            else:
                # 解析简单表达式
                if '+' in user_input:
                    a, b = user_input.split('+')
                    result = calc.add(float(a), float(b))
                elif '-' in user_input:
                    a, b = user_input.split('-')
                    result = calc.subtract(float(a), float(b))
                elif '*' in user_input:
                    a, b = user_input.split('*')
                    result = calc.multiply(float(a), float(b))
                elif '/' in user_input:
                    a, b = user_input.split('/')
                    result = calc.divide(float(a), float(b))
                else:
                    print("❌ 无法识别的表达式")
                    continue
                    
                print(f"结果: {result}")
                
        except ValueError:
            print("❌ 输入格式错误，请重试")
        except ZeroDivisionError:
            print("❌ 不能除以零")
        except Exception as e:
            print(f"❌ 错误: {e}")

if __name__ == "__main__":
    # 检查命令行参数
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        interactive_mode()
    else:
        main()