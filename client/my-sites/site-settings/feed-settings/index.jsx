import { CompactCard } from '@automattic/components';
import { ToggleControl } from '@wordpress/components';
import { localize } from 'i18n-calypso';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormFieldset from 'calypso/components/forms/form-fieldset';
import FormSettingExplanation from 'calypso/components/forms/form-setting-explanation';
import FormTextInput from 'calypso/components/forms/form-text-input';
import { localizeUrl } from 'calypso/lib/i18n-utils';
import SettingsSectionHeader from 'calypso/my-sites/site-settings/settings-section-header';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';

import './style.scss';

class FeedSettings extends Component {
	render() {
		const {
			fields,
			handleSubmitForm,
			handleToggle,
			isRequestingSettings,
			isSavingSettings,
			onChangeField,
			translate,
		} = this.props;

		const isDisabled = isRequestingSettings || isSavingSettings;

		if ( 'undefined' === typeof fields.posts_per_rss ) {
			// Do not allow these settings to be updated if they cannot be read from the API.
			return null;
		}

		return (
			<div className="feed-settings">
				<SettingsSectionHeader
					disabled={ isDisabled }
					isSaving={ isSavingSettings }
					onButtonClick={ handleSubmitForm }
					showButton
					title={ translate( 'Feed settings' ) }
				/>
				<CompactCard>
					<FormFieldset>
						{ translate( 'Display {{field /}} most recent blog posts', {
							components: {
								field: (
									<FormTextInput
										name="posts_per_rss"
										type="number"
										step="1"
										min="0"
										id="posts_per_rss"
										value={ fields.posts_per_rss }
										onChange={ onChangeField( 'posts_per_rss' ) }
										disabled={ isDisabled }
									/>
								),
							},
						} ) }
						<FormSettingExplanation>
							{ translate(
								"The number of posts to include in your site's feed. {{link}}Learn more about feeds{{/link}}",
								{
									components: {
										link: <a href={ localizeUrl( 'https://wordpress.com/support/feeds/' ) } />,
									},
								}
							) }
						</FormSettingExplanation>
					</FormFieldset>
					<ToggleControl
						checked={ !! fields.rss_use_excerpt }
						disabled={ isDisabled }
						onChange={ handleToggle( 'rss_use_excerpt' ) }
						label={ translate( 'Limit feed to excerpt only' ) }
					/>
					<FormSettingExplanation isIndented className="feed-settings__excerpt-explanation">
						{ translate(
							'Enable this to include only an excerpt of your content. ' +
								'Users will need to visit your site to view the full content.'
						) }
					</FormSettingExplanation>
				</CompactCard>
			</div>
		);
	}
}

export default connect( ( state ) => {
	const selectedSiteId = getSelectedSiteId( state );

	return {
		selectedSiteId,
	};
} )( localize( FeedSettings ) );
