import { CompactCard } from '@automattic/components';
import React, { FunctionComponent, ComponentProps } from 'react';
import PaymentMethodDetails from './payment-method-details';

import 'calypso/me/purchases/payment-methods/style.scss';

interface Props {
	card: ComponentProps< typeof PaymentMethodDetails >;
}

const PaymentMethod: FunctionComponent< Props > = ( { card, children } ) => {
	return (
		<CompactCard className="payment-method__wrapper">
			<div className="payment-method">
				{ card ? <PaymentMethodDetails { ...card } /> : children }
			</div>
		</CompactCard>
	);
};

export default PaymentMethod;
