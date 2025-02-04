import { localize } from 'i18n-calypso';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Notice from 'calypso/components/notice';
import NoticeAction from 'calypso/components/notice/notice-action';
import wpcom from 'calypso/lib/wp';
import { errorNotice, successNotice } from 'calypso/state/notices/actions';

import './style.scss';

const RESEND_IDLE = 0;
const RESEND_IN_PROGRESS = 1;
const RESEND_SUCCESS = 2;
const RESEND_ERROR = 3;

class HelpUnverifiedWarning extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			resendState: RESEND_IDLE,
		};
	}

	render() {
		const { resendState } = this.state;

		const resendStateToMessage = ( val ) => {
			switch ( val ) {
				case RESEND_IDLE:
					return this.props.translate(
						'Trouble activating your account? ' +
							"Just click this button and we'll resend the activation for you."
					);
				case RESEND_IN_PROGRESS:
					return '';
				case RESEND_SUCCESS:
					return this.props.translate( 'Activation email sent. Please check your inbox.' );
				case RESEND_ERROR:
					return this.props.translate( "There's been an error. Please try again later." );
				default:
					return 'Unknown activation email resending state.';
			}
		};

		const resendEmail = () => {
			this.setState( {
				resendState: RESEND_IN_PROGRESS,
			} );

			wpcom
				.undocumented()
				.me()
				.sendVerificationEmail()
				.then( () => {
					const nextResendState = RESEND_SUCCESS;

					this.setState( { resendState: nextResendState } );
					this.props.successNotice( resendStateToMessage( nextResendState ) );
				} )
				.catch( () => {
					const nextResendState = RESEND_ERROR;

					this.setState( { resendState: nextResendState } );
					this.props.errorNotice( resendStateToMessage( nextResendState ) );
				} );
		};

		/* eslint-disable wpcalypso/jsx-classname-namespace */
		return (
			RESEND_IDLE === resendState && (
				<Notice
					className="help-unverified-warning"
					status="is-warning"
					showDismiss={ false }
					text={ resendStateToMessage( resendState ) }
				>
					<NoticeAction href="#" onClick={ resendEmail }>
						{ this.props.translate( 'Resend Email' ) }
					</NoticeAction>
				</Notice>
			)
		);
	}
}

export default connect( null, {
	errorNotice,
	successNotice,
} )( localize( HelpUnverifiedWarning ) );
