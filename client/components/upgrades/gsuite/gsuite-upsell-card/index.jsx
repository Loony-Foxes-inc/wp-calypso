import { Button, CompactCard } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import QueryProducts from 'calypso/components/data/query-products-list';
import GSuiteNewUserList from 'calypso/components/gsuite/gsuite-new-user-list';
import { getGoogleMailServiceFamily } from 'calypso/lib/gsuite';
import { GSUITE_SLUG_PROP_TYPES } from 'calypso/lib/gsuite/constants';
import { areAllUsersValid, getItemsForCart, newUsers } from 'calypso/lib/gsuite/new-users';
import { recordTracksEvent as recordTracksEventAction } from 'calypso/state/analytics/actions';
import GSuiteUpsellProductDetails from './product-details';

import './style.scss';

const GSuiteUpsellCard = ( {
	domain,
	productSlug,
	onAddEmailClick,
	onSkipClick,
	recordTracksEvent,
} ) => {
	const [ users, setUsers ] = useState( newUsers( domain ) );

	const canContinue = areAllUsersValid( users );
	const translate = useTranslate();

	const recordClickEvent = ( eventName ) => {
		recordTracksEvent( eventName, {
			domain_name: domain,
			user_count: users.length,
		} );
	};

	const recordUsersChangedEvent = ( previousUsers, nextUsers ) => {
		if ( previousUsers.length !== nextUsers.length ) {
			recordTracksEvent( 'calypso_checkout_gsuite_upgrade_users_changed', {
				domain_name: domain,
				next_user_count: nextUsers.length,
				prev_user_count: previousUsers.length,
			} );
		}
	};

	const handleAddEmailClick = () => {
		recordClickEvent( `calypso_checkout_gsuite_upgrade_add_email_button_click` );

		if ( canContinue ) {
			onAddEmailClick( getItemsForCart( [ domain ], productSlug, users ) );
		}
	};

	const handleSkipClick = () => {
		recordClickEvent( `calypso_checkout_gsuite_upgrade_skip_button_click` );

		onSkipClick();
	};

	const handleReturnKeyPress = ( event ) => {
		// Simulate an implicit submission for the add user form :)
		if ( event.key === 'Enter' ) {
			handleAddEmailClick();
		}
	};

	const handleUsersChange = ( changedUsers ) => {
		recordUsersChangedEvent( users, changedUsers );

		setUsers( changedUsers );
	};

	return (
		<div className="gsuite-upsell-card__form">
			<QueryProducts />

			<CompactCard>
				<header className="gsuite-upsell-card__header">
					<h2 className="gsuite-upsell-card__title">
						{ translate( 'Add professional email from %(productFamily)s to %(domain)s', {
							args: {
								domain,
								productFamily: getGoogleMailServiceFamily( productSlug ),
							},
							comment: '%(productFamily)s can be either "G Suite" or "Google Workspace"',
						} ) }
					</h2>

					<h5 className="gsuite-upsell-card__no-setup-required">
						{ translate( 'No setup or software required. Easy to manage from your dashboard.' ) }
					</h5>
				</header>
			</CompactCard>

			<CompactCard>
				<GSuiteUpsellProductDetails domain={ domain } productSlug={ productSlug } />

				<GSuiteNewUserList
					extraValidation={ ( user ) => user }
					selectedDomainName={ domain }
					onUsersChange={ handleUsersChange }
					users={ users }
					onReturnKeyPress={ handleReturnKeyPress }
				>
					<div className="gsuite-upsell-card__buttons">
						<Button className="gsuite-upsell-card__skip-button" onClick={ handleSkipClick }>
							{ translate( 'Skip for now' ) }
						</Button>

						<Button
							className="gsuite-upsell-card__add-email-button"
							primary
							disabled={ ! canContinue }
							onClick={ handleAddEmailClick }
						>
							{ translate( 'Purchase %(productFamily)s', {
								args: { productFamily: getGoogleMailServiceFamily( productSlug ) },
								comment: '%(productFamily)s can be either "G Suite" or "Google Workspace"',
							} ) }
						</Button>
					</div>
				</GSuiteNewUserList>
			</CompactCard>
		</div>
	);
};

GSuiteUpsellCard.propTypes = {
	domain: PropTypes.string.isRequired,
	productSlug: GSUITE_SLUG_PROP_TYPES,
	onAddEmailClick: PropTypes.func.isRequired,
	onSkipClick: PropTypes.func.isRequired,
};

export default connect( null, {
	recordTracksEvent: recordTracksEventAction,
} )( GSuiteUpsellCard );
