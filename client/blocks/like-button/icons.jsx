import { Gridicon } from '@automattic/components';
import PropTypes from 'prop-types';
import React from 'react';

import './icons.scss';

const LikeIcons = ( { size } ) => (
	<span className="like-button__like-icons">
		<Gridicon icon="star" size={ size } />
		<Gridicon icon="star-outline" size={ size } />
	</span>
);

LikeIcons.propTypes = {
	size: PropTypes.number,
};

LikeIcons.defaultProps = {
	size: 24,
};

export default LikeIcons;
