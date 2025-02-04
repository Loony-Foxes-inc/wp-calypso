import { localize } from 'i18n-calypso';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Notice from 'calypso/components/notice';
import { getCurrentUser, isCurrentUserEmailVerified } from 'calypso/state/current-user/selectors';

class SetupNotices extends Component {
	static propTypes = {
		currentUserEmail: PropTypes.string,
		currentUserEmailVerified: PropTypes.bool,
		translate: PropTypes.func,
	};

	possiblyRenderEmailWarning = () => {
		const { currentUserEmail, currentUserEmailVerified, translate } = this.props;

		if ( ! currentUserEmail || currentUserEmailVerified ) {
			return null;
		}

		return (
			<Notice
				status="is-warning"
				showDismiss={ false }
				text={ translate(
					"You need to confirm your email address to activate your account. We've sent " +
						'an email to {{strong}}%(email)s{{/strong}} with instructions for you to follow.',
					{
						components: {
							strong: <strong />,
						},
						args: {
							email: currentUserEmail,
						},
					}
				) }
			/>
		);
	};

	render = () => {
		return <div>{ this.possiblyRenderEmailWarning() }</div>;
	};
}

function mapStateToProps( state ) {
	const currentUser = getCurrentUser( state );
	const currentUserEmail = get( currentUser, 'email', '' );
	const currentUserEmailVerified = isCurrentUserEmailVerified( state );

	return {
		currentUserEmail,
		currentUserEmailVerified,
	};
}

export default connect( mapStateToProps )( localize( SetupNotices ) );
