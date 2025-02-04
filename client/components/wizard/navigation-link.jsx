import { Button, Gridicon } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';

import './navigation-link.scss';

function NavigationLink( { direction, text, href, onClick } ) {
	const translate = useTranslate();
	const linkText =
		text || ( direction === 'back' ? translate( 'Back' ) : translate( 'Skip for now' ) );

	return (
		<Button
			compact
			borderless
			className="wizard__navigation-link"
			href={ href }
			onClick={ onClick }
		>
			{ direction === 'back' && <Gridicon icon="arrow-left" size={ 18 } /> }
			{ linkText }
			{ direction === 'forward' && <Gridicon icon="arrow-right" size={ 18 } /> }
		</Button>
	);
}

NavigationLink.propTypes = {
	direction: PropTypes.oneOf( [ 'back', 'forward' ] ).isRequired,
	text: PropTypes.string,
	href: PropTypes.string,
	onClick: PropTypes.func,
};

export default NavigationLink;
