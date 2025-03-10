# COMP0016 Group 26: Avanade – AgeTech Diversibility Café Scheduling for Elderly Users​

An accessible timeslot booking tool for the Dialogue Hub's [Cafe](https://dialoguehub.co.uk/dialogue-cafe). Our tool provides an AI chatbot to assist with booking and is designed with accessibility in mind.

## Group Members

- Nicholas Blandos
- Emir Durahim
- Efe Tekin
- Pratham Shah

## Setup

Instructions on how to setup project for development

### Prerequisites

Install the following before running:

- Docker (docker --version)
- Docker Compose (docker-compose --version)
- Python (python --version / python3 --version)
- Pip (pip --version / pip3 --version)
- Node (node --version)
- NPM (npm --version)

Can verify installations by checking version
Note: Docker is optional and only necessary if you want to run backend and frontend in one command

### Backend Setup

Navigate to backend directory `cd backend`

#### Configuring Virtual Environment

To activate a virtual environment in VSCode:

- Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> and search 'Python: Select Interpreter'
- Press **+Create Virtual Environment**, Select **Venv**, Then select your preferred Python3 version, Finally check **backend/requirements.txt** as dependencies to install and click **OK**
- The virtual environment with the required packages should have been created
- Reload your terminal and the new venv should be active
- You should have a **.venv** folder which contains information about the virtual enviroment, can delete this to remove the virtual environment

#### Applying Migrations (Local Database Setup)

- Run `flask db upgrade` to apply migrations to the database (This will create the local database file)
- If you make changes to the models, you will need to generate a new migration file by running `flask db migrate -m "migration message"`

### Frontend Setup

Navigate to the frontend directory `cd frontend`

- Run `npm install` to install frontend packages

### VSCode Extensions Setup

To improve your workflow, I recommend installing the following VSCode extensions:

- Vitest (for frontend unit testing)
- Prettier (frontend code formatter)
- ESLint (frontend code linter)
- autopep8 (backend code formatter)
- Flake8 (backend code linter)
- Tailwind CSS Intellisense (autocompletion for TailwindCSS - frontend CSS library)

In VSCode settings you can enable format on save so that the formatters take effect on save

## Add Environment Variables

Environment variables are used to store sensitive information such as API keys, passwords, etc. These are stored in a `.env` file in the root of the respective directories.

### Frontend Environment Variables

Add the following environment variables to a `.env` file in the frontend directory:

```bash
VITE_API_URL=http://localhost:5001
```

### Backend Environment Variables

Add the following environment variables to a `.env` file in the backend directory:

```bash
SENDER_EMAIL=""
SENDER_PASSWORD=""

KEY_VAULT_NAME=
OPENAI_ENDPOINT_URL=
OPENAI_API_SECRET_NAME=
DEPLOYMENT_NAME=

AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
AZURE_TENANT_ID=
AZURE_ASSISTANT_ID=
```

### Azure Authentication

You may also need to authenticate with Azure to access the key vault. To do this, you can run the following command in the backend directory:

```bash
az login
```

## Running the Project

These are instructions on how to run the project after you have completed setup shown above

> [!NOTE]
> Make sure to quit port in terminal with <kbd>Ctrl</kbd> + <kbd>C</kbd> otherwise port will be in use if you re-run, an easy way to kill active ports in terminal is `npx kill-port PORT-NUMBER`

### Frontend Only

- Navigate to `frontend/`
- Run `npm run dev`
- Frontend should run on port 3000 and can be accessed at http://localhost:3000/

### Backend Only

- Navigate to `backend/`
- Run `python app.py`
- Frontend should run on port 5001 and can be accessed at http://localhost:5001/

### Frontend + Backend with Docker Compose

- Navigate to `/` root directory
- Run `docker compose build` to build an image, You only need to rebuild image if you change something that affects the docker image, e.g. dependencies
- Run `docker compose up` to run both the backend and frontend on the ports mentioned above
- Run `docker compose down` to stop and remove Docker containers (cleans up docker environment), <kbd>Ctrl</kbd> + <kbd>C</kbd> to stop docker should be enough unless there is issues
- You can check docker-compose.yaml file in root and Dockerfile in backend + frontend to see how Docker is configured

## Helpful Commands (For testing, etc.)

### To Run Backend Unit Tests

- Run from `backend/` directory

```bash
pytest -v
```

> [!NOTE]
> -v flag is optional but shows more details about the specific tests that passed/failed

### To Check Backend Unit Test Coverage

- Run from `backend/` directory

```bash
coverage run -m pytest
coverage report
```

### To Run Frontend Unit Tests

- Run from `frontend/` directory

```bash
npm run test:run
```

Alternatively, to update with file changes:

```bash
npm run test
```

### To Check Frontend Unit Test Coverage

- Run from `frontend/` directory

```bash
npm run test:coverage
```

### To Run Frontend E2E (Cypress) Tests

- Run from `frontend/` directory
- First have frontend running with `npm run dev`

```bash
npm run test:e2e:run
```

Alternatively, to update with file changes:

```bash
npm run test:e2e
```

> [!NOTE]
> Check package.json scripts for all frontend commands
