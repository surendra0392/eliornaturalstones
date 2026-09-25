export interface NavItem {
    label: string;
    href: string;
    description?: string;
}

export interface NavCollection {
    id?: number;
    name: string;
    slug: string;
}

export const DEFAULT_COLLECTIONS_NAV: NavCollection[] = [
    { name: 'Marble', slug: 'italian-marble' },
    { name: 'Granites', slug: 'granites' },
    { name: 'Slate Stone', slug: 'slate-stone' },
    { name: 'Limestones', slug: 'limestones' },
    { name: 'Sand Stone', slug: 'sandstone' },
    { name: 'Cobble Stones', slug: 'cobble-stones' },
    { name: 'Pebbles', slug: 'pebbles' },
    { name: 'Quartz', slug: 'quartz' },
    { name: 'Sculptures', slug: 'sculptures' },
];

export const PUBLIC_NAV_ITEMS: NavItem[] = [
    {
        label: 'Our Story',
        href: '/our-story',
        description: 'Heritage and quarry provenance',
    },
    {
        label: 'Collections',
        href: '/collections',
        description: 'Curated architectural stone reserves',
    },
    {
        label: 'From Source to Space',
        href: '/from-source-to-space',
        description: 'Geology to architectural installation',
    },
    {
        label: 'Projects',
        href: '/projects',
        description: 'Architectural commissions & stone installations',
    },
    {
        label: 'Contact',
        href: '/contact',
        description: 'Private viewings and inquiries',
    },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Collections', href: '/admin/collections' },
    { label: 'Varieties', href: '/admin/varieties' },
    { label: 'Media Library', href: '/admin/media' },
    { label: 'Pages', href: '/admin/pages' },
    { label: 'Enquiries', href: '/admin/enquiries' },
    { label: 'Settings', href: '/admin/settings' },
];
