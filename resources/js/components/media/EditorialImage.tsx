import { EliorImage, type EliorImageProps } from './EliorImage';
import { cn } from '../../lib/utils';

export interface EditorialImageProps extends EliorImageProps {
    caption?: string;
    credit?: string;
}

export function EditorialImage({
    caption,
    credit,
    aspectRatio = '4/5',
    containerClassName,
    className,
    ...props
}: EditorialImageProps) {
    return (
        <figure className={cn('relative w-full', containerClassName)}>
            <div className="border-border-subtle bg-ivory-light overflow-hidden border">
                <EliorImage
                    aspectRatio={aspectRatio}
                    className={cn(
                        'transition-transform duration-1000 ease-out hover:scale-102',
                        className,
                    )}
                    {...props}
                />
            </div>
            {(caption || credit) && (
                <figcaption className="text-graphite-muted mt-3 flex items-baseline justify-between text-xs tracking-wide">
                    {caption && (
                        <span className="font-serif italic">{caption}</span>
                    )}
                    {credit && (
                        <span className="text-taupe ml-auto text-[10px] tracking-[0.16em] uppercase">
                            {credit}
                        </span>
                    )}
                </figcaption>
            )}
        </figure>
    );
}
