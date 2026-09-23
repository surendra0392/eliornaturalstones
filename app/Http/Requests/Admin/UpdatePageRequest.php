<?php

namespace App\Http\Requests\Admin;

use App\Models\Page;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdatePageRequest extends FormRequest
{
    /**
     * Canonical page slugs that cannot have their slug altered.
     *
     * @var array<int, string>
     */
    public const CANONICAL_SLUGS = [
        'home',
        'collections',
        'our-story',
        'from-source-to-space',
        'projects',
        'contact',
    ];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Page|null $page */
        $page = $this->route('page');
        $pageId = $page?->id;

        return [
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique('pages', 'slug')->ignore($pageId),
                Rule::notIn(['admin']),
            ],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['sometimes', 'required', 'array'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            /** @var Page|null $page */
            $page = $this->route('page');

            if ($page && in_array($page->slug, self::CANONICAL_SLUGS, true)) {
                if ($this->has('slug') && $this->input('slug') !== $page->slug) {
                    $validator->errors()->add('slug', 'Canonical page slugs cannot be modified.');
                }
            }
        });
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The page title is required.',
            'slug.required' => 'A unique URL slug is required.',
            'slug.alpha_dash' => 'The slug may only contain letters, numbers, dashes, and underscores.',
            'slug.unique' => 'This slug is already in use by another page.',
            'slug.not_in' => 'The specified slug is reserved or prohibited.',
            'content.required' => 'Page structured content is required.',
            'content.array' => 'Page content must be a structured JSON object.',
        ];
    }
}
