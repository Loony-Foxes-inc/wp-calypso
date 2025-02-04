import { ActionButtons } from '@automattic/onboarding';
import classNames from 'classnames';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FormattedHeader from 'calypso/components/formatted-header';
import NavigationLink from 'calypso/signup/navigation-link';
import './style.scss';

class StepWrapper extends Component {
	static propTypes = {
		shouldHideNavButtons: PropTypes.bool,
		translate: PropTypes.func.isRequired,
		hideFormattedHeader: PropTypes.bool,
		hideBack: PropTypes.bool,
		hideSkip: PropTypes.bool,
		// Allows to force a back button in the first step for example.
		// You should only force this when you're passing a backUrl.
		allowBackFirstStep: PropTypes.bool,
		skipLabelText: PropTypes.string,
		skipHeadingText: PropTypes.string,
		skipButtonAlign: PropTypes.oneOf( [ 'top', 'bottom', 'top-right' ] ),
		// Displays an <hr> above the skip button and adds more white space
		isLargeSkipLayout: PropTypes.bool,
		isExternalBackUrl: PropTypes.bool,
		headerButton: PropTypes.node,
	};

	static defaultProps = {
		allowBackFirstStep: false,
		skipButtonAlign: 'bottom',
	};

	renderBack() {
		if ( this.props.shouldHideNavButtons ) {
			return null;
		}
		return (
			<NavigationLink
				direction="back"
				flowName={ this.props.flowName }
				positionInFlow={ this.props.positionInFlow }
				stepName={ this.props.stepName }
				stepSectionName={ this.props.stepSectionName }
				backUrl={ this.props.backUrl }
				rel={ this.props.isExternalBackUrl ? 'external' : '' }
				labelText={ this.props.backLabelText }
				allowBackFirstStep={ this.props.allowBackFirstStep }
			/>
		);
	}

	renderSkip( { borderless } ) {
		if ( ! this.props.shouldHideNavButtons && this.props.goToNextStep ) {
			return (
				<div className="step-wrapper__skip-wrapper">
					{ this.props.skipHeadingText && (
						<div className="step-wrapper__skip-heading">{ this.props.skipHeadingText }</div>
					) }
					<NavigationLink
						direction="forward"
						goToNextStep={ this.props.goToNextStep }
						defaultDependencies={ this.props.defaultDependencies }
						flowName={ this.props.flowName }
						stepName={ this.props.stepName }
						labelText={ this.props.skipLabelText }
						cssClass={ this.props.skipHeadingText && 'navigation-link--has-skip-heading' }
						borderless={ borderless }
					/>
				</div>
			);
		}
	}

	headerText() {
		if ( this.props.positionInFlow === 0 ) {
			if ( this.props.headerText !== undefined ) {
				return this.props.headerText;
			}

			return this.props.translate( "Let's get started" );
		}

		if ( this.props.fallbackHeaderText !== undefined ) {
			return this.props.fallbackHeaderText;
		}
	}

	subHeaderText() {
		if ( this.props.positionInFlow === 0 ) {
			if ( this.props.subHeaderText !== undefined ) {
				return this.props.subHeaderText;
			}

			return this.props.translate( 'Welcome to the best place for your WordPress website.' );
		}

		if ( this.props.fallbackSubHeaderText !== undefined ) {
			return this.props.fallbackSubHeaderText;
		}
	}

	render() {
		const {
			stepContent,
			headerButton,
			hideFormattedHeader,
			hideBack,
			hideSkip,
			isLargeSkipLayout,
			isWideLayout,
			skipButtonAlign,
			align,
		} = this.props;

		const hasHeaderButtons = headerButton || ( ! hideSkip && skipButtonAlign === 'top-right' );
		const classes = classNames( 'step-wrapper', this.props.className, {
			'is-wide-layout': isWideLayout,
			'is-large-skip-layout': isLargeSkipLayout,
			'has-header-buttons': hasHeaderButtons,
		} );

		return (
			<>
				<div className={ classes }>
					{ ! hideBack && this.renderBack() }

					{ ! hideFormattedHeader && (
						<div className="step-wrapper__header">
							<FormattedHeader
								id={ 'step-header' }
								headerText={ this.headerText() }
								subHeaderText={ this.subHeaderText() }
								align={ align }
							/>
							{ hasHeaderButtons && (
								<ActionButtons>
									{ headerButton }
									{ ! hideSkip && skipButtonAlign === 'top-right' && (
										<div className="step-wrapper__buttons is-top-right-buttons">
											{ this.renderSkip( { borderless: false } ) }
										</div>
									) }
								</ActionButtons>
							) }
						</div>
					) }

					{ ! hideSkip && skipButtonAlign === 'top' && (
						<div className="step-wrapper__buttons is-top-buttons">
							{ this.renderSkip( { borderless: true } ) }
						</div>
					) }

					<div className="step-wrapper__content">{ stepContent }</div>

					{ ! hideSkip && skipButtonAlign === 'bottom' && (
						<div className="step-wrapper__buttons">
							{ isLargeSkipLayout && <hr className="step-wrapper__skip-hr" /> }
							{ this.renderSkip( { borderless: true } ) }
						</div>
					) }
				</div>
			</>
		);
	}
}

export default localize( StepWrapper );
