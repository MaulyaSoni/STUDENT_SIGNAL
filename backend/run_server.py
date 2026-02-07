#!/usr/bin/env python
"""
Quick Backend Server Startup Script
Alternative to PowerShell script for cross-platform compatibility
"""
import subprocess
import sys
import os

def main():
    print("=" * 60)
    print("  EarlySignal.AI Backend Server")
    print("=" * 60)
    print()
    
    # Check if we're in the right directory
    if not os.path.exists("app/main.py"):
        if os.path.exists("backend/app/main.py"):
            print("📂 Changing to backend directory...")
            os.chdir("backend")
        else:
            print("❌ Error: Cannot find app/main.py")
            print("   Please run this script from the project root or backend directory")
            sys.exit(1)
    
    print("✓ Found backend application")
    print()
    
    # Check requirements
    print("📦 Checking dependencies...")
    try:
        import fastapi
        import uvicorn
        import pymongo
        import pandas
        import sklearn
        import joblib
        print("✓ All core dependencies installed")
    except ImportError as e:
        print(f"⚠ Missing dependency: {e.name}")
        print("  Installing dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    print()
    print("🚀 Starting FastAPI server...")
    print()
    print("   Server: http://localhost:8000")
    print("   Docs:   http://localhost:8000/docs")
    print()
    print("   Press Ctrl+C to stop")
    print("=" * 60)
    print()
    
    # Start server
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn",
            "app.main:app",
            "--reload",
            "--host", "0.0.0.0",
            "--port", "8000"
        ])
    except KeyboardInterrupt:
        print("\n\n✓ Server stopped")
        sys.exit(0)

if __name__ == "__main__":
    main()
