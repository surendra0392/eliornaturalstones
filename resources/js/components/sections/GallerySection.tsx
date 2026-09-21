import { Container } from '../common/Container';
import { SectionHeading } from './SectionHeading';
import { EliorImage } from '../media/EliorImage';
import type { MediaAsset } from '../../types/media';

interface GallerySectionProps {
    eyebrow?: string;
    title: string;
    description?: string;
    images?: Array<{
        src?: string;
        asset?: MediaAsset;
        title?: string;
        aspectRatio?: '16/9' | '4/3' | '3/2' | '4/5' | '1/1';
    }>;
}

export function GallerySection({
    eyebrow = 'Curated Perspectives',
    title,
    description,
    images = [],
}: GallerySectionProps) {
    return (
        <section className="bg-ivory-warm/50 border-border-subtle border-y py-20 lg:py-28">
            <Container>
                <SectionHeading
                    eyebrow={eyebrow}
                    title={title}
                    description={description}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((item, idx) => (
                        <div
                            key={idx}
                            className="group border-border-subtle bg-ivory relative overflow-hidden border"
                        >
                            <EliorImage
                                src={item.src}
                                asset={item.asset}
                                alt={item.title || `Perspectives ${idx + 1}`}
                                aspectRatio={item.aspectRatio || '4/3'}
                                className="transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            {item.title && (
                                <div className="text-graphite p-4 text-xs tracking-wider uppercase">
                                    {item.title}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
