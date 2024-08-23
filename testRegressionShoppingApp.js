const puppeteer = require("puppeteer");
const { expect } = require("chai");

// Timeout for waiting for elements (in milliseconds)
const DEFAULT_TIMEOUT = 10000;

describe("Magento Order Placement Regression Tests", () => {
	let browser;
	let page;

	before(async function () {
		this.timeout(30000); // Increase timeout for setup
		try {
			browser = await puppeteer.launch();
			page = await browser.newPage();
			await page.setDefaultNavigationTimeout(DEFAULT_TIMEOUT);
			await page.goto("https://magento.softwaretestingboard.com/", {
				waitUntil: "networkidle0",
			});
		} catch (error) {
			console.error("Setup failed:", error);
			throw error;
		}
	});

	after(async function () {
		this.timeout(10000); // Increase timeout for teardown
		try {
			await browser.close();
		} catch (error) {
			console.error("Teardown failed:", error);
		}
	});

	// Helper function to click with retry
	async function clickWithRetry(selector, maxRetries = 3) {
		for (let i = 0; i < maxRetries; i++) {
			try {
				await page.waitForSelector(selector, {
					timeout: DEFAULT_TIMEOUT,
				});
				await page.click(selector);
				return;
			} catch (error) {
				if (i === maxRetries - 1) throw error;
				await page.waitForTimeout(1000); // Wait before retry
			}
		}
	}

	// Test Case 1: Add a product to the cart
	it("should allow a user to add a product to the cart", async function () {
		this.timeout(30000);
		try {
			await clickWithRetry("#ui-id-4"); // "Women" category
			await page.waitForSelector(".product-item", {
				timeout: DEFAULT_TIMEOUT,
			});
			await clickWithRetry(".product-item:first-child");
			await clickWithRetry("#product-addtocart-button");
			await page.waitForSelector(".message-success", {
				timeout: DEFAULT_TIMEOUT,
			});

			const successMessage = await page.$eval(
				".message-success",
				(el) => el.textContent
			);
			expect(successMessage).to.include("You added");
		} catch (error) {
			console.error("Add to cart failed:", error);
			throw error;
		}
	});

	// Test Case 2: Remove a product from the cart
	it("should allow a user to remove a product from the cart", async function () {
		this.timeout(30000);
		try {
			await clickWithRetry(".showcart"); // Open mini cart
			await clickWithRetry(".action-delete"); // Remove product from cart
			await page.waitForSelector(".cart-empty", {
				timeout: DEFAULT_TIMEOUT,
			});

			const emptyCartMessage = await page.$eval(
				".cart-empty",
				(el) => el.textContent
			);
			expect(emptyCartMessage).to.include(
				"You have no items in your shopping cart."
			);
		} catch (error) {
			console.error("Remove from cart failed:", error);
			throw error;
		}
	});

	// Test Case 3: Proceed to checkout
	it("should allow a user to proceed to checkout", async function () {
		this.timeout(30000);
		try {
			await clickWithRetry(".showcart");
			await clickWithRetry("#top-cart-btn-checkout");
			await page.waitForSelector("#checkout", {
				timeout: DEFAULT_TIMEOUT,
			});

			const checkoutTitle = await page.$eval(
				".step-title",
				(el) => el.textContent
			);
			expect(checkoutTitle).to.include("Shipping Address");
		} catch (error) {
			console.error("Proceed to checkout failed:", error);
			throw error;
		}
	});

	// Test Case 4: Fill out shipping information
	it("should allow a user to fill out shipping information", async function () {
		this.timeout(40000);
		try {
			await page.type("#customer-email", "test@example.com");
			await page.type('input[name="firstname"]', "John");
			await page.type('input[name="lastname"]', "Doe");
			await page.type('input[name="street[0]"]', "123 Test St");
			await page.type('input[name="city"]', "Test City");
			await page.select('select[name="region_id"]', "12");
			await page.type('input[name="postcode"]', "12345");
			await page.type('input[name="telephone"]', "1234567890");

			await clickWithRetry('button[data-role="opc-continue"]');
			await page.waitForSelector("#checkout-payment-method-load", {
				timeout: DEFAULT_TIMEOUT,
			});

			const paymentTitle = await page.$eval(
				".payment-group .step-title",
				(el) => el.textContent
			);
			expect(paymentTitle).to.include("Payment Method");
		} catch (error) {
			console.error("Fill shipping information failed:", error);
			throw error;
		}
	});

	// Test Case 5: Apply a discount code
	it("should allow a user to apply a discount code", async function () {
		this.timeout(30000);
		try {
			await clickWithRetry(".action-toggle"); // Toggle the discount code section
			await page.type("#discount-code", "DISCOUNT2024"); // Enter discount code
			await clickWithRetry("#apply-discount-button"); // Apply discount code
			await page.waitForSelector(".discount", {
				timeout: DEFAULT_TIMEOUT,
			});

			const discountMessage = await page.$eval(
				".discount",
				(el) => el.textContent
			);
			expect(discountMessage).to.include("Discount (DISCOUNT2024)");
		} catch (error) {
			console.error("Apply discount code failed:", error);
			throw error;
		}
	});

	// Test Case 6: Place an order
	it("should allow a user to place an order", async function () {
		this.timeout(30000);
		try {
			await clickWithRetry(
				'.payment-method:first-child input[type="radio"]'
			);
			await clickWithRetry("button.action.primary.checkout");
			await page.waitForSelector(".checkout-success", {
				timeout: DEFAULT_TIMEOUT,
			});

			const successMessage = await page.$eval(
				".checkout-success",
				(el) => el.textContent
			);
			expect(successMessage).to.include("Thank you for your purchase!");
		} catch (error) {
			console.error("Place order failed:", error);
			throw error;
		}
	});
});
