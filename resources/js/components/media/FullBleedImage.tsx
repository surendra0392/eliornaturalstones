import { EliorImage, type EliorImageProps } from './EliorImage';
import { cn } from '../../lib/utils';

export interface FullBleedImageProps extends EliorImageProps {
    maxHeight?: string;
}

export function FullBleedImage({
    maxHeight = 'max-h-[85vh]',
    containerClassName,
    className,
    ...props
}: FullBleedImageProps) {
    return (
        <div
            className={cn(
                'bg-ivory-warm relative w-full overflow-hidden',
                maxHeight,
                containerClassName,
            )}
        >
            <EliorImage
                aspectRatio="16/9"
                containerClassName="w-full h-full"
                className={cn('h-full w-full object-cover', className)}
                {...props}
            />
        </div>
    );
}
