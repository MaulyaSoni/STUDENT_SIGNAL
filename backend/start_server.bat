@echo off
cd /d D:\STUDENT_Signal\backend
call conda activate earlysignal
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
