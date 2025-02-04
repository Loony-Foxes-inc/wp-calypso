import PropTypes from 'prop-types';
import React from 'react';
import Search from 'calypso/components/search';
import urlSearch from 'calypso/lib/url-search';

export const PeopleSearch = ( { doSearch, search } ) => (
	<Search
		pinned
		fitsContainer
		onSearch={ doSearch }
		initialValue={ search }
		delaySearch
		analyticsGroup="People"
	/>
);

PeopleSearch.propTypes = {
	doSearch: PropTypes.func.isRequired,
	search: PropTypes.string,
};

export default urlSearch( PeopleSearch );
