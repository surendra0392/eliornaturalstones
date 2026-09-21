export interface NavItem {
    label: string;
    href: string;
    description?: string;
}

export const PUBLIC_NAV_ITEMS: NavItem[] = [
    {
        label: 'Collections',
        href: '/collections',
        description: 'Curated architectural stone reserves',
    },
    {
        label: 'Our Story',
        href: '/our-story',
        description: 'Heritage and quarry provenance',
    },
    {
        label: 'From Source to Space',
        href: '/from-source-to-space',
        description: 'Geology to architectural installation',
    },
    {
        label: 'Architect & Designer Services',
        href: '/architect-designer-services',
        description: 'Tailored curation and technical specification',
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
