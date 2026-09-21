import { useState, useRef, useEffect, type ImgHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import type { MediaAsset } from '../../types/media';

export type AspectRatioPreset =
    | '16/9'
    | '4/3'
    | '3/2'
    | '4/5'
    | '3/4'
    | '1/1'
    | 'auto';

export interface EliorImageProps extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'src'
> {
    asset?: MediaAsset | null;
    src?: string;
    alt: string;
    aspectRatio?: AspectRatioPreset;
    focalPoint?: { x: number; y: number };
    className?: string;
    containerClassName?: string;
    priority?: boolean;
    sizes?: string;
    width?: number;
    height?: number;
}

export function EliorImage({
    asset,
    src,
    alt,
    aspectRatio = 'auto',
    focalPoint,
    className,
    containerClassName,
    priority = false,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    width,
    height,
    ...props
}: EliorImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const primarySrc = asset?.large || asset?.medium || asset?.url || src || '';

    useEffect(() => {
        if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
            setIsLoaded(true);
        }
    }, [primarySrc]);
    const focal = focalPoint || asset?.focalPoint;
    const objectPosition = focal ? `${focal.x}% ${focal.y}%` : 'center center';

    const ratioClass = {
        '16/9': 'aspect-[16/9]',
        '4/3': 'aspect-[4/3]',
        '3/2': 'aspect-[3/2]',
        '4/5': 'aspect-[4/5]',
        '3/4': 'aspect-[3/4]',
        '1/1': 'aspect-square',
        auto: '',
    }[aspectRatio];

    const srcSet =
        asset?.thumb && asset?.large
            ? `${asset.thumb} 400w, ${asset.medium || asset.url} 800w, ${asset.large} 1920w`
            : undefined;

    return (
        <div
            className={cn(
                'bg-stone-light/60 relative overflow-hidden transition-colors',
                ratioClass,
                containerClassName,
            )}
        >
            {/* Graceful architectural loading skeleton */}
            {!isLoaded && primarySrc && (
                <div
                    className="bg-stone-light/80 absolute inset-0 animate-pulse transition-opacity duration-500"
                    aria-hidden="true"
                />
            )}

            {primarySrc ? (
                <img
                    ref={imgRef}
                    src={primarySrc}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding={priority ? 'sync' : 'async'}
                    fetchPriority={priority ? 'high' : 'auto'}
                    onLoad={() => setIsLoaded(true)}
                    style={{ objectPosition }}
                    className={cn(
                        'h-full w-full object-cover transition-opacity duration-700 ease-out',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                        className,
                    )}
                    {...props}
                />
            ) : (
                <div className="bg-stone-light/40 text-taupe flex h-full w-full items-center justify-center p-6 text-center font-serif text-xs tracking-widest uppercase">
                    Specimen Placeholder
                </div>
            )}
        </div>
    );
}
