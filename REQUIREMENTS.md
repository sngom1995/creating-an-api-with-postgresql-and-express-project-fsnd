# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/api/v1/products`                       | Retrieve all products.                   |
| `POST`   | `/api/v1/products`                       | Create a new product.                    |
| `GET`    | `/api/v1/products/1`                     | Retrieve  product  #1.                   |
| `GET`    | `/api/v1/products/categories/sports`     | Retrieve all products  in sport category.|
| `GET`    | `/api/v1/products/top/orders`            | Retrieve top 5 sale products  .          |


#### Users
- Index [token required]
- Show [token required]
- Create N[token required]

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/api/v1/users`                          | Retrieve all users.                      |
| `POST`   | `/api/v1/users/register`                 | Create a new user.                       |
| `POST`   | `/api/v1/users/login`                    | Sign in.                                 |
| `GET`    | `//api/v1/users/1`                       | Retrieve  user  #1.                      |
| `PUT`    | `/api/v1/users/1`                        | Update user #1.                          |
| `DELETE` | `/api/v1/users/1`                        | Delete user #1.                          |


#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `//api/v1/orders`                        | Retrieve all orders.                     |
| `POST`   | `/api/v1/orders`                         | Create a new order.                      |
| `GET`    | `/api/v1/orders/1`                       | Retrieve  order  #1.                     |
| `POST`   | `/api/v1/orders/1/add`                   | Add product to  order  #1.               |
| `PUT`    | `/api/v1/orders/complete/1`              | Complete user #1 order.                  |
| `GET`    | `/api/v1/orders/user/1`                  | Retrieve user #1 orders.                 |

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)


### orders_products
- order_id
- product_id
- quantity

### Database schema

```
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(250) NOT NULL 
)

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price FLOAT NOT NULL,
    category VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders_products (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
)
```
