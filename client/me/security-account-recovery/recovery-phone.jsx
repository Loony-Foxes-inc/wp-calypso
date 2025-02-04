import { localize } from 'i18n-calypso';
import React, { Component } from 'react';
import accept from 'calypso/lib/accept';
import EditPhone from './edit-phone';
import ManageContact from './manage-contact';

class RecoveryPhone extends Component {
	render() {
		const { phone, isLoading, translate, disabled } = this.props;

		return (
			<ManageContact
				type="sms"
				isLoading={ isLoading }
				title={ translate( 'Recovery SMS number', {
					comment: 'Account security',
				} ) }
				subtitle={ phone ? <span dir="ltr">{ phone.numberFull }</span> : translate( 'Not set' ) }
				hasValue={ !! phone }
				disabled={ disabled }
				onSave={ this.onSave }
				onDelete={ this.onDelete }
			>
				<EditPhone storedPhone={ phone } />
			</ManageContact>
		);
	}

	onSave = ( phone ) => {
		this.props.updatePhone( phone );
	};

	onDelete = () => {
		const { translate, deletePhone } = this.props;

		accept( translate( 'Are you sure you want to remove the SMS number?' ), ( accepted ) => {
			if ( accepted ) {
				deletePhone();
			}
		} );
	};
}

export default localize( RecoveryPhone );
