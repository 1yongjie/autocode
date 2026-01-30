import sys
try:
    import debugpy
    print("debugpy found at:", debugpy.__file__)
    print("Python path:", sys.executable)
except ImportError as e:
    print("debugpy not found:", e)