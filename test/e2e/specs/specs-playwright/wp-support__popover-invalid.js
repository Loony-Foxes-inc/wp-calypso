import assert from 'assert';
import {
	DataHelper,
	LoginFlow,
	SidebarComponent,
	SupportComponent,
	setupHooks,
} from '@automattic/calypso-e2e';

describe( DataHelper.createSuiteTitle( 'Support: Popover' ), function () {
	let page;

	setupHooks( ( args ) => {
		page = args.page;
	} );

	describe.each( [
		{ siteType: 'Simple', user: 'defaultUser' },
		{ siteType: 'Atomic', user: 'wooCommerceUser' },
	] )( 'Unsupported search keywords ($siteType)', function ( { user } ) {
		let supportComponent;

		it( 'Log in', async function () {
			const loginFlow = new LoginFlow( page, user );
			await loginFlow.logIn();
		} );

		it( 'Open Settings page', async function () {
			const sidebarComponent = new SidebarComponent( page );
			await sidebarComponent.navigate( 'Settings', 'General' );
		} );

		it( 'Open support popover', async function () {
			supportComponent = new SupportComponent( page );
			await supportComponent.clickSupportButton();
		} );

		it( 'Displays default entries', async function () {
			const results = await supportComponent.getOverallResultsCount();
			assert.ok( results >= 5 );
		} );

		it( 'Enter empty search keyword', async function () {
			const keyword = '        ';
			await supportComponent.search( keyword );
		} );

		it( 'Continues to display default results', async function () {
			const defaultResults = await supportComponent.getOverallResultsCount();
			assert.notStrictEqual( 0, defaultResults );
		} );

		it( 'Clear keyword', async function () {
			await supportComponent.clearSearch();

			const defaultResults = await supportComponent.getOverallResultsCount();
			assert.notStrictEqual( 0, defaultResults );
			const supportResults = await supportComponent.getSupportResultsCount();
			assert.strictEqual( 0, supportResults );
			const adminResults = await supportComponent.getAdminResultsCount();
			assert.strictEqual( 0, adminResults );
		} );

		it( 'Enter invalid search keyword', async function () {
			const keyword = ';;;ppp;;;';
			await supportComponent.search( keyword );
		} );

		it( 'No search results are shown', async function () {
			await supportComponent.noResults();
		} );

		it( 'Close support popover', async function () {
			await supportComponent.clearSearch();
			await supportComponent.closePopover();
		} );
	} );
} );
