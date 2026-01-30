"""
工具函数模块
"""

import datetime

def format_output(title: str, value) -> str:
    """格式化输出"""
    return f"{title}: {value}"

def get_current_time() -> str:
    """获取当前时间"""
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def create_greeting(name: str) -> str:
    """创建问候语"""
    hour = datetime.datetime.now().hour
    
    if hour < 12:
        greeting = "早上好"
    elif hour < 18:
        greeting = "下午好"
    else:
        greeting = "晚上好"
    
    return f"{greeting}, {name}!"