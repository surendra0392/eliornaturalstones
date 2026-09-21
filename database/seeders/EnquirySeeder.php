<?php

namespace Database\Seeders;

use App\Models\Enquiry;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class EnquirySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Production Safety: Never seed fake/demo customer enquiries in production
        if (app()->isProduction()) {
            return;
        }

        $enquiries = [
            [
                'name' => 'Julian Vance',
                'email' => 'jvance@vancearchitects.com',
                'phone' => '+44 20 7946 0912',
                'company' => 'Kensington Private Residence',
                'type' => 'Material Consultation',
                'material_interest' => 'Italian Marble',
                'message' => 'We are specifying bookmatched Calacatta and Statuario slabs for a master bathroom and double-height fireplace mantle in Kensington. We require 20mm polished slabs with consistent grey-violet veining and inspection certificates.',
                'status' => Enquiry::STATUS_PENDING,
                'metadata' => [
                    'project_space' => 'Kensington Private Residence',
                    'collection' => 'Italian Marble',
                    'enquiry_type' => 'Material Consultation',
                    'estimated_requirement' => '140 sq.m (Slabs)',
                    'notes' => 'Priority client. Awaiting block cut photos from Carrara partner.',
                ],
                'ip_address' => '195.154.122.34',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'created_at' => Carbon::now()->subHours(2),
            ],
            [
                'name' => 'Camilla Lindqvist',
                'email' => 'camilla@ateliernordic.se',
                'phone' => '+46 8 123 4567',
                'company' => 'Archipelago Wellness Retreat',
                'type' => 'Project Enquiry',
                'material_interest' => 'Limestones',
                'message' => 'Seeking honed, non-slip Jura Beige and French Beaumaniere limestone pavers for an indoor thermal bath and outdoor terrace pavilion. Needs to withstand Scandinavian freeze-thaw cycles while maintaining a warm tactile finish.',
                'status' => Enquiry::STATUS_PENDING,
                'metadata' => [
                    'project_space' => 'Archipelago Wellness Retreat',
                    'collection' => 'Limestones',
                    'enquiry_type' => 'Project Enquiry',
                    'estimated_requirement' => '320 sq.m (Custom Pavers)',
                ],
                'ip_address' => '83.251.198.11',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
                'created_at' => Carbon::now()->subHours(6),
            ],
            [
                'name' => 'Matteo Moretti',
                'email' => 'm.moretti@studiomoretti.ch',
                'phone' => '+41 22 555 0198',
                'company' => 'Geneva Lakeside Villa',
                'type' => 'Sample Request',
                'material_interest' => 'Granites',
                'message' => 'Please dispatch curated 150x150mm hand-finished sample tablets of Nero Impala, Absolute Black flamed, and Silver Grey leathered granite for review with our executive client this Friday.',
                'status' => Enquiry::STATUS_IN_PROGRESS,
                'metadata' => [
                    'project_space' => 'Geneva Lakeside Villa',
                    'collection' => 'Granites',
                    'enquiry_type' => 'Sample Request',
                    'estimated_requirement' => 'Architectural Sample Box',
                    'dispatch_carrier' => 'DHL Express',
                ],
                'ip_address' => '178.197.234.90',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                'created_at' => Carbon::now()->subDay(),
            ],
            [
                'name' => 'Sophie Laurent',
                'email' => 's.laurent@paris-interiors.fr',
                'phone' => '+33 1 42 68 55 00',
                'company' => 'Hôtel Particulier 8ème',
                'type' => 'Collection Enquiry',
                'material_interest' => 'Sculptures',
                'message' => 'Inquiring about commissioning two monumental hand-carved monolithic stone water basins in Italian Travertine / Marble for an interior courtyard garden. What is the standard lead time for bespoke quarry carving?',
                'status' => Enquiry::STATUS_IN_PROGRESS,
                'metadata' => [
                    'project_space' => 'Hôtel Particulier 8ème',
                    'collection' => 'Sculptures',
                    'enquiry_type' => 'Collection Enquiry',
                    'estimated_requirement' => '2 Bespoke Carved Basins',
                ],
                'ip_address' => '92.184.102.55',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'created_at' => Carbon::now()->subDays(2),
            ],
            [
                'name' => 'Alistair Sterling',
                'email' => 'sterling@heritagegardendesign.co.uk',
                'phone' => '+44 131 496 0144',
                'company' => 'Cotswolds Manor Landscape',
                'type' => 'Availability Enquiry',
                'material_interest' => 'Cobble Stones',
                'message' => 'Confirming availability of 60 tonnes of hand-split porphyry and basalt cobbles (100x100x80mm) for a private courtyard driveway with heritage conservation guidelines. Delivery scheduled for late autumn.',
                'status' => Enquiry::STATUS_RESPONDED,
                'metadata' => [
                    'project_space' => 'Cotswolds Manor Landscape',
                    'collection' => 'Cobble Stones',
                    'enquiry_type' => 'Availability Enquiry',
                    'estimated_requirement' => '60 Tonnes',
                    'consultant' => 'Marcus Vance',
                ],
                'ip_address' => '86.134.221.7',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'created_at' => Carbon::now()->subDays(4),
            ],
            [
                'name' => 'Evelyn Zhao',
                'email' => 'evelyn@zhaostudio.com',
                'phone' => '+1 415 555 0142',
                'company' => 'Pacific Heights Penthouse',
                'type' => 'Material Consultation',
                'material_interest' => 'Quartz',
                'message' => 'Looking for translucent crystalline Quartzite and Quartz slabs with custom rear-lighting preparation for a statement wine salon and kitchen cantilever island.',
                'status' => Enquiry::STATUS_RESPONDED,
                'metadata' => [
                    'project_space' => 'Pacific Heights Penthouse',
                    'collection' => 'Quartz',
                    'enquiry_type' => 'Material Consultation',
                    'estimated_requirement' => '4 Large Format Slabs',
                ],
                'ip_address' => '73.189.44.112',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
                'created_at' => Carbon::now()->subDays(5),
            ],
            [
                'name' => 'Henrik Dahl',
                'email' => 'h.dahl@nordicstoneworks.dk',
                'phone' => '+45 33 12 34 56',
                'company' => 'Copenhagen Modern Waterfront',
                'type' => 'Project Enquiry',
                'material_interest' => 'Slate Stone',
                'message' => 'Need cleft-finish Black Slate cladding panels (600x300x20mm) calibrated for ventilated rainscreen facade system. Need technical laboratory test sheets for absorption and flexural strength.',
                'status' => Enquiry::STATUS_CLOSED,
                'metadata' => [
                    'project_space' => 'Copenhagen Modern Waterfront',
                    'collection' => 'Slate Stone',
                    'enquiry_type' => 'Project Enquiry',
                    'estimated_requirement' => '450 sq.m Facade Cladding',
                ],
                'ip_address' => '188.180.89.201',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                'created_at' => Carbon::now()->subDays(9),
            ],
            [
                'name' => 'Elena Rossi',
                'email' => 'elena.rossi@rossiarchitettura.it',
                'phone' => '+39 02 8765 4321',
                'company' => 'Como Lake Villa & Pavilion',
                'type' => 'Sample Request',
                'material_interest' => 'Pebbles',
                'message' => 'Requesting sample assortment of naturally tumbled river pebbles in pure white, charcoal graphite, and jade green for luxury Japanese dry zen garden within a Como residence.',
                'status' => Enquiry::STATUS_CLOSED,
                'metadata' => [
                    'project_space' => 'Como Lake Villa & Pavilion',
                    'collection' => 'Pebbles',
                    'enquiry_type' => 'Sample Request',
                    'estimated_requirement' => 'Sample Box + 12 Tonnes',
                ],
                'ip_address' => '151.25.74.88',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
                'created_at' => Carbon::now()->subDays(12),
            ],
        ];

        foreach ($enquiries as $data) {
            Enquiry::updateOrCreate(
                ['email' => $data['email'], 'material_interest' => $data['material_interest']],
                $data
            );
        }
    }
}
