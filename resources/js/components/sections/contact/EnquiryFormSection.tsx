import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Container } from '../../layout/Container';
import { apiClient, ApiError } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import {
    contactContent,
    ENQUIRY_TYPE_OPTIONS,
    CANONICAL_COLLECTION_OPTIONS,
} from '../../../data/contactContent';

interface FormData {
    name: string;
    email: string;
    phone: string;
    enquiry_type: string;
    collection: string;
    project_space: string;
    estimated_requirement: string;
    message: string;
}

const INITIAL_FORM_DATA: FormData = {
    name: '',
    email: '',
    phone: '',
    enquiry_type: '',
    collection: '',
    project_space: '',
    estimated_requirement: '',
    message: '',
};

function matchCanonicalCollection(slugOrName: string): string | undefined {
    const clean = slugOrName.toLowerCase().replace(/[-_]/g, ' ').trim();
    const found = CANONICAL_COLLECTION_OPTIONS.find((opt) => {
        const valClean = opt.value.toLowerCase().replace(/[-_]/g, ' ').trim();
        const lblClean = opt.label.toLowerCase().replace(/[-_]/g, ' ').trim();
        return (
            valClean === clean ||
            lblClean === clean ||
            valClean.replace(/\s+/g, '') === clean.replace(/\s+/g, '') ||
            lblClean.replace(/\s+/g, '') === clean.replace(/\s+/g, '')
        );
    });
    return found?.value;
}

function matchEnquiryType(typeStr: string): string | undefined {
    const clean = typeStr.toLowerCase().trim();
    const found = ENQUIRY_TYPE_OPTIONS.find(
        (opt) =>
            opt.value.toLowerCase().includes(clean) ||
            opt.label.toLowerCase().includes(clean) ||
            clean.includes(opt.value.toLowerCase()),
    );
    return found?.value;
}

interface EnquiryFormSectionProps {
    content?: {
        heading?: string;
        supportingCopy?: string;
        submitButtonText?: string;
        submittingButtonText?: string;
        privacyReassurance?: string;
        successHeading?: string;
        successMessage?: string;
        resetButtonText?: string;
    };
}

export function EnquiryFormSection({ content }: EnquiryFormSectionProps = {}) {
    const form = {
        heading: content?.heading || contactContent.form.heading,
        supportingCopy:
            content?.supportingCopy || contactContent.form.supportingCopy,
        submitButtonText:
            content?.submitButtonText || contactContent.form.submitButtonText,
        submittingButtonText:
            content?.submittingButtonText ||
            contactContent.form.submittingButtonText,
        privacyReassurance:
            content?.privacyReassurance ||
            contactContent.form.privacyReassurance,
        successHeading:
            content?.successHeading || contactContent.form.successHeading,
        successMessage:
            content?.successMessage || contactContent.form.successMessage,
        resetButtonText:
            content?.resetButtonText || contactContent.form.resetButtonText,
    };

    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);

    // Auto-prefill form from URL query parameters (e.g. from variety cards or collection CTAs)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const interestParam = params.get('interest');
        const collectionParam = params.get('collection');
        const typeParam = params.get('type') || params.get('enquiry_type');

        if (interestParam || collectionParam || typeParam) {
            setFormData((prev) => {
                const next = { ...prev };

                if (collectionParam) {
                    const matchedCollection =
                        matchCanonicalCollection(collectionParam);
                    if (matchedCollection) {
                        next.collection = matchedCollection;
                    }
                }

                if (interestParam) {
                    if (!next.project_space) {
                        next.project_space = `${interestParam} Architectural Specification`;
                    }
                    if (!next.message) {
                        next.message = `I am interested in specifying ${interestParam} for our upcoming architectural project. Please provide material availability, slab dimensions, and finish recommendations.`;
                    }
                }

                if (typeParam) {
                    const matchedType = matchEnquiryType(typeParam);
                    if (matchedType) {
                        next.enquiry_type = matchedType;
                    }
                }

                return next;
            });

            // Smooth scroll down to enquiry form after brief layout mount
            const timer = setTimeout(() => {
                const formEl = document.getElementById('enquiry-form');
                if (formEl) {
                    formEl.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }, 150);

            return () => clearTimeout(timer);
        }
    }, []);

    function handleChange(
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear field error on change
        if (fieldErrors[name]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
        if (generalError) {
            setGeneralError(null);
        }
    }

    function validateClient(): boolean {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'Please provide your full name.';
        }

        if (!formData.email.trim()) {
            errors.email = 'Please provide your email address.';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                formData.email.trim(),
            )
        ) {
            errors.email = 'Please provide a valid email address.';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Please provide your contact phone number.';
        }

        if (!formData.enquiry_type) {
            errors.enquiry_type = 'Please select an enquiry type.';
        }

        if (!formData.collection) {
            errors.collection = 'Please select an architectural collection.';
        }

        if (!formData.project_space.trim()) {
            errors.project_space = 'Please describe your project or space.';
        }

        if (!formData.message.trim()) {
            errors.message =
                'Please share your project details or requirement.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setGeneralError(null);

        if (!validateClient()) {
            // Focus first error element
            const firstErrorField = Object.keys(fieldErrors)[0];
            if (firstErrorField) {
                const el = document.getElementById(`field-${firstErrorField}`);
                if (el) el.focus();
            }
            return;
        }

        setIsSubmitting(true);

        try {
            await apiClient(API_ENDPOINTS.v1.enquiries, {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            setIsSuccess(true);
            setFormData(INITIAL_FORM_DATA);
            setFieldErrors({});
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.errors) {
                    const mapped: Record<string, string> = {};
                    for (const [key, messages] of Object.entries(err.errors)) {
                        if (messages && messages.length > 0) {
                            mapped[key] = messages[0];
                        }
                    }
                    setFieldErrors(mapped);
                }
                setGeneralError(
                    err.message ||
                        'Please review the highlighted fields below.',
                );
            } else if (err instanceof Error) {
                setGeneralError(err.message);
            } else {
                setGeneralError(
                    'An unexpected error occurred. Please try again.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleReset() {
        setIsSuccess(false);
        setFormData(INITIAL_FORM_DATA);
        setFieldErrors({});
        setGeneralError(null);
    }

    return (
        <section
            id="enquiry-form"
            className="scroll-mt-12 bg-ivory-warm/40 border-b border-border-subtle py-16 md:py-20 lg:py-24"
        >
            <Container size="narrow">
                {/* Form Header */}
                <div className="text-center">
                    <p className="text-bronze font-mono text-[11px] font-medium tracking-[0.28em] uppercase">
                        MATERIAL ENQUIRY
                    </p>
                    <h2 className="text-graphite mt-3 font-serif text-3xl leading-tight font-light tracking-tight sm:text-4xl lg:text-5xl">
                        {form.heading}
                    </h2>
                    <p className="text-graphite-muted mx-auto mt-4 max-w-xl font-sans text-base leading-relaxed font-light sm:text-lg">
                        {form.supportingCopy}
                    </p>
                </div>

                {/* Form Container */}
                <div className="mt-12 border border-border-stone bg-ivory p-8 shadow-xs sm:p-12 lg:mt-16 lg:p-16">
                    {/* Success State Screen */}
                    {isSuccess ? (
                        <div
                            role="status"
                            aria-live="polite"
                            className="py-8 text-center sm:py-12"
                        >
                            <div className="border-bronze/30 bg-ivory-warm mx-auto flex h-14 w-14 items-center justify-center border">
                                <svg
                                    className="text-bronze h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <h3 className="text-graphite mt-6 font-serif text-2xl font-normal sm:text-3xl">
                                {form.successHeading}
                            </h3>

                            <p className="text-graphite-muted mx-auto mt-4 max-w-lg font-sans text-sm leading-relaxed font-light sm:text-base">
                                {form.successMessage}
                            </p>

                            <div className="mt-8">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="border-graphite text-graphite hover:bg-graphite hover:text-ivory active:scale-[0.98] inline-flex min-h-[44px] items-center justify-center border bg-transparent px-8 py-3 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 focus:outline-none"
                                >
                                    {form.resetButtonText}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="space-y-8"
                        >
                            {/* General Error Alert */}
                            {generalError && (
                                <div
                                    role="alert"
                                    className="border border-red-200 bg-red-50/80 p-4 text-xs tracking-wide text-red-800"
                                >
                                    {generalError}
                                </div>
                            )}

                            {/* Row 1: Full Name & Email Address */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                                <div>
                                    <label
                                        htmlFor="field-name"
                                        className="mb-2 block text-[11px] font-medium tracking-[0.16em] text-graphite uppercase"
                                    >
                                        Full Name{' '}
                                        <span className="text-bronze">*</span>
                                    </label>
                                    <input
                                        id="field-name"
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        aria-invalid={!!fieldErrors.name}
                                        aria-describedby={
                                            fieldErrors.name
                                                ? 'field-name-error'
                                                : undefined
                                        }
                                        placeholder="e.g. Elena Rossi"
                                        className={`min-h-[48px] w-full border bg-ivory-warm/30 px-4 py-3 text-sm text-graphite placeholder-taupe/60 transition-colors focus:bg-white focus:border-bronze focus:ring-1 focus:ring-bronze/30 focus:outline-none ${
                                            fieldErrors.name
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-border-stone focus:border-bronze focus:ring-bronze/30'
                                        }`}
                                    />
                                    {fieldErrors.name && (
                                        <p
                                            id="field-name-error"
                                            className="mt-1.5 text-xs text-red-600"
                                        >
                                            {fieldErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="field-email"
                                        className="mb-2 block text-[11px] font-medium tracking-[0.16em] text-graphite uppercase"
                                    >
                                        Email Address{' '}
                                        <span className="text-bronze">*</span>
                                    </label>
                                    <input
                                        id="field-email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        aria-invalid={!!fieldErrors.email}
                                        aria-describedby={
                                            fieldErrors.email
                                                ? 'field-email-error'
                                                : undefined
                                        }
                                        placeholder="elena@studio-rossi.com"
                                        className={`min-h-[48px] w-full border bg-ivory-warm/30 px-4 py-3 text-sm text-graphite placeholder-taupe/60 transition-colors focus:bg-white focus:border-bronze focus:ring-1 focus:ring-bronze/30 focus:outline-none ${
                                            fieldErrors.email
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-border-stone focus:border-bronze focus:ring-bronze/30'
                                        }`}
                                    />
                                    {fieldErrors.email && (
                                        <p
                                            id="field-email-error"
                                            className="mt-1.5 text-xs text-red-600"
                                        >
                                            {fieldErrors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Phone Number & Project / Space */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                                <div>
                                    <label
                                        htmlFor="field-phone"
                                        className="mb-2 block text-[11px] font-medium tracking-[0.16em] text-graphite uppercase"
                                    >
                                        Phone Number{' '}
                                        <span className="text-bronze">*</span>
                                    </label>
                                    <input
                                        id="field-phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        autoComplete="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        aria-invalid={!!fieldErrors.phone}
                                        aria-describedby={
                                            fieldErrors.phone
                                                ? 'field-phone-error'
                                                : undefined
                                        }
                                        placeholder="+91 98765 43210"
                                        className={`min-h-[48px] w-full border bg-ivory-warm/30 px-4 py-3 text-sm text-graphite placeholder-taupe/60 transition-colors focus:bg-white focus:border-bronze focus:ring-1 focus:ring-bronze/30 focus:outline-none ${
                                            fieldErrors.phone
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-border-stone focus:border-bronze focus:ring-bronze/30'
                                        }`}
                                    />
                                    {fieldErrors.phone && (
                                        <p
                                            id="field-phone-error"
                                            className="mt-1.5 text-xs text-red-600"
                                        >
                                            {fieldErrors.phone}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="field-project_space"
                                        className="mb-2 block text-[11px] font-medium tracking-[0.16em] text-graphite uppercase"
                                    >
                                        Project / Space{' '}
                                        <span className="text-bronze">*</span>
                                    </label>
                                    <input
                                        id="field-project_space"
                                        name="project_space"
                                        type="text"
                                        required
                                        value={formData.project_space}
                                        onChange={handleChange}
                                        aria-invalid={
                                            !!fieldErrors.project_space
                                        }
                                        aria-describedby={
                                            fieldErrors.project_space
                                                ? 'field-project-error'
                                                : undefined
                                        }
                                        placeholder="e.g. Jubilee Hills Private Residence, Atrium Lobby"
                                        className={`min-h-[48px] w-full border bg-ivory-warm/30 px-4 py-3 text-sm text-graphite placeholder-taupe/60 transition-colors focus:bg-white focus:border-bronze focus:ring-1 focus:ring-bronze/30 focus:outline-none ${
                                            fieldErrors.project_space
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-border-stone focus:border-bronze focus:ring-bronze/30'
                                        }`}
                                    />
                                    {fieldErrors.project_space && (
                                        <p
                                            id="field-project-error"
                                            className="mt-1.5 text-xs text-red-600"
                                        >
                                            {fieldErrors.project_space}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Enquiry Type & Collection Selection */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                                <div>
                                    <label
                                        htmlFor="field-enquiry_type"
                                        className="mb-2 block text-[11px] font-medium tracking-[0.16em] text-graphite uppercase"
                                    >
                                        Enquiry Type{' '}
                                        <span className="text-bronze">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="field-enquiry_type"
                                            name="enquiry_type"
                                            required
                                            value={formData.enquiry_type}
                                            onChange={handleChange}
                                            aria-invalid={
                                                !!fieldErrors.enquiry_type
                                            }
                                            aria-describedby={
                                                fieldErrors.enquiry_type
                                                    ? 'field-type-error'
                                                    : undefined
                                            }
                                            className={`min-h-[48px] w-full appearance-none border bg-ivory-warm/30 px-4 py-3 pr-10 text-sm text-graphite transition-colors focus:bg-white focus:border-bronze focus:ring-1 focus:ring-bronze/30 focus:outline-none ${
                                                fieldErrors.enquiry_type
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                    : 'border-border-stone focus:border-bronze focus:ring-bronze/30'
                                            }`}
                                        >
                                            <option value="">
                                                Select an Enquiry Type
                                            </option>
                                            {ENQUIRY_TYPE_OPTIONS.map((opt) => (
                                                <option
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-bronze">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {fieldErrors.enquiry_type && (
                                        <p
                                            id="field-type-error"
                                            className="mt-1.5 text-xs text-red-600"
                                        >
                                            {fieldErrors.enquiry_type}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="field-collection"
                                        className="mb-2 block text-[11px] font-medium tracking-[0.16em] text-graphite uppercase"
                                    >
                                        Collection{' '}
                                        <span className="text-bronze">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="field-collection"
                                            name="collection"
                                            required
                                            value={formData.collection}
                                            onChange={handleChange}
                                            aria-invalid={
                                                !!fieldErrors.collection
                                            }
                                            aria-describedby={
                                                fieldErrors.collection
                                                    ? 'field-collection-error'
                                                    : undefined
                                            }
                                            className={`min-h-[48px] w-full appearance-none border bg-ivory-warm/30 px-4 py-3 pr-10 text-sm text-graphite transition-colors focus:bg-white focus:border-bronze focus:ring-1 focus:ring-bronze/30 focus:outline-none ${
                                                fieldErrors.collection
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                    : 'border-border-stone focus:border-bronze focus:ring-bronze/30'
                                            }`}
                                        >
                                            <option value="">
                                                Select a Collection
                                            </option>
                                            {CANONICAL_COLLECTION_OPTIONS.map(
                                                (opt) => (
                                                    <option
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-bronze">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {fieldErrors.collection && (
                                        <p
                                            id="field-collection-error"
                                            className="mt-1.5 text-xs text-red-600"
                                        >
                                            {fieldErrors.collection}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 4: Optional Estimated Requirement */}
                            <div>
                                <label
                                    htmlFor="field-estimated_requirement"
                                    className="mb-2 block text-[11px] font-medium tracking-[0.16em] text-graphite uppercase"
                                >
                                    Estimated Requirement{' '}
                                    <span className="text-[10px] font-normal tracking-normal text-graphite-muted lowercase">
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    id="field-estimated_requirement"
                                    name="estimated_requirement"
                                    type="text"
                                    value={formData.estimated_requirement}
                                    onChange={handleChange}
                                    placeholder="e.g. Approx. 450 sq. meters flooring, or 3 custom vanity slabs"
                                    className="min-h-[48px] w-full border border-border-stone bg-ivory-warm/30 px-4 py-3 text-sm text-graphite placeholder-taupe/60 transition-colors focus:bg-white focus:border-bronze focus:ring-1 focus:ring-bronze/30 focus:outline-none"
                                />
                            </div>

                            {/* Row 5: Message */}
                            <div>
                                <label
                                    htmlFor="field-message"
                                    className="mb-2 block text-[11px] font-medium tracking-[0.16em] text-graphite uppercase"
                                >
                                    Message{' '}
                                    <span className="text-bronze">*</span>
                                </label>
                                <textarea
                                    id="field-message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    aria-invalid={!!fieldErrors.message}
                                    aria-describedby={
                                        fieldErrors.message
                                            ? 'field-message-error'
                                            : undefined
                                    }
                                    placeholder="Please describe your architectural intent, surface applications, required finishes, or timeline considerations..."
                                    className={`w-full border bg-ivory-warm/30 p-4 text-sm text-graphite placeholder-taupe/60 transition-colors focus:bg-white focus:border-bronze focus:ring-1 focus:ring-bronze/30 focus:outline-none ${
                                        fieldErrors.message
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-border-stone focus:border-bronze focus:ring-bronze/30'
                                    }`}
                                />
                                {fieldErrors.message && (
                                    <p
                                        id="field-message-error"
                                        className="mt-1.5 text-xs text-red-600"
                                    >
                                        {fieldErrors.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Row & Privacy Reassurance */}
                            <div className="flex flex-col items-start justify-between gap-6 pt-2 sm:flex-row sm:items-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex min-h-[48px] w-full items-center justify-center border border-graphite bg-graphite px-10 py-3.5 text-xs font-medium tracking-[0.24em] text-ivory uppercase transition-all duration-300 hover:bg-graphite-light hover:border-graphite-light active:scale-[0.98] active:translate-y-px focus:ring-2 focus:ring-bronze focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto shadow-sm"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="mr-2.5 h-4 w-4 animate-spin text-ivory"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            {form.submittingButtonText}
                                        </>
                                    ) : (
                                        form.submitButtonText
                                    )}
                                </button>

                                <p className="text-xs text-graphite-muted">
                                    {form.privacyReassurance}
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </Container>
        </section>
    );
}
