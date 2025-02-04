import { useTranslate } from 'i18n-calypso';
import React from 'react';

import './style.scss';

export default function NoResults( props ) {
	const translate = useTranslate();
	const { image, text = translate( 'No results.' ) } = props;
	return (
		<div className="no-results">
			{ image && <img className="no-results__img" src={ image } alt="" /> }
			<span>{ text }</span>
		</div>
	);
}
