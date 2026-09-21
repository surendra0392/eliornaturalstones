export interface ContactImageMeta {
    src: string;
    alt: string;
    caption?: string;
    aspectRatio?: '16/9' | '4/3' | '3/2' | '4/5' | '3/4' | '1/1' | 'auto';
}

export interface ContactImageRegistry {
    hero: ContactImageMeta;
    intro: ContactImageMeta;
    directContact: ContactImageMeta;
    closing: ContactImageMeta;
}

export const contactImages: ContactImageRegistry = {
    hero: {
        src: '/images/elior/contact/contact-hero.webp',
        alt: 'Refined architectural interior with natural limestone walls, polished concrete flooring, and soft natural daylight',
        aspectRatio: '16/9',
    },
    intro: {
        src: '/images/elior/contact/contact-intro.webp',
        alt: 'Monumental architectural stone wall with subtle linear texture and quiet daylight casting geometric shadows',
        aspectRatio: '4/5',
    },
    directContact: {
        src: '/images/elior/contact/contact-direct.webp',
        alt: 'Minimalist stone surfaces in an architectural residential volume bathed in warm afternoon illumination',
        aspectRatio: '4/3',
    },
    closing: {
        src: '/images/elior/contact/contact-closing.webp',
        alt: 'Expansive contemporary villa featuring monolithic natural stone facade and quiet courtyard transition',
        aspectRatio: '16/9',
    },
};
