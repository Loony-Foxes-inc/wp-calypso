const JestEnvironmentNode = require( 'jest-environment-node' );

class JestEnvironmentE2E extends JestEnvironmentNode {
	testFailed = false;

	async handleTestEvent( event ) {
		switch ( event.name ) {
			case 'setup':
				this.global.__CURRENT_TEST_NAME__ = null;
				this.global.__CURRENT_TEST_FAILED__ = false;
				break;

			case 'test_start':
				this.global.__CURRENT_TEST_NAME__ = event.test.name;

				if ( this.testFailed ) {
					event.test.mode = 'skip';
				}
				break;

			case 'hook_failure':
				this.global.__CURRENT_TEST_FAILED__ = true;
				this.testFailed = true;
				// Re-throw the error. This triggers Jest to print
				// the contents nicely with color code.
				throw event.error;

			case 'test_fn_failure':
				this.global.__CURRENT_TEST_FAILED__ = true;
				this.testFailed = true;
				break;
		}
	}
}

module.exports = JestEnvironmentE2E;
