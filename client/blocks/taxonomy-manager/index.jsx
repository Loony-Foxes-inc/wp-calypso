import { Button } from '@automattic/components';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TermFormDialog from 'calypso/blocks/term-form-dialog';
import QueryTaxonomies from 'calypso/components/data/query-taxonomies';
import SearchCard from 'calypso/components/search-card';
import { recordGoogleEvent, bumpStat } from 'calypso/state/analytics/actions';
import { getPostTypeTaxonomy } from 'calypso/state/post-types/taxonomies/selectors';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import TermsList from './list';

import './style.scss';

export class TaxonomyManager extends Component {
	static propTypes = {
		taxonomy: PropTypes.string,
		labels: PropTypes.object,
		postType: PropTypes.string,
		siteId: PropTypes.number,
		recordGoogleEvent: PropTypes.func,
		bumpStat: PropTypes.func,
	};

	static defaultProps = {
		postType: 'post',
	};

	state = {
		search: null,
		termFormDialogOpened: false,
	};

	closeTermFormDialog = () => {
		this.setState( { termFormDialogOpened: false } );
	};

	newTerm = () => {
		const { taxonomy } = this.props;
		this.props.recordGoogleEvent( 'Taxonomy Manager', `Clicked Add ${ taxonomy }` );
		this.props.bumpStat( 'taxonomy_manager', `clicked_add_${ taxonomy }` );
		this.setState( {
			termFormDialogOpened: true,
			selectedTerm: undefined,
		} );
	};

	editTerm = ( term ) => {
		const { taxonomy } = this.props;
		this.props.recordGoogleEvent( 'Taxonomy Manager', `Clicked Edit ${ taxonomy }` );
		this.props.bumpStat( 'taxonomy_manager', `clicked_edit_${ taxonomy }` );
		this.setState( {
			termFormDialogOpened: true,
			selectedTerm: term,
		} );
	};

	onSearch = ( searchTerm ) => {
		if ( searchTerm !== this.state.search ) {
			this.setState( {
				search: searchTerm,
			} );
		}
	};

	render() {
		const { search } = this.state;
		const { siteId, postType, labels, taxonomy } = this.props;
		const query = {};
		if ( search && search.length ) {
			query.search = search;
		}

		return (
			<div>
				{ siteId && <QueryTaxonomies { ...{ siteId, postType } } /> }
				<div className="taxonomy-manager__header">
					<SearchCard onSearch={ this.onSearch } delaySearch />
					<div className="taxonomy-manager__actions">
						<Button compact primary onClick={ this.newTerm }>
							{ labels.add_new_item }
						</Button>
					</div>
				</div>
				<TermsList query={ query } taxonomy={ taxonomy } onTermClick={ this.editTerm } />
				<TermFormDialog
					showDialog={ this.state.termFormDialogOpened }
					onClose={ this.closeTermFormDialog }
					taxonomy={ this.props.taxonomy }
					postType={ this.props.postType }
					searchTerm={ search }
					term={ this.state.selectedTerm }
					showDescriptionInput
				/>
			</div>
		);
	}
}

export default connect(
	( state, ownProps ) => {
		const { taxonomy, postType } = ownProps;
		const siteId = getSelectedSiteId( state );
		const labels = get( getPostTypeTaxonomy( state, siteId, postType, taxonomy ), 'labels', {} );
		return { labels, siteId };
	},
	{ recordGoogleEvent, bumpStat }
)( TaxonomyManager );
