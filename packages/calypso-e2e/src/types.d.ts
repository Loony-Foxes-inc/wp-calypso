// Browser Manager
export type viewportName = 'desktop' | 'mobile' | 'laptop' | 'tablet';
export type localeCode = string;

export type viewportSize = {
	width: number;
	height: number;
};

export type Plans = typeof PlansArray[ number ];
export const PlansArray = [ 'Free', 'Personal', 'Premium', 'Business', 'eCommerce' ] as const;
