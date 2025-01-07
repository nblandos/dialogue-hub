# COMP0016 Group 26: Avanade – AgeTech Diversibility Café Scheduling for Elderly Users​

An accessible timeslot booking tool for the Dialogue Hub's [Cafe](https://dialoguehub.co.uk/dialogue-cafe). Our tool provides an AI chatbot to assist with booking and is designed with accessibility in mind.

## Group Members

- Nicholas Blandos
- Emir Durahim
- Efe Tekin
- Pratham Shah

## Development

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

#### To Run Tests

```bash
pytest
```

#### To Check Test Coverage

```bash
coverage run -m pytest
coverage report
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

#### To Run Tests

**Unit Tests:**

```bash
npm run test
```

**E2E Tests:**

```bash
npm run test:e2e:run
```
#### To Check Test Coverage

```bash
npm run test:coverage
```

Frontend runs on `http://localhost:3000`.

### Check package.json for other frontend commands.

### Docker

If you want to run the whole project using Docker, first you must have Docker and Docker Compose installed on your machine.

#### Build Docker Image

```bash
docker compose build
```

#### Run Docker Container (Start backend and frontend)

```bash
docker compose up
```

#### Stop Docker Container

```bash
docker compose down
```

_Note_: you may need to start with `sudo` for the above commands if you get permission errors.

### Linters and Formatters

Backend uses autopep8 and flake8 for formatting and linting.
Frontend uses ESLint and Prettier for formatting and linting.

I recommend installing VSCode extensions and configuring them to format on save.
