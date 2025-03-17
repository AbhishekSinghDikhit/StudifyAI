# Use an official lightweight Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy files
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (default FastAPI runs on 8000, but we will map it in Cloud Run)
EXPOSE 8080

# Run FastAPI with Gunicorn
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.app:app", "--bind", "0.0.0.0:8080"]
