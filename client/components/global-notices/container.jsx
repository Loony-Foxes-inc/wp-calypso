import classNames from 'classnames';
import React from 'react';

import './style.scss';

export default function GlobalNoticesContainer( { id, className, children } ) {
	return (
		<div id={ id } className={ classNames( 'global-notices', className ) }>
			{ children }
		</div>
	);
}
