# backend Dockerfile
FROM python:3.13

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y \
    portaudio19-dev gcc libasound2-dev libffi-dev \
    && rm -rf /var/lib/apt/lists/*


RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
