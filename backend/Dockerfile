FROM python:3.12-slim-bookworm

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_DEBUG=1

COPY . .

RUN mkdir -p instance && chmod 755 instance

EXPOSE 5001

CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]