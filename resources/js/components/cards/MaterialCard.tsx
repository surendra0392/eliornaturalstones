import { Link } from '@inertiajs/react';
import { EliorImage } from '../media/EliorImage';
import type { Variety } from '../../types/stone';

interface MaterialCardProps {
    variety: Variety;
}

export function MaterialCard({ variety }: MaterialCardProps) {
    return (
        <div className="group border-border-subtle bg-ivory-light hover:border-bronze/60 hover:shadow-[0_12px_36px_-12px_rgba(15,15,15,0.08)] hover:-translate-y-1 relative flex flex-col border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="relative overflow-hidden">
                <EliorImage
                    src={
                        variety.slab_image || variety.swatch_image || undefined
                    }
                    alt={variety.name}
                    aspectRatio="1/1"
                    className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                    <div className="text-taupe flex items-center justify-between text-[10px] font-medium tracking-[0.2em] uppercase">
                        <span>{variety.origin || 'Selected Origin'}</span>
                        <span>{variety.color_family || 'Natural'}</span>
                    </div>

                    <h4 className="text-graphite group-hover:text-bronze mt-2.5 font-serif text-xl font-normal transition-colors">
                        {variety.name}
                    </h4>

                    {variety.finishes && variety.finishes.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {variety.finishes.slice(0, 3).map((finish) => (
                                <span
                                    key={finish}
                                    className="border-border-subtle bg-stone-light/40 text-graphite-muted border px-2 py-0.5 text-[9px] tracking-wider uppercase"
                                >
                                    {finish}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-border-subtle/60 mt-5 flex items-center justify-between border-t pt-3">
                    <span className="text-taupe text-[10px] tracking-widest uppercase">
                        Architectural Spec
                    </span>
                    <Link
                        href={`/contact?spec=${encodeURIComponent(variety.name)}`}
                        className="group/link text-graphite hover:text-bronze flex items-center text-[10px] font-medium tracking-widest uppercase transition-colors"
                    >
                        <span>Request Sample</span>
                        <span className="ml-1 transition-transform duration-300 group-hover/link:translate-x-1">
                            →
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
