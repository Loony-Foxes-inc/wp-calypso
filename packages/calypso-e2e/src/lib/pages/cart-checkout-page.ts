import { Page } from 'playwright';

export type PaymentMethods = 'Credit Card' | 'Paypal' | 'Free';

const selectors = {
	// General selectors
	modalContinueButton: 'button:text("Continue")',
	closeCheckoutButton: `[title="Close Checkout"]`,

	// Cart items
	cartItems: '.order-review-line-items > li:visible', // match all cart items
	cartItemByName: ( itemName: string ) =>
		`.order-review-line-items:has-text("${ itemName }"):visible`, // match cart item by name
	removeCartItemButton: ( itemName: string ) =>
		`[data-testid="review-order-step--visible"] button[aria-label*="Remove ${ itemName.trim() } from cart"]`,
};

/**
 * Page representing the cart checkout page for purchases made in Upgrades.
 */
export class CartCheckoutPage {
	private page: Page;

	/**
	 * Constructs an instance of the Cart Checkout POM.
	 *
	 * @param {Page} page Instance of the Playwright page
	 */
	constructor( page: Page ) {
		this.page = page;
	}

	/**
	 * Select the payment method to be used.
	 *
	 * @param {PaymentMethods} method The payment method to be used.
	 */
	async selectPaymentMethod( method: PaymentMethods ): Promise< void > {
		await this.page.check( `input[aria-label="${ method }"]` );
	}

	/**
	 * Validates that an item is in the cart with the expected text. Throws if it isn't.
	 *
	 * @param {string} expectedCartItemName Expected text for the name of the item in the cart.
	 * @throws If the expected cart item is not found in the timeout period.
	 */
	async validateCartItem( expectedCartItemName: string ): Promise< void > {
		await this.page.waitForSelector( selectors.cartItemByName( expectedCartItemName.trim() ) );
	}

	/**
	 * Removes the specified cart item from the cart completely.
	 *
	 * @param {string} cartItemName Name of the item to remove from the cart.
	 * @param param1 Keyed object parameter.
	 * @param {boolean} param1.closeCheckout If true, method will attempt to close the checkout screen.
	 */
	async removeCartItem(
		cartItemName: string,
		{ closeCheckout }: { closeCheckout?: boolean } = {}
	): Promise< void > {
		// Checkout page adds dynamic css classes and the same classes are
		// shared across multiple elements on page. Limit the search to items
		// within the order review line that are visible.
		const cartItems = await this.page.$$( selectors.cartItems );
		await this.page.click( selectors.removeCartItemButton( cartItemName ) );

		// If the only item in cart is removed, the checkout is automatically dismissed,
		// navigating user back to the Upgrades > Plans page with the Plans tab selected.
		if ( cartItems.length === 1 ) {
			await Promise.all( [
				this.page.waitForNavigation(),
				this.page.click( selectors.modalContinueButton ),
			] );
		} else {
			// Otherwise confirm the removal of cart item.
			await this.page.click( selectors.modalContinueButton );

			// If checkout should be closed, perform the action now.
			if ( closeCheckout ) {
				await this.closeCheckout();
			}
		}
	}

	/**
	 * Closes the checkout page.
	 *
	 * @returns {Promise<void>} No return value.
	 */
	async closeCheckout(): Promise< void > {
		await Promise.all( [
			this.page.waitForNavigation(),
			this.page.click( selectors.closeCheckoutButton ),
		] );
	}
}
