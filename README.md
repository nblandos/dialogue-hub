# COMP0016 Group 26: Avanade – AgeTech Diversibility Café Scheduling for Elderly Users​

An accessible timeslot booking tool for the Dialogue Hub's [Cafe](https://dialoguehub.co.uk/dialogue-cafe). Our tool provides an AI chatbot to assist with booking and is designed with accessibility in mind.

## Group Members

- Nicholas Blandos
- Emir Durahim
- Efe Tekin
- Pratham Shah

## How to Run Locally

### Backend

#### Virtual Environment

I recommend using a python virtual environment for backend dependencies. You can create a virtual environment using the following command:

```bash
python -m venv venv
```

To activate the virtual environment, run the following command (in VSCode set the Python interpreter to the virtual environment so you don't have to activate it every time):

```bash
source venv/bin/activate
```

#### Install Backend Dependencies

```bash
pip install -r requirements.txt
```

#### May Need to Set Environment Variables

```bash
export FLASK_APP=app
export FLASK_ENV=development
```

#### Run Backend Server

```bash
flask run
```

Backend runs on `http://localhost:5000`.

### Frontend

#### Install Frontend Dependencies

```bash
npm install
```

#### Run Frontend Server

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`.

### Docker

If you want to the whole project using Docker, first you must have Docker and Docker Compose installed on your machine.

#### Build Docker Image

```bash
docker-compose build
```

#### Run Docker Container (Start backend and frontend)

```bash
docker-compose up
```

#### Stop Docker Container

```bash
docker-compose down
```

_Note_: you may need to start with `sudo` for the above commands if you get permission errors.
