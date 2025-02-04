import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import DocumentHead from 'calypso/components/data/document-head';
import QueryRewindState from 'calypso/components/data/query-rewind-state';
import QuerySitePurchases from 'calypso/components/data/query-site-purchases';
import EmptyContent from 'calypso/components/empty-content';
import FormattedHeader from 'calypso/components/formatted-header';
import Main from 'calypso/components/main';
import SidebarNavigation from 'calypso/my-sites/sidebar-navigation';
import JetpackCredentials from 'calypso/my-sites/site-settings/jetpack-credentials';
import JetpackDevModeNotice from 'calypso/my-sites/site-settings/jetpack-dev-mode-notice';
import SiteSettingsNavigation from 'calypso/my-sites/site-settings/navigation';
import { siteHasScanProductPurchase } from 'calypso/state/purchases/selectors';
import isRewindActive from 'calypso/state/selectors/is-rewind-active';
import isSiteFailedMigrationSource from 'calypso/state/selectors/is-site-failed-migration-source';
import { isJetpackSite } from 'calypso/state/sites/selectors';
import { getSelectedSite, getSelectedSiteId } from 'calypso/state/ui/selectors';

const SiteSettingsJetpack = ( { site, siteId, siteIsJetpack, showCredentials, translate } ) => {
	//todo: this check makes sense in Jetpack section?
	if ( ! siteIsJetpack ) {
		return (
			<EmptyContent
				action={ translate( 'Manage general settings for %(site)s', {
					args: { site: site.name },
				} ) }
				actionURL={ '/settings/general/' + site.slug }
				title={ translate( 'No Jetpack configuration is required.' ) }
				// line={ translate( 'Security management is automatic for WordPress.com sites.' ) }
				illustration="/calypso/images/illustrations/illustration-jetpack.svg"
			/>
		);
	}

	return (
		<Main className="settings-jetpack site-settings">
			<QueryRewindState siteId={ siteId } />
			<QuerySitePurchases siteId={ siteId } />
			<DocumentHead title={ translate( 'Jetpack Settings' ) } />
			<JetpackDevModeNotice />
			<SidebarNavigation />
			<FormattedHeader
				brandFont
				className="settings-jetpack__page-heading"
				headerText={ translate( 'Jetpack Settings' ) }
				align="left"
			/>
			<SiteSettingsNavigation site={ site } section="jetpack" />
			{ showCredentials && <JetpackCredentials /> }
		</Main>
	);
};

SiteSettingsJetpack.propTypes = {
	site: PropTypes.object,
	siteId: PropTypes.number,
	siteIsJetpack: PropTypes.bool,
	showCredentials: PropTypes.bool,
};

export default connect( ( state ) => {
	const site = getSelectedSite( state );
	const siteId = getSelectedSiteId( state );

	return {
		site,
		siteId,
		siteIsJetpack: isJetpackSite( state, siteId ),
		showCredentials:
			isSiteFailedMigrationSource( state, siteId ) ||
			isRewindActive( state, siteId ) ||
			siteHasScanProductPurchase( state, siteId ),
	};
} )( localize( SiteSettingsJetpack ) );
