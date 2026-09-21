import { Link } from '@inertiajs/react';
import { EliorImage } from '../media/EliorImage';
import { HOMEPAGE_IMAGES } from '../../data/homepageImages';
import type { Collection } from '../../types/stone';

interface CollectionCardProps {
    collection: Collection;
    index?: number;
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
    const curatedImage = HOMEPAGE_IMAGES.collections[collection.slug]?.src;
    const imageSrc = collection.hero_image || curatedImage || undefined;
    const altText =
        HOMEPAGE_IMAGES.collections[collection.slug]?.alt || collection.name;

    return (
        <Link
            href={`/collections/${collection.slug}`}
            className="group border-border-subtle bg-ivory-light hover:border-bronze/70 hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)] hover:-translate-y-1.5 focus-visible:outline-graphite relative flex flex-col overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2"
        >
            <div className="relative overflow-hidden">
                <EliorImage
                    src={imageSrc}
                    asset={collection.hero_asset}
                    alt={altText}
                    aspectRatio="4/3"
                    className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-graphite/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden="true"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 lg:p-7">
                <div>
                    <div className="text-taupe flex items-center justify-between text-[10px] font-medium tracking-[0.24em] uppercase">
                        <span>
                            {index !== undefined
                                ? String(index + 1).padStart(2, '0')
                                : ''}
                        </span>
                        <span>
                            {collection.varieties_count
                                ? `${collection.varieties_count} Specimens`
                                : 'Collection'}
                        </span>
                    </div>

                    <h3 className="text-graphite group-hover:text-bronze-dark mt-3 font-serif text-2xl font-light tracking-[-0.01em] transition-colors duration-300">
                        {collection.name}
                    </h3>

                    {collection.tagline && (
                        <p className="text-graphite-muted mt-2 line-clamp-2 text-xs leading-relaxed">
                            {collection.tagline}
                        </p>
                    )}
                </div>

                <div className="text-graphite group-hover:text-bronze mt-6 flex items-center text-[11px] font-medium tracking-[0.2em] uppercase transition-colors">
                    Explore Reserve{' '}
                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                    </span>
                </div>
            </div>
        </Link>
    );
}
