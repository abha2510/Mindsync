# Admin Panel with Role-Based Access Control
### This project is a Full Stack Admin Panel built using React.js, Node.js, Express.js, and MongoDB. It includes user authentication, CRUD operations for user management, and robust role-based access control (RBAC).

## 🌟 Features
### 1. User Authentication
* Register: Users can register with their first name, last name, email, and password.
* Login: Users can log in using their email and password.
* Logout: Users can securely log out of the application.

### 2. Admin Panel
User Management:
* Create: Admins can add new users.
* Read: Admins can view the list of registered users.
* Update: Admins can edit user details.
* Delete: Admins can remove users.
* Bulk Delete: Admins can delete multiple users at once.

### 3. Security
* Password Hashing: Passwords are hashed using bcrypt before storage.
* JWT Authentication: JSON Web Tokens are used for secure user sessions.
* Role-Based Access Control:
* Admin: Full access to the admin panel and user management.
* User: Limited access based on permissions.
  
### 4. Additional Features
* Form Validation: Frontend and backend form validation.
* Pagination and Search: Admins can search and paginate the user list.
* Error Handling: Proper error handling with user-friendly messages.

## 🔧 Tech Stack
### Frontend
* React.js
* React Router for navigation
* Redux for state management
* CSS Framework: Material-UI for styling
### Backend
* Node.js with Express.js
* Database: MongoDB
* Authentication: JWT (JSON Web Tokens)
* Password Hashing: bcrypt
* Middleware: Role-based access control
  
## 🛠️ Setup Instructions
### 1. Frontend Setup
* Clone the repository.
* Navigate to the frontend directory: `cd frontend`
* Install dependencies: `npm install`
* Start the development server: `npm start`

### 2. Backend Setup
* Navigate to the backend directory:`cd backend`
* Install dependencies: `npm install`
* Create a .env file and add the following environment variables:
   `PORT=5000
    JWT_SECRET=your_secret_key
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=your_password
    DB_URI=mongodb_connection_string`
* Start the server: `npm run dev`
  
## 🚀 Usage
### 1. User Authentication
* Access registration and login forms from the frontend.
  
  ![image](https://github.com/user-attachments/assets/96bbfcd5-f2e8-40e6-8d71-0ed87d3930d3)

* Authenticate using a valid email and password.

![image](https://github.com/user-attachments/assets/91230820-b6c8-46e9-b509-2dee90dc65df)

### 2. Admin Panel
* Log in as an Admin to access the panel.
* Manage users (Create, Read, Update, Delete) via the admin dashboard.
![image](https://github.com/user-attachments/assets/3994290a-0a5c-492e-9fe0-aa2bde4fe2d6)

![image](https://github.com/user-attachments/assets/936264d3-2864-4471-93df-2cfcc366a173)

![image](https://github.com/user-attachments/assets/43f915bf-bcbf-436c-9908-209ed04788a9)



