# Food Ordering Web App (MERN Stack)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Contact](#contact)

## Introduction
This is a full-stack food ordering web application built using the MERN stack (MongoDB, Express, React, Node.js) and Next.js. The application consists of a customer-interface app for ordering food and an admin app for managing orders, menu items, and more.

## Features
- User authentication and authorization
- Browse food items
- Add items to the cart and place orders
- Stripe Payment Integration: Secure and reliable payment processing using Stripe.
- Order tracking
- Admin dashboard to manage menu items, orders

## Technologies Used
- **Frontend:** React.js, React Context API, React Router and Next.js
- **Backend:** Node.js, Express.js
- **Payment Gateway:** Stripe
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** CSS and material UI

## Installation
### Prerequisites
- Node.js
- MongoDB

### Clone the Repository
```sh
git clone https://github.com/ayoubxmahmoud/Food-Express.git
cd Food-Express
```

## Backend Setup
Navigate to the backend directory:

```sh
cd backend

```
Install dependencies:

```sh
npm install
```

Create a .env file in the backend directory and add the following:

```sh
JWT_SECRET="random#secret"
STRIPE_SECRET_KEY="YOUR_STRIPE_SECRET_KEY"
EMAIL_USER = "EMAIL_USER"
EMAIL_PASS = "EMAIL_PASS"
BASE_URL = "http://localhost:3000"
```

Start the backend server:

```sh
npm run server
```
## Frontend Setup
Navigate to the frontend directory:

```sh

cd frontend
```

Install dependencies:
```sh

npm install
```

Start the frontend server:
```sh

npm run dev
```

## Admin App Setup

Navigate to the admin directory:
```sh

cd admin
```

Install dependencies:

```sh
npm install
```

Start the admin app :
```sh
npm run admin
```

## Usage
Access the customer-interface app at http://localhost:5173.
Access the admin app at http://localhost:3000.
Register as a new user or log in with existing credentials.
Browse the menu, add items to the cart, and place an order.
Pay using dummy visa card
Use the admin panel to manage orders, menu items.

## Screenshots
![1](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/customer-interface.PNG)
![2](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/register.PNG)
![3](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/login.PNG)
![Capture2](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/explore-menu.PNG)
![Capture3](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/top-dishes.PNG)
![Capture4](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/footer.PNG)
![Capture5](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/cart.PNG)
![Capture6](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/order.PNG)
![Capture7](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/payment.PNG)
# Admin panel:
![Capture8](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/admin.PNG)
![Capture9](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/admin-items.PNG)
![Capture10](https://github.com/ayoubxmahmoud/Food-Express/blob/main/frontend/src/assets/screenshots/admin-profile.PNG)

## API Documentation
The API endpoints for the backend can be documented using tools like Postman or Thunder Client extension of vscode. Include endpoints for user authentication, menu items, orders, and more.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the code style and include relevant tests.

## Contact
For any questions or suggestions, feel free to contact me.

Happy coding!

Feel free to customize this template according to your specific project details and requirements.



