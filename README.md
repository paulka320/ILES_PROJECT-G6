# Internship Logging and Evaluation System

## Description
This project is a Django-based Internship Logging and Evaluation System designed to manage student internships.

The system supports:
- internship placement management
- weekly log submission
- supervisor review
- student evaluation
- role-based access for different users

## User Roles
- Student
- Supervisor
- Academic Supervisor
- Administrator

## Main Modules
- Custom user management
- Internship placement
- Weekly logbook
- Evaluation and grading
- Evaluation criteria

## Technologies Used
- Python
- Django
- SQLite
- JavaScript
- React

## How to Run the Project
1. Clone the repository
2. Create and activate a virtual environment
3. Install dependencies
4. Run migrations
5. Start the development server

## Example Setup Commands
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
