CREATE TABLE Orders (

Order.ID VARCHAR(30) PRIMARY KEY,

Order.Date DATE,

Ship.Date DATE,

Customer.Name VARCHAR(100),

Segment VARCHAR(50),

Country VARCHAR(50),

Region VARCHAR(50),

Market VARCHAR(50),

Category VARCHAR(50),

Sub.Category VARCHAR(50),

Product.Name VARCHAR(150),

Sales DECIMAL(10,2),

Quantity INT,

Discount DECIMAL(5,2),

Profit DECIMAL(10,2),

Shipping.Cost DECIMAL(10,2),

Year INT,

Month INT,

Quarter INT

);