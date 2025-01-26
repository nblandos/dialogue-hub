FROM python:3.12-slim-bookworm

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

RUN mkdir -p instance && chmod 777 instance

EXPOSE 5001

CMD ["python", "app.py"]