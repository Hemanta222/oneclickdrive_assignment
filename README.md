# oneclickdrive assignment

## live url - https://oneclickdrive-assignment-lime.vercel.app/
## *Note* - In the project, I have used an SQLite DB for managing products. Since I have deployed it on Vercel, which is serverless, SQLite becomes read-only; therefore, the edit/update functionalities are not working on the live server..

### Recording Video Link - https://drive.google.com/drive/folders/1E4YRBTumau5kW5YuzLfKsM9O4xQBC0pa?usp=drive_link
### Screenshots link -  https://drive.google.com/drive/folders/1LnQOQa16dKG5kKtEeP0g2TTSoiTugNqk?usp=drive_link

## sample users
email - test1@test.com
password - password

email - test2@test.com
password - password

email - test4@test.com
password - password


## routes
1) Dashboard -  http://localhost:3000/dashboard
2) Audits - http://localhost:3000/audits
3) Login - http://localhost:3000/login
4) Signup - http://localhost:3000/signup

# Product Management System

## Overview

This project is a comprehensive Dashboard Management System designed to facilitate the creation, management, and tracking of products(cars). It features a robust backend built with a focus on user authentication and product lifecycle management, coupled with a dynamic and interactive frontend for an intuitive user experience. SQLite is utilized as the database for efficient storage of both product data and audit logs.

## Features

### Database

* **SQLite:** Employed for storing all string-based data, including product details, user information, and audit logs.

### Backend

* **User Authentication:**
    * **User Login:** Secure authentication process for existing users.
    * **User Signup:** Allows new users to create accounts.
* **Product Management:**
    * **Create Single Product:** Functionality to add individual products to the system.
    * **Create Multiple Products:** Supports bulk product creation for efficiency.
    * **Fetch Products:** Retrieve a list of all available products.
    * **Edit Product:** Modify existing product details.
    * **Update Product Status:** Change the status of products (e.g., "approved," "rejected,").
* **Audit Logs:**
    * **Implementation:** Comprehensive audit logging system that records significant actions (e.g., product status changes, product edit) in a dedicated SQLite table named `audit_logs`. Each log entry includes details such as action performed, timestamp, and the user responsible.

### Frontend (Next.js App Routes)

* **Dashboard Page:**
    * **Product Listing:** Displays a list of all fetched products in an interactive MUI DataGrid component.
    * **Actions:** Provides options to "Edit" and "Update Status" for each product directly from the DataGrid.
* **Product Filtering:**
    * **Status-based Filtering:** Users can filter products by their status, such as "Approved" or "Rejected," for streamlined viewing.
* **Login Page:**
    * Dedicated interface for handling user login.
* **Signup Page:**
    * Interface for users to create new accounts.
* **Route Protection:**
    * **Authenticated Access:** Implements robust route protection ensuring that only authenticated users can access privileged routes like the Dashboard and Audit Logs page.
* **Authentication Handling:**
    * **Cookie and JSON Web Token (JWT):** Utilizes a combination of cookies and JWT for secure and efficient management of user authentication sessions.

## Technologies Used

* **Backend:** Next.js
* **Frontend:** Next.js (App Routes)
* **Database:** SQLite
* **UI Library:** Material-UI (MUI) for the DataGrid and other components.
* **Authentication:** Cookies, JSON Web Tokens (JWT)

## Getting Started

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Hemanta222/oneclickdrive_assignment.git
    cd oneclickdrive_assignment
    ```

3.  **Setup:**
    ```bash
    cd frontend # Or your specific frontend directory
    npm install # Or yarn install
    # Set up environment variables (e.g., backend API URL)
    npm run dev # Or yarn dev
    ```

## Usage

1.  **Access the application:** Once both backend and frontend servers are running, open your web browser and navigate to `http://localhost:3000` (or the port where your Next.js app is running).
2.  **Signup/Login:** Create a new account or log in with existing credentials.
3.  **Dashboard:** Explore the dashboard to view, add, edit, and update the status of products.
4.  **Audit Logs:** Navigate to the audit logs page to review system activities.


