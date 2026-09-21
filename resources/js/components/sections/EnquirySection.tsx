import { useState, type FormEvent } from 'react';
import { Container } from '../common/Container';
import { apiClient } from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';

interface EnquirySectionProps {
    initialMaterial?: string;
}

export function EnquirySection({ initialMaterial = '' }: EnquirySectionProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [type, setType] = useState('trade');
    const [materialInterest, setMaterialInterest] = useState(initialMaterial);
    const [message, setMessage] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const res = await apiClient(API_ENDPOINTS.v1.enquiries, {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    company,
                    type,
                    material_interest: materialInterest,
                    message,
                }),
            });

            setSuccessMessage(
                res.message || 'Your inquiry has been registered.',
            );
            setName('');
            setEmail('');
            setPhone('');
            setCompany('');
            setMessage('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage(
                    'Unable to register inquiry. Please try again.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="py-20 lg:py-28">
            <Container size="narrow">
                <div className="border-border-subtle bg-ivory-light border p-8 shadow-sm lg:p-14">
                    <p className="text-bronze text-[11px] font-medium tracking-[0.3em] uppercase">
                        Direct Architectural Contact
                    </p>
                    <h2 className="text-graphite mt-2 font-serif text-3xl font-light tracking-tight sm:text-4xl">
                        Request Quarry Specification
                    </h2>
                    <p className="text-graphite-muted mt-3 text-sm">
                        Connect with our material specialists for sample
                        requests, quarry block allocations, and technical
                        specification data.
                    </p>

                    {successMessage && (
                        <div className="border-stone-dark bg-stone-light/40 text-graphite mt-8 border p-4 text-xs tracking-wide">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mt-8 border border-red-200 bg-red-50/50 p-4 text-xs tracking-wide text-red-800">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="text-taupe block text-[10px] tracking-[0.2em] uppercase">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border-border-stone bg-ivory text-graphite focus:border-bronze mt-2 w-full border px-4 py-3 text-sm transition-colors outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-taupe block text-[10px] tracking-[0.2em] uppercase">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-border-stone bg-ivory text-graphite focus:border-bronze mt-2 w-full border px-4 py-3 text-sm transition-colors outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="text-taupe block text-[10px] tracking-[0.2em] uppercase">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="border-border-stone bg-ivory text-graphite focus:border-bronze mt-2 w-full border px-4 py-3 text-sm transition-colors outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-taupe block text-[10px] tracking-[0.2em] uppercase">
                                    Architectural Firm / Studio
                                </label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="border-border-stone bg-ivory text-graphite focus:border-bronze mt-2 w-full border px-4 py-3 text-sm transition-colors outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="text-taupe block text-[10px] tracking-[0.2em] uppercase">
                                    Inquiry Category
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="border-border-stone bg-ivory text-graphite focus:border-bronze mt-2 w-full border px-4 py-3 text-sm transition-colors outline-none"
                                >
                                    <option value="trade">
                                        Architect & Designer Specification
                                    </option>
                                    <option value="sample_request">
                                        Material Sample Box Request
                                    </option>
                                    <option value="material_spec">
                                        Custom Quarry Block Reserve
                                    </option>
                                    <option value="general">
                                        General Advisory
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="text-taupe block text-[10px] tracking-[0.2em] uppercase">
                                    Stone of Interest
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Italian Marble, Statuario, Cobbles"
                                    value={materialInterest}
                                    onChange={(e) =>
                                        setMaterialInterest(e.target.value)
                                    }
                                    className="border-border-stone bg-ivory text-graphite focus:border-bronze mt-2 w-full border px-4 py-3 text-sm transition-colors outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-taupe block text-[10px] tracking-[0.2em] uppercase">
                                Project Brief & Material Requirements *
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe the scale, application, required finishes, or timeline..."
                                className="border-border-stone bg-ivory text-graphite focus:border-bronze mt-2 w-full border p-4 text-sm transition-colors outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="border-graphite bg-graphite text-ivory hover:border-bronze hover:bg-bronze w-full border py-4 text-xs tracking-[0.24em] uppercase transition-all duration-300 hover:text-white disabled:opacity-50"
                        >
                            {isSubmitting
                                ? 'Submitting Specification...'
                                : 'Transmit Inquiry'}
                        </button>
                    </form>
                </div>
            </Container>
        </section>
    );
}
