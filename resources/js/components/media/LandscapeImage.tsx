import { EliorImage, type EliorImageProps } from './EliorImage';

export interface LandscapeImageProps extends EliorImageProps {
    ratio?: '16/9' | '3/2';
}

export function LandscapeImage({
    ratio = '16/9',
    ...props
}: LandscapeImageProps) {
    return <EliorImage aspectRatio={ratio} {...props} />;
}
