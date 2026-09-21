import { EliorImage, type EliorImageProps } from './EliorImage';
import { cn } from '../../lib/utils';

export interface MaterialImageProps extends EliorImageProps {
    finishLabel?: string;
    zoomOnHover?: boolean;
}

export function MaterialImage({
    finishLabel,
    zoomOnHover = true,
    aspectRatio = '1/1',
    containerClassName,
    className,
    ...props
}: MaterialImageProps) {
    return (
        <div
            className={cn(
                'group border-border-subtle bg-ivory-light relative overflow-hidden border',
                containerClassName,
            )}
        >
            <EliorImage
                aspectRatio={aspectRatio}
                className={cn(
                    'transition-transform duration-700 ease-out',
                    zoomOnHover && 'group-hover:scale-106',
                    className,
                )}
                {...props}
            />

            {finishLabel && (
                <div className="border-graphite/20 bg-ivory/90 text-graphite absolute bottom-3 left-3 border px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase backdrop-blur-sm">
                    {finishLabel}
                </div>
            )}
        </div>
    );
}
