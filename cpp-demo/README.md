# C++ Demo with OpenSumi

一个使用 OpenSumi Web IDE 开发的简单 C++ 演示程序。

## 项目结构

## 功能

1. **基本运算**：加、减、乘、除
2. **数学函数**：阶乘、斐波那契数列
3. **算法**：最大公约数（GCD）

## 使用说明

### 在 OpenSumi 中编译和运行

1. **方法一：使用任务**
   - 按 `Ctrl+Shift+P` 打开命令面板
   - 输入 "Tasks: Run Task"
   - 选择 "build" 进行编译
   - 选择 "run" 运行程序

2. **方法二：使用调试器**
   - 按 `F5` 或点击调试侧边栏
   - 选择 "C++ Launch" 配置
   - 点击运行按钮

3. **方法三：手动命令行**
   ```bash
   mkdir build
   cd build
   cmake ..
   make
   ../bin/cpp_demo
   
   依赖
CMake (>= 3.10)

C++11 兼容的编译器

Make 或 Ninja


## 步骤 6: 使用 OpenSumi 开发

### 在 OpenSumi 中设置：

1. **安装 C++ 扩展**：
   - 打开 OpenSumi 扩展市场
   - 搜索并安装 C/C++ 扩展

2. **配置编译器**：
   - 确保系统已安装 g++/gcc
   - 或者安装 Clang

3. **构建和运行**：
   - 打开终端视图
   - 运行编译命令：
   ```bash
   chmod +x scripts/*
   ./scripts/build.sh