import { EliorImage, type EliorImageProps } from './EliorImage';

export interface PortraitImageProps extends EliorImageProps {
    ratio?: '4/5' | '3/4';
}

export function PortraitImage({ ratio = '4/5', ...props }: PortraitImageProps) {
    return <EliorImage aspectRatio={ratio} {...props} />;
}
