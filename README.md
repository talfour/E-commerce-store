# Project Vape Mate (E-commerce Store)

## Work in progress.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
## Overview

The project is a comprehensive web application that encompasses user management, authentication, and product-related features. It provides API endpoints for user registration, login, profile management, as well as product listing, category management, and brand management. The project leverages Django and Django REST Framework for building the backend API, and React for the frontend interface.


## Features

User Registration and Authentication:

    Allow users to register new accounts with email and password.
    Provide secure authentication mechanisms for user login.

User Profile Management:

    Enable users to update their profile information, such as address.
    Allow users to change their passwords and manage account settings.

Product Listing and Searching:

    Display a list of products with details such as name, description, price, and image.
    Implement search functionality to enable users to find products based on keywords.

Category and Brand Management:

    Categorize products into different categories and display them accordingly.
    Provide information about brands associated with the products.

Product Detail View:

    Show detailed information about a specific product, including additional images and specifications.

Shopping Cart and Checkout:

    Allow users to add products to a shopping cart and proceed to checkout.

User Orders and Order History:

    Provide a history of users' past orders and allow them to track their order status.
    Enable users to view and manage their order details, such as delivery address and payment information.

Responsive Design:

    Ensure that the application is responsive and optimized for various devices, such as desktops, tablets, and mobile phones.

## Installation

Make sure you have docker and docker-compose installed.
Clone repository and run following commands:

```bash
docker-compose build &&
docker-compose up
```

## To make sure everything works correctly

To test run following command:

```bash
docker-compose run --rm backend sh -c "python manage.py test && flake8"
```