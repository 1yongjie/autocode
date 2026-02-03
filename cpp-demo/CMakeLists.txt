cmake_minimum_required(VERSION 3.10)
project(cpp_demo VERSION 1.0.0)

# 设置 C++ 标准
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 包含头文件目录
include_directories(${PROJECT_SOURCE_DIR}/include)

# 添加可执行文件
add_executable(cpp_demo
    src/main.cpp
    src/math_utils.cpp
)

# 设置输出目录
set(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/bin)

# 在 Windows 下设置编译器标志
if(WIN32)
    target_compile_options(cpp_demo PRIVATE /W4 /WX)
else()
    target_compile_options(cpp_demo PRIVATE -Wall -Wextra -Werror)
endif()