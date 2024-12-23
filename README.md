# Panda Express POS

Panda Express POS is a full-stack point-of-sale system built using modern web technologies. It provides features for managing transactions, visualizing sales data, and handling backend processes seamlessly. The system is designed for scalability and deployability.

---

## Features

- **React Frontend**: An intuitive and responsive user interface.
- **Django Backend**: A robust server-side application for handling API requests and database interactions.
- **Data Visualization**: Chart.js for visualizing business insights.
- **Authentication**: Includes OAuth support using Google APIs.
- **Scalable Architecture**: Designed to work with PostgreSQL and other SQL-based databases.
- **Static File Management**: Easy deployment with Whitenoise.

---

## Project Structure

```plaintext
Panda-Express-POS/
├── backend/            # Server-side business logic (Django)
├── api/                # API layer
├── src/                # React.js frontend
├── staticfiles/        # Frontend assets
├── public/             # Public-facing static files
├── media/              # Uploaded media files
├── docs/               # Project documentation
├── pydocs/             # Python-specific documentation
├── tests/              # Automated tests
├── .env.template       # Environment variables template
├── requirements.txt    # Python dependencies
├── package.json        # Node.js dependencies
└── manage.py           # Django management script
```

---

## Installation

### Prerequisites

- **Node.js**: Version 20.18.0 or later.
- **Python**: Version 3.8 or later.
- **PostgreSQL**: Installed and running.
- **Git**: Version control system.

---

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/panda-express-pos.git
   cd panda-express-pos
   ```

2. Create and activate a virtual environment:

   ```bash
   python3 -m venv env
   source env/bin/activate  # On Windows, use `env\Scripts\activate`
   ```

3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:

   - Copy `.env.template` to `.env` and fill in the required values.

5. Run migrations:

   ```bash
   python manage.py migrate
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

---

### Frontend Setup

1. Navigate to the `src` folder:

   ```bash
   cd src
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Access the application:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

This project is configured to work with Heroku. To deploy:

1. Install the Heroku CLI:

   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. Create a new Heroku application:

   ```bash
   heroku create
   ```

3. Push the code to Heroku:

   ```bash
   git push heroku main
   ```

4. Configure environment variables in the Heroku dashboard.

5. Open the deployed app:
   ```bash
   heroku open
   ```

---

## Scripts

### Backend

- `python manage.py runserver`: Start the backend server.
- `python manage.py test`: Run backend tests.

### Frontend

- `npm run dev`: Start the React development server.
- `npm run build`: Build the React frontend for production.
- `npm run lint`: Run ESLint on the frontend code.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "Add your message"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgements

Special thanks to the contributors and open-source libraries that make this project possible.
