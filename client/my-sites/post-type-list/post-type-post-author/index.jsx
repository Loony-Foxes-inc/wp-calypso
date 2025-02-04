import { get } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getPost } from 'calypso/state/posts/selectors';

import './style.scss';

function PostTypePostAuthor( { name } ) {
	if ( ! name ) {
		return null;
	}

	return (
		<div className="post-type-post-author">
			<div className="post-type-post-author__name">{ name }</div>
		</div>
	);
}

PostTypePostAuthor.propTypes = {
	globalId: PropTypes.string,
	name: PropTypes.string,
};

export default connect( ( state, { globalId } ) => {
	const post = getPost( state, globalId );

	return {
		name: get( post, [ 'author', 'name' ] ),
	};
} )( PostTypePostAuthor );
