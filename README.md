# ShoppingAppRegression
This project is a test suite built using Puppeteer, Mocha, and Chai to automate the order placement process on a Magento e-commerce website. 

## Installation
To get started with this project, you'll need to have Node.js and npm (Node Package Manager) installed on your system.

## Running Tests in Headful Mode
By default, Puppeteer runs in headless mode (no UI). To run tests in headful mode (with a visible browser window), modify the before hook in your test file (magentoTests.js) to launch Puppeteer with { headless: false }:
browser = await puppeteer.launch({ headless: false });

## Project Structure
ShoppingAppRegression/
testRegressionShoppingApp.js      # Main test script
package.json                      # Project metadata and dependencies
README.md                         # Project documentation

## Test Scenarios 
The following test scenarios are included in the test suite:

### 1.Add a product to the cart:
Navigates to a product category ("Women").
Selects the first product listed.
Adds the product to the shopping cart.
Verifies that a success message is displayed indicating the product has been added.

### 2.Remove a product from the cart:
Opens the mini cart to view items in the cart.
Removes a product from the cart.
Verifies that a message is displayed indicating the shopping cart is empty.

### 3. Proceed to checkout:
Opens the mini cart and clicks on the "Checkout" button.
Navigates to the checkout page.
Verifies that the "Shipping Address" step is displayed, indicating the start of the checkout process.

### 4. Fill out shipping information:
Fills in the required shipping information, including email, name, address, and phone number.
Proceeds to the next step after entering shipping details.
Verifies that the "Payment Method" step is displayed, indicating that the shipping information was successfully submitted.

### 5. Apply a discount code:
Toggles the discount code section in the cart or checkout.
Enters a discount code and applies it.
Verifies that a discount message is displayed, confirming that the discount has been applied.

## 6. Place an order:
Selects a payment method.
Proceeds to place the order by clicking the checkout button.
Verifies that a success message is displayed confirming the order has been placed.

