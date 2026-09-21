import { usePage } from '@inertiajs/react';
import { Container } from '../../layout/Container';
import { contactContent } from '../../../data/contactContent';
import type { PublicSiteSettings } from '../../../types/setting';

interface DirectContactProps {
    content?: Partial<typeof contactContent.directContact>;
}

export function DirectContactSection({ content }: DirectContactProps = {}) {
    const { siteSettings } = usePage<{
        siteSettings?: PublicSiteSettings;
    }>().props;

    const phoneDisplay =
        content?.phoneDisplay ||
        siteSettings?.primary_phone ||
        contactContent.directContact.phoneDisplay;
    const phoneValue =
        content?.phoneValue ||
        phoneDisplay.replace(/\s+/g, '');
    const emailValue =
        content?.emailValue ||
        siteSettings?.primary_email ||
        contactContent.directContact.emailValue;
    const locationValue =
        content?.locationValue ||
        siteSettings?.business_location ||
        siteSettings?.default_location ||
        contactContent.directContact.locationValue;

    const directContact = {
        ...contactContent.directContact,
        ...content,
        phoneDisplay,
        phoneValue,
        emailValue,
        locationValue,
    };

    return (
        <section className="border-t border-border-subtle bg-ivory py-16 md:py-20 lg:py-24">
            <Container>
                <div className="mx-auto max-w-4xl text-center">
                    <p className="font-eyebrow text-bronze">
                        DIRECT CONTACT
                    </p>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl leading-tight font-normal tracking-tight text-graphite">
                        {directContact.heading}
                    </h2>

                    <div className="mt-10 grid grid-cols-1 gap-8 border-y border-border-subtle py-10 sm:grid-cols-3">
                        {/* Phone */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-medium tracking-[0.2em] text-taupe uppercase">
                                {directContact.phoneLabel}
                            </span>
                            <p className="font-serif text-lg sm:text-xl text-graphite">
                                <a
                                    href={`tel:${directContact.phoneValue}`}
                                    className="transition-colors hover:text-bronze"
                                >
                                    {directContact.phoneDisplay}
                                </a>
                            </p>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-medium tracking-[0.2em] text-taupe uppercase">
                                {directContact.emailLabel}
                            </span>
                            <p className="font-serif text-lg sm:text-xl text-graphite">
                                <a
                                    href={`mailto:${directContact.emailValue}`}
                                    className="transition-colors hover:text-bronze"
                                >
                                    {directContact.emailValue}
                                </a>
                            </p>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-medium tracking-[0.2em] text-taupe uppercase">
                                {directContact.locationLabel}
                            </span>
                            <p className="font-serif text-lg sm:text-xl text-graphite">
                                {directContact.locationValue}
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
