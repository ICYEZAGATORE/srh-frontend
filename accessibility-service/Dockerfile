# Core image — runs /health + /v1/simplify immediately. TTS and alt-text return
# 503 until you build the ML variant (see README) or mount models.
FROM python:3.11-slim

WORKDIR /app

# System deps kept minimal; add build tools only if you extend with ML wheels.
RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8080
ENV ALLOWED_ORIGINS=http://localhost:5173

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
