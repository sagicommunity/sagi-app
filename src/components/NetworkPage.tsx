import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import * as d3 from 'd3';
import { Search, Users, ChevronRight, X, LayoutList, Share2, Sparkles, MapPin } from 'lucide-react';


interface Socials {
  linkedin?: string;
  instagram?: string;
  whatsapp?: string;
  telegram?: string;
  website?: string;
}

interface Person {
  id: number;
  name: string;
  role: string;
  tags: string[];
  bio: string;
  aiSummary: [string, string, string];
  connections: number;
  projects: number;
  years: number;
  color: string;
  initials: string;
  connectLabel: string;
  mutualCount: number;
  mutualNames: string[];
  location?: string;
  socials: Socials;
  community: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

const MY_COMMUNITIES = [
  { id: 'AIFC', label: 'AIFC' },
  { id: 'hani', label: 'hani' },
  { id: 'Highvill', label: 'Highvill Isim' },
  { id: 'TechHub', label: 'Tech Hub KZ' },
  { id: 'StartupConnect', label: 'Startup Connect' },
];

interface GraphLink {
  source: Person;
  target: Person;
}

const people: Person[] = [
  {
    id: 1, name: 'Aizat Bekova', role: 'Product Manager',
    tags: ['PropTech', 'Agile', 'B2B'],
    bio: 'Launching products in real estate. 7 years in FMCG and tech startups.',
    aiSummary: ['Strong product sense across FMCG and PropTech domains.', 'Bridges business strategy and agile delivery in B2B contexts.', 'Well-connected across the community — 3 mutual contacts reachable.'],
    connections: 14, projects: 8, years: 7,
    color: '#7c6af0', initials: 'AB', connectLabel: 'Connect',
    mutualCount: 3, mutualNames: ['Madina', 'Areli', 'Arman'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', telegram: '#' }, community: 'AIFC',
  },
  {
    id: 2, name: 'Daniyar Seitkali', role: 'PropTech Founder',
    tags: ['Investment', 'Real Estate', 'AI'],
    bio: 'Founder of a real estate market analytics platform. Seeking B2C partners.',
    aiSummary: ['Founder-level operator with 9 years in real estate tech.', 'Actively seeking B2C distribution partners for his analytics platform.', 'High-value node — 5 mutual connections make intro easy.'],
    connections: 22, projects: 5, years: 9,
    color: '#f06a6a', initials: 'DS', connectLabel: 'Message',
    mutualCount: 5, mutualNames: ['Kamila', 'Timur', 'Ruslan'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', whatsapp: '#', website: '#' }, community: 'TechHub',
  },
  {
    id: 3, name: 'Areli Yakubova', role: 'UX Designer',
    tags: ['Design', 'Research', 'Figma'],
    bio: 'Designs interfaces for fintech and proptech. Passionate about data-driven design.',
    aiSummary: ['Specialist in data-driven UX for fintech and proptech.', 'Portfolio spans 12 projects — strong execution track record.', 'Good fit for product teams needing research-backed design.'],
    connections: 9, projects: 12, years: 5,
    color: '#6af0b8', initials: 'AY', connectLabel: 'Collaborate',
    mutualCount: 2, mutualNames: ['Aizat', 'Yana'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', website: '#' }, community: 'AIFC',
  },
  {
    id: 4, name: 'Timur Zhaihanov', role: 'Backend Engineer',
    tags: ['Python', 'FastAPI', 'GIS'],
    bio: 'Building geospatial services. Openlayers, PostGIS, cluster analysis.',
    aiSummary: ['Rare GIS + backend skill combination valuable for PropTech mapping.', '19 completed projects signals high reliability and output.', 'Potential technical co-founder or lead engineer for geo-heavy products.'],
    connections: 11, projects: 19, years: 6,
    color: '#f0c46a', initials: 'TZ', connectLabel: 'Invite to project',
    mutualCount: 4, mutualNames: ['Yana', 'Bekkali', 'Daniyar'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', telegram: '#', whatsapp: '#' }, community: 'TechHub',
  },
  {
    id: 5, name: 'Kamila Duzhan', role: 'Investor Analyst',
    tags: ['VC', 'Due Diligence', 'Kazakhstan'],
    bio: 'Analyzes deals in PropTech and EdTech. Looking for pre-seed / seed startups.',
    aiSummary: ['Active deal-flow at pre-seed/seed stage in PropTech and EdTech.', 'Largest network in this community — 31 connections, 6 mutuals.', 'Key gatekeeper: an intro through her can open investor doors.'],
    connections: 31, projects: 3, years: 8,
    color: '#f06ac8', initials: 'KD', connectLabel: 'Pitch me',
    mutualCount: 6, mutualNames: ['Daniyar', 'Aslan', 'Ruslan'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', telegram: '#' }, community: 'AIFC',
  },
  {
    id: 6, name: 'Arman Korov', role: 'Marketing Lead',
    tags: ['Growth', 'SMM', 'Performance'],
    bio: 'Grew 3 startups. Specializes in community-driven marketing.',
    aiSummary: ['Proven growth marketer with 3 startup exits under his belt.', 'Community-led approach aligns well with residential product models.', 'Can amplify launches quickly via performance and organic channels.'],
    connections: 18, projects: 7, years: 4,
    color: '#6aaff0', initials: 'AK', connectLabel: 'Collaborate',
    mutualCount: 3, mutualNames: ['Aizat', 'Areli', 'Madina'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', whatsapp: '#', telegram: '#' }, community: 'StartupConnect',
  },
  {
    id: 7, name: 'Yana Smailova', role: 'Data Scientist',
    tags: ['ML', 'NLP', 'Real Estate'],
    bio: 'Builds apartment valuation models. Kaggle 1x gold.',
    aiSummary: ['Top-tier ML practitioner with Kaggle gold in real estate data.', 'Her valuation models directly applicable to PropTech pricing features.', 'Small but tight network — early outreach recommended.'],
    connections: 7, projects: 11, years: 5,
    color: '#a8f06a', initials: 'YS', connectLabel: 'Need ML?',
    mutualCount: 2, mutualNames: ['Areli', 'Bekkali'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', telegram: '#', website: '#' }, community: 'TechHub',
  },
  {
    id: 8, name: 'Aslan Kasenov', role: 'PropTech Lawyer',
    tags: ['Deals', 'Regulation', 'KZ'],
    bio: 'Specializes in transaction support and regulation in PropTech.',
    aiSummary: ['12 years of legal expertise focused exclusively on PropTech KZ.', 'Essential contact for regulatory compliance and deal structuring.', 'Reachable via Kamila or Ruslan — both trusted mutual connections.'],
    connections: 13, projects: 4, years: 12,
    color: '#f0906a', initials: 'AK', connectLabel: 'Ask a question',
    mutualCount: 2, mutualNames: ['Kamila', 'Ruslan'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', whatsapp: '#' }, community: 'AIFC',
  },
  {
    id: 9, name: 'Madina Ilyasova', role: 'Community Manager',
    tags: ['Events', 'Network', 'RC'],
    bio: 'Builds resident communities within residential complexes. Launched 3 clubs.',
    aiSummary: ['Most networked person in the community — 40 connections, 7 mutuals.', 'Launched 3 resident clubs, making her a proven community builder.', 'Ideal partner for onboarding residents or running in-building events.'],
    connections: 40, projects: 6, years: 3,
    color: '#c86af0', initials: 'MI', connectLabel: 'Partnership',
    mutualCount: 7, mutualNames: ['Aizat', 'Areli', 'Saniya'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', telegram: '#', whatsapp: '#' }, community: 'StartupConnect',
  },
  {
    id: 10, name: 'Ruslan Akhmetov', role: 'RE Developer',
    tags: ['Construction', 'Elite', 'PPP'],
    bio: 'Develops comfort+ class projects in Astana. Seeking infrastructure partnerships.',
    aiSummary: ['15 years in elite real estate development — deep industry credibility.', 'Actively seeking PPP and infrastructure co-investment partners.', 'Strong ROI conversation — best approached with a concrete proposal.'],
    connections: 25, projects: 9, years: 15,
    color: '#6af0e0', initials: 'RA', connectLabel: 'Discuss project',
    mutualCount: 4, mutualNames: ['Daniyar', 'Kamila', 'Saniya'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', whatsapp: '#', website: '#' }, community: 'AIFC',
  },
  {
    id: 11, name: 'Saniya Bekturova', role: 'Architect',
    tags: ['BIM', 'Astana', 'Masterplan'],
    bio: 'Designs residential complexes and public spaces. Urban Forum participant.',
    aiSummary: ['BIM-fluent architect with a focus on Astana urban development.', '14 completed projects show consistent delivery in high-complexity builds.', 'Urban Forum network gives her access to city-level planning decisions.'],
    connections: 8, projects: 14, years: 10,
    color: '#f0e06a', initials: 'SB', connectLabel: 'View portfolio',
    mutualCount: 3, mutualNames: ['Madina', 'Ruslan', 'Timur'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', website: '#' }, community: 'TechHub',
  },
  {
    id: 12, name: 'Bekkali Seitkali', role: 'Startup Founder',
    tags: ['CleanTech', 'B2B SaaS', 'Seed'],
    bio: 'Building smart waste management systems for RCs. Seeking pilot locations.',
    aiSummary: ['Early-stage CleanTech founder solving waste management for RCs.', 'Needs pilot sites — a direct introduction to RC managers is high-value.', 'Seed-stage: good fit for investors or communities open to innovation pilots.'],
    connections: 16, projects: 2, years: 3,
    color: '#70f06a', initials: 'BS', connectLabel: 'Pilot in your RC?',
    mutualCount: 3, mutualNames: ['Timur', 'Yana', 'Madina'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', telegram: '#', whatsapp: '#' }, community: 'StartupConnect',
  },
  {
    id: 13, name: 'Aliya Nurmagambetova', role: 'HR Director',
    tags: ['Talent', 'PropTech', 'Culture'],
    bio: 'Builds high-performing teams at PropTech companies. Expert in remote hiring.',
    aiSummary: ['Specializes in scaling tech teams from 10 to 100+ people.', 'Strong cross-industry network — valuable for hiring in PropTech and beyond.', 'Reach through Aizat or Arman for a warm intro.'],
    connections: 19, projects: 6, years: 8,
    color: '#f09a6a', initials: 'AN', connectLabel: 'Talk talent',
    mutualCount: 3, mutualNames: ['Aizat', 'Arman', 'Madina'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', telegram: '#' }, community: 'AIFC',
  },
  {
    id: 14, name: 'Dias Omarov', role: 'Blockchain Developer',
    tags: ['Web3', 'Smart Contracts', 'DeFi'],
    bio: 'Building tokenized real estate on-chain. 4 deployed DeFi protocols.',
    aiSummary: ['Rare blockchain-real estate hybrid developer with live protocols.', 'Tokenized property ownership is his core focus — PropTech future.', 'Small network now but high strategic value for Web3-forward projects.'],
    connections: 10, projects: 4, years: 5,
    color: '#6a8af0', initials: 'DO', connectLabel: 'Explore Web3',
    mutualCount: 2, mutualNames: ['Daniyar', 'Bekkali'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', telegram: '#', website: '#' }, community: 'TechHub',
  },
  {
    id: 15, name: 'Farida Bekmuratova', role: 'Financial Analyst',
    tags: ['FinTech', 'Modeling', 'KZ Market'],
    bio: 'Models cash flows for real estate funds. CFA Level III candidate.',
    aiSummary: ['CFA-track analyst with deep KZ real estate fund modeling experience.', 'Ideal contact for anyone structuring investment vehicles or REITs.', 'Best reached through Kamila — strong working relationship.'],
    connections: 17, projects: 7, years: 6,
    color: '#f06a80', initials: 'FB', connectLabel: 'Discuss financials',
    mutualCount: 4, mutualNames: ['Kamila', 'Ruslan', 'Daniyar'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', whatsapp: '#' }, community: 'AIFC',
  },
  {
    id: 16, name: 'Serik Abilov', role: 'IoT Engineer',
    tags: ['Smart Home', 'Hardware', 'MQTT'],
    bio: 'Wires smart-home infrastructure for residential complexes. 30+ buildings.',
    aiSummary: ['Hands-on IoT engineer with deployments across 30+ residential buildings.', 'Smart home infrastructure is becoming table-stakes — he is already there.', 'Great technical partner for developers or RC operators.'],
    connections: 12, projects: 30, years: 7,
    color: '#6af0d8', initials: 'SA', connectLabel: 'Smart home pilot',
    mutualCount: 3, mutualNames: ['Ruslan', 'Saniya', 'Bekkali'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', telegram: '#', whatsapp: '#' }, community: 'StartupConnect',
  },
  {
    id: 17, name: 'Zarina Smatova', role: 'Interior Designer',
    tags: ['Interiors', 'Staging', 'Luxury'],
    bio: 'Stages luxury apartments for sale. Instagram: 82k followers.',
    aiSummary: ['Top-of-funnel asset for property sales — staging boosts close rate.', '82k Instagram audience gives her organic reach to high-net-worth buyers.', 'Natural partner for developers and RE agents in the premium segment.'],
    connections: 28, projects: 45, years: 9,
    color: '#f0c86a', initials: 'ZS', connectLabel: 'Stage my property',
    mutualCount: 5, mutualNames: ['Areli', 'Saniya', 'Ruslan'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', website: '#' }, community: 'AIFC',
  },
  {
    id: 18, name: 'Nurlan Dzhaksybekov', role: 'City Planner',
    tags: ['Urban', 'Policy', 'Astana'],
    bio: 'Works on Astana masterplan policy. Former ADB urban advisor.',
    aiSummary: ['Former ADB advisor — rare policy-level perspective on urban development.', 'His decisions influence which zones get infrastructure investment.', 'High-leverage contact for developers and architects working in Astana.'],
    connections: 21, projects: 8, years: 14,
    color: '#b06af0', initials: 'ND', connectLabel: 'Policy question',
    mutualCount: 4, mutualNames: ['Saniya', 'Ruslan', 'Aslan'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', telegram: '#' }, community: 'TechHub',
  },
  {
    id: 19, name: 'Aigul Seitkali', role: 'PropTech Journalist',
    tags: ['Media', 'PropTech', 'PR'],
    bio: 'Covers PropTech and real estate for Forbes Kazakhstan. 15k readers.',
    aiSummary: ['Writes for Forbes Kazakhstan — editorial coverage drives brand trust.', 'Well-connected across investor and founder circles through journalism.', 'Getting featured by her can accelerate fundraising or partnership conversations.'],
    connections: 33, projects: 11, years: 6,
    color: '#f06ab0', initials: 'AS', connectLabel: 'Get featured',
    mutualCount: 5, mutualNames: ['Daniyar', 'Kamila', 'Madina'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', telegram: '#', website: '#' }, community: 'StartupConnect',
  },
  {
    id: 20, name: 'Marat Iskakov', role: 'Construction Manager',
    tags: ['PM', 'Contracts', 'Site'],
    bio: 'Manages large residential site works. Currently overseeing a 1200-unit project.',
    aiSummary: ['On-site execution leader for large-scale residential projects.', '1200-unit project scale signals top-tier operational capacity.', 'Essential contact for developers needing reliable site management.'],
    connections: 14, projects: 12, years: 11,
    color: '#6af090', initials: 'MI', connectLabel: 'Site management',
    mutualCount: 3, mutualNames: ['Ruslan', 'Saniya', 'Timur'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', whatsapp: '#' }, community: 'AIFC',
  },
  {
    id: 21, name: 'Almas Dyussenov', role: 'RE Sales Director',
    tags: ['Sales', 'CRM', 'Luxury'],
    bio: 'Closed $120M in luxury apartment deals. Top-1 agent in Astana 2023.',
    aiSummary: ['$120M+ deal track record in luxury residential sales.', 'Deep buyer network spanning HNW individuals across KZ and Russia.', 'Key contact for developers needing fast sell-through on premium units.'],
    connections: 27, projects: 15, years: 10,
    color: '#f0a06a', initials: 'AD', connectLabel: 'Sales talk',
    mutualCount: 4, mutualNames: ['Ruslan', 'Zarina', 'Kamila'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', whatsapp: '#' }, community: 'TechHub',
  },
  {
    id: 22, name: 'Gulshat Turebekova', role: 'ESG Consultant',
    tags: ['ESG', 'Green Build', 'LEED'],
    bio: 'Helps developers achieve LEED certification. 12 certified buildings.',
    aiSummary: ['LEED specialist with 12 certified green buildings in portfolio.', 'ESG compliance is increasingly demanded by institutional investors.', 'Valuable early in project design — retrofitting costs 3x more.'],
    connections: 11, projects: 12, years: 7,
    color: '#6af0a0', initials: 'GT', connectLabel: 'ESG audit',
    mutualCount: 2, mutualNames: ['Saniya', 'Nurlan'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', website: '#' }, community: 'StartupConnect',
  },
  {
    id: 23, name: 'Bolat Seitkali', role: 'Mortgage Broker',
    tags: ['Finance', 'Mortgages', 'KZ Banks'],
    bio: 'Arranges residential and commercial mortgages. 400+ deals closed.',
    aiSummary: ['400+ mortgage deals closed — deep bank relationship network.', 'Bridges buyers with optimal financing structures across KZ banks.', 'High-volume referral potential for developers and RE agents.'],
    connections: 23, projects: 8, years: 9,
    color: '#6ab8f0', initials: 'BS', connectLabel: 'Finance talk',
    mutualCount: 3, mutualNames: ['Almas', 'Farida', 'Kamila'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', whatsapp: '#', telegram: '#' }, community: 'AIFC',
  },
  {
    id: 24, name: 'Malika Abenova', role: 'PropTech Accelerator',
    tags: ['Startups', 'Mentoring', 'Demo Day'],
    bio: 'Runs a PropTech accelerator with 18 portfolio companies.',
    aiSummary: ['18-company portfolio makes her a central PropTech ecosystem node.', 'Access to her accelerator = access to co-investors and pilot partners.', 'Intro via Daniyar or Kamila unlocks the full network.'],
    connections: 35, projects: 18, years: 6,
    color: '#e06af0', initials: 'MA', connectLabel: 'Apply to program',
    mutualCount: 6, mutualNames: ['Daniyar', 'Kamila', 'Bekkali'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', telegram: '#', website: '#' }, community: 'TechHub',
  },
  {
    id: 25, name: 'Erlan Baimanov', role: 'Drone & 3D Mapping',
    tags: ['GIS', 'UAV', 'Point Cloud'],
    bio: 'Creates 3D models of construction sites and land plots via drone.',
    aiSummary: ['Drone-based 3D mapping cuts site survey costs by 60%.', 'Output integrates directly into BIM workflows used by architects.', 'Natural partner for Saniya, Timur, and Marat — already in this network.'],
    connections: 9, projects: 22, years: 5,
    color: '#f0d86a', initials: 'EB', connectLabel: 'Book a survey',
    mutualCount: 3, mutualNames: ['Saniya', 'Timur', 'Marat'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', telegram: '#' }, community: 'StartupConnect',
  },
  {
    id: 26, name: 'Dana Mukasheva', role: 'Co-working Founder',
    tags: ['Co-working', 'Community', 'Flex Office'],
    bio: 'Founded 3 co-working spaces in Astana. 1200 active members.',
    aiSummary: ['3 co-working venues with 1200 members — built-in B2B audience.', 'Partnership potential for PropTech demos and community events.', 'Strong alignment with Madina and Aigul across community building.'],
    connections: 30, projects: 5, years: 7,
    color: '#f06a6a', initials: 'DM', connectLabel: 'Host an event',
    mutualCount: 5, mutualNames: ['Madina', 'Arman', 'Aigul'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', telegram: '#', website: '#' }, community: 'AIFC',
  },
  {
    id: 27, name: 'Aziz Tashkenov', role: 'Smart City Researcher',
    tags: ['Urban Tech', 'IoT', 'Policy'],
    bio: 'PhD researcher at Nazarbayev University. Consults city government on smart infrastructure.',
    aiSummary: ['Academic credibility + government advisory = rare dual-access.', 'Research focus on IoT urban infrastructure directly relevant to RC tech.', 'Best reached through Nurlan or Serik — both in adjacent domains.'],
    connections: 15, projects: 6, years: 8,
    color: '#6ae8f0', initials: 'AT', connectLabel: 'Research collab',
    mutualCount: 3, mutualNames: ['Nurlan', 'Serik', 'Timur'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', website: '#', telegram: '#' }, community: 'TechHub',
  },
  {
    id: 28, name: 'Zhanna Ospanova', role: 'Property Valuator',
    tags: ['Appraisal', 'RICS', 'Commercial'],
    bio: 'RICS-certified valuator for commercial and residential assets across KZ.',
    aiSummary: ['RICS certification makes her valuations internationally credible.', 'Commercial asset appraisals align with fund and developer due diligence.', 'Natural complement to Aslan and Farida for deal structuring.'],
    connections: 13, projects: 9, years: 11,
    color: '#f06ab8', initials: 'ZO', connectLabel: 'Get a valuation',
    mutualCount: 3, mutualNames: ['Aslan', 'Farida', 'Bolat'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', whatsapp: '#' }, community: 'StartupConnect',
  },
  {
    id: 29, name: 'Temur Rakhimov', role: 'Digital Marketing',
    tags: ['SEO', 'Paid Ads', 'PropTech'],
    bio: 'Runs performance marketing for 6 RE developer brands. 4x avg ROAS.',
    aiSummary: ['4x ROAS average across 6 RE developer campaigns — data-driven.', 'PropTech vertical expertise reduces onboarding time significantly.', 'Pairs well with Arman for full-stack marketing coverage.'],
    connections: 16, projects: 20, years: 5,
    color: '#a0f06a', initials: 'TR', connectLabel: 'Run my ads',
    mutualCount: 3, mutualNames: ['Arman', 'Dana', 'Aigul'],
    location: 'Almaty, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', telegram: '#' }, community: 'AIFC',
  },
  {
    id: 30, name: 'Bekzat Zhakupov', role: 'AI Product Lead',
    tags: ['AI', 'NLP', 'PropTech SaaS'],
    bio: 'Leads AI product at a PropTech SaaS. Built a lease analysis NLP engine.',
    aiSummary: ['Lease NLP engine reduces legal review time by 70%.', 'Cross-domain AI + PropTech expertise is extremely rare in KZ market.', 'Synergy with Yana, Daniyar, and Bekkali on ML and SaaS layers.'],
    connections: 18, projects: 7, years: 6,
    color: '#7a6af0', initials: 'BZ', connectLabel: 'AI collab',
    mutualCount: 4, mutualNames: ['Yana', 'Daniyar', 'Dias'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', telegram: '#', website: '#' }, community: 'TechHub',
  },
  {
    id: 31, name: 'Aigerim Bekova', role: 'Кондитер',
    tags: ['Торты', 'Десерты', 'Astana'],
    bio: 'Главный кондитер Hani Kitchen. Специализируется на авторских свадебных тортах.',
    aiSummary: ['Опытный кондитер с 5-летним стажем в Hani.', 'Специализируется на свадебных и фирменных тортах.', 'Отличный контакт для event-планировщиков.'],
    connections: 12, projects: 20, years: 5,
    color: '#F5C400', initials: 'AB', connectLabel: 'Connect',
    mutualCount: 2, mutualNames: ['Madina', 'Dana'],
    location: 'Astana, Kazakhstan',
    socials: { instagram: '#', telegram: '#' }, community: 'hani',
  },
  {
    id: 32, name: 'Dauren Seitkali', role: 'Бариста',
    tags: ['Кофе', 'Hani', 'Hospitality'],
    bio: 'Старший бариста Hani Café. Чемпион Казахстана по латте-арт.',
    aiSummary: ['Чемпион Казахстана по латте-арт.', 'Представляет hani на международных кофейных фестивалях.', 'Хороший контакт для кофейной индустрии.'],
    connections: 8, projects: 5, years: 4,
    color: '#CC8F00', initials: 'DS', connectLabel: 'Connect',
    mutualCount: 2, mutualNames: ['Aigerim', 'Dana'],
    location: 'Astana, Kazakhstan',
    socials: { instagram: '#', telegram: '#' }, community: 'hani',
  },
  {
    id: 33, name: 'Alina Sova', role: 'Event Manager',
    tags: ['Events', 'Кейтеринг', 'Hani'],
    bio: 'Организует корпоративные мероприятия и кейтеринг от Hani Events.',
    aiSummary: ['Организовала более 50 корпоративных мероприятий с Hani.', 'Отвечает за кейтеринг-направление в сети.', 'Полезный контакт для event-организаторов.'],
    connections: 15, projects: 50, years: 3,
    color: '#E6A800', initials: 'AS', connectLabel: 'Connect',
    mutualCount: 2, mutualNames: ['Madina', 'Dana'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', instagram: '#', telegram: '#' }, community: 'hani',
  },
  {
    id: 34, name: 'Asel Nurlanovna', role: 'Архитектор',
    tags: ['Дизайн', 'Интерьер', 'Highvill'],
    bio: 'Живёт в Highvill Isim. Занимается дизайном интерьеров и архитектурным консалтингом.',
    aiSummary: ['Специалист по дизайну интерьеров жилых комплексов.', 'Резидент Highvill Isim — полезный контакт для соседей.', 'Открыта к коллаборациям с застройщиками.'],
    connections: 18, projects: 22, years: 8,
    color: '#2563EB', initials: 'AN', connectLabel: 'Connect',
    mutualCount: 2, mutualNames: ['Kamila', 'Arman'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', instagram: '#' }, community: 'Highvill',
  },
  {
    id: 35, name: 'Ruslan Abdrakhmanov', role: 'Финансовый аналитик',
    tags: ['Инвестиции', 'Недвижимость', 'Fintech'],
    bio: 'Резидент Highvill Isim. Консультирует по инвестициям в недвижимость Астаны.',
    aiSummary: ['Глубокая экспертиза в инвестиционной оценке жилой недвижимости.', 'Полезен для соседей, интересующихся доходной недвижимостью.', '4 общих контакта делают знакомство легким.'],
    connections: 24, projects: 14, years: 9,
    color: '#1D4ED8', initials: 'RA', connectLabel: 'Connect',
    mutualCount: 4, mutualNames: ['Daniyar', 'Timur', 'Saniya'],
    location: 'Astana, Kazakhstan',
    socials: { linkedin: '#', telegram: '#', whatsapp: '#' }, community: 'Highvill',
  },
  {
    id: 36, name: 'Dinara Seitkali', role: 'Педиатр',
    tags: ['Медицина', 'Дети', 'Здоровье'],
    bio: 'Врач-педиатр, живёт в Highvill Isim с семьёй. Волонтёр детских программ.',
    aiSummary: ['Педиатр с 10-летним опытом в частной практике.', 'Активный участник соседского сообщества Highvill.', 'Полезный контакт для семей с детьми в комплексе.'],
    connections: 11, projects: 5, years: 10,
    color: '#3B82F6', initials: 'DS', connectLabel: 'Connect',
    mutualCount: 1, mutualNames: ['Asel'],
    location: 'Astana, Kazakhstan',
    socials: { instagram: '#', whatsapp: '#' }, community: 'Highvill',
  },
];

const rawLinks: [number, number][] = [
  [31,32],[31,33],[32,33],[31,9],[33,26],
  [1,2],[1,3],[1,6],[1,13],[2,4],[2,5],[2,10],[2,14],[2,30],[3,6],[3,7],[3,17],
  [4,7],[4,12],[4,16],[4,25],[5,2],[5,8],[5,10],[5,15],[5,24],[6,9],[6,13],[6,29],
  [7,12],[7,15],[7,30],[8,10],[8,18],[8,28],[9,1],[9,3],[9,11],[9,17],[9,26],
  [10,11],[10,16],[10,20],[10,21],[11,4],[11,18],[11,22],[11,25],[12,9],[12,6],[12,14],
  [13,17],[13,26],[14,15],[14,30],[15,19],[15,23],[16,20],[16,27],[17,19],[17,21],
  [18,20],[18,27],[19,5],[19,9],[19,24],[20,11],[20,25],[21,23],[22,27],[23,28],
  [24,14],[24,19],[25,27],[26,29],[27,30],[28,23],[28,15],[29,6],[29,24],[30,7],
];

// ─── Graph View ───────────────────────────────────────────────────────────────
function GraphView({ onSelectPerson, activeCommunity, onCommunityChange, activeCity, onCityChange }: {
  onSelectPerson: (p: Person) => void;
  activeCommunity: string | null;
  onCommunityChange: (id: string | null) => void;
  activeCity: string | null;
  onCityChange: (city: string | null) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeGroupRef = useRef<d3.Selection<SVGGElement, Person, SVGGElement, unknown> | null>(null);
  const linkGroupRef = useRef<d3.Selection<SVGLineElement, GraphLink, SVGGElement, unknown> | null>(null);
  const rotationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDraggingGlobe = useRef(false);
  const yawRef = useRef(20);
  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const graticuleDataRef = useRef<d3.GeoPermissibleObjects | null>(null);
  const countriesDataRef = useRef<d3.GeoPermissibleObjects | null>(null);
  const globePathRef = useRef<d3.Selection<SVGPathElement, unknown, null, undefined> | null>(null);
  const countriesPathRef = useRef<d3.Selection<SVGPathElement, unknown, null, undefined> | null>(null);
  const graticulePathRef = useRef<d3.Selection<SVGPathElement, unknown, null, undefined> | null>(null);
  const [graphSearch, setGraphSearch] = useState('');

  const nodes: Person[] = people.map(d => ({ ...d }));
  const links: GraphLink[] = rawLinks.map(([s, t]) => ({
    source: nodes.find(n => n.id === s)!,
    target: nodes.find(n => n.id === t)!,
  }));

  const handleClick = useCallback((d: Person) => {
    if (linkGroupRef.current) {
      linkGroupRef.current.classed('net-hl', (l: GraphLink) =>
        l.source.id === d.id || l.target.id === d.id
      );
    }
    if (nodeGroupRef.current) {
      nodeGroupRef.current.classed('net-active', (n: Person) => n.id === d.id);
    }
    onSelectPerson(d);
  }, [onSelectPerson]);

  const redrawGlobe = useCallback(() => {
    if (!projectionRef.current) return;
    const p = d3.geoPath(projectionRef.current);
    if (graticuleDataRef.current) graticulePathRef.current?.attr('d', p(graticuleDataRef.current));
    if (countriesDataRef.current) countriesPathRef.current?.attr('d', p(countriesDataRef.current));
    globePathRef.current?.attr('d', p({ type: 'Sphere' } as d3.GeoPermissibleObjects));
  }, []);

  // Search + community + city filter effect
  useEffect(() => {
    if (!nodeGroupRef.current) return;
    const q = graphSearch.toLowerCase().trim();
    nodeGroupRef.current.style('opacity', (d: Person) => {
      const communityMatch = !activeCommunity || d.community === activeCommunity;
      const cityMatch = !activeCity || (d.location ?? '').toLowerCase().includes(activeCity.toLowerCase());
      if (!communityMatch || !cityMatch) return '0.08';
      if (!q) return '1';
      const searchMatch = d.name.toLowerCase().includes(q) ||
        d.role.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q));
      return searchMatch ? '1' : '0.1';
    });
  }, [graphSearch, activeCommunity, activeCity]);

  useEffect(() => {
    if (!svgRef.current) return;
    const el = svgRef.current;
    const width = el.clientWidth;
    const height = el.clientHeight;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.44;

    const svg = d3.select(el);
    svg.selectAll('*').remove();

    // ── Gradient defs ──
    const defs = svg.append('defs');
    const radGrad = defs.append('radialGradient').attr('id', 'globe-grad').attr('cx', '38%').attr('cy', '35%');
    radGrad.append('stop').attr('offset', '0%').attr('stop-color', '#1a3a5c').attr('stop-opacity', 1);
    radGrad.append('stop').attr('offset', '100%').attr('stop-color', '#060d18').attr('stop-opacity', 1);
    const glowGrad = defs.append('radialGradient').attr('id', 'globe-glow').attr('cx', '50%').attr('cy', '50%');
    glowGrad.append('stop').attr('offset', '60%').attr('stop-color', '#10b981').attr('stop-opacity', 0);
    glowGrad.append('stop').attr('offset', '100%').attr('stop-color', '#10b981').attr('stop-opacity', 0.18);

    const globeLayer = svg.append('g');

    // Outer glow ring
    globeLayer.append('circle').attr('cx', cx).attr('cy', cy).attr('r', radius + 18)
      .attr('fill', 'url(#globe-glow)').attr('pointer-events', 'none');

    // Globe fill — also the drag target
    const globeBg = globeLayer.append('circle').attr('cx', cx).attr('cy', cy).attr('r', radius)
      .attr('fill', 'url(#globe-grad)').attr('stroke', 'rgba(16,185,129,0.3)').attr('stroke-width', 1.5)
      .style('cursor', 'grab');

    // D3 orthographic projection
    const projection = d3.geoOrthographic()
      .scale(radius).translate([cx, cy]).clipAngle(90).rotate([20, -30]);
    projectionRef.current = projection;

    const graticule = d3.geoGraticule()();
    graticuleDataRef.current = graticule;

    graticulePathRef.current = (globeLayer.append('path')
      .datum(graticule).attr('d', d3.geoPath(projection))
      .attr('fill', 'none').attr('stroke', 'rgba(16,185,129,0.12)').attr('stroke-width', 0.5)
    ) as unknown as d3.Selection<SVGPathElement, unknown, null, undefined>;

    countriesPathRef.current = (globeLayer.append('path')
      .attr('fill', 'rgba(16,185,129,0.18)').attr('stroke', 'rgba(16,185,129,0.45)').attr('stroke-width', 0.6)
    ) as unknown as d3.Selection<SVGPathElement, unknown, null, undefined>;

    globePathRef.current = (globeLayer.append('path')
      .datum({ type: 'Sphere' } as d3.GeoPermissibleObjects).attr('d', d3.geoPath(projection))
      .attr('fill', 'none').attr('stroke', 'rgba(16,185,129,0.4)').attr('stroke-width', 1)
    ) as unknown as d3.Selection<SVGPathElement, unknown, null, undefined>;

    // Fetch world map
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then((world: Topology) => {
        const countries = topojson.feature(world, world.objects['countries'] as GeometryCollection);
        countriesDataRef.current = countries;
        countriesPathRef.current?.datum(countries).attr('d', d3.geoPath(projection));
      })
      .catch(() => {});

    // Globe drag to rotate
    globeBg.call(
      d3.drag<SVGCircleElement, unknown>()
        .on('start', () => {
          isDraggingGlobe.current = true;
          if (rotationRef.current) clearInterval(rotationRef.current);
          globeBg.style('cursor', 'grabbing');
        })
        .on('drag', (event) => {
          const [λ, φ] = projection.rotate();
          projection.rotate([λ + event.dx * 0.4, φ - event.dy * 0.25]);
          yawRef.current = projection.rotate()[0];
          redrawGlobe();
        })
        .on('end', () => {
          isDraggingGlobe.current = false;
          globeBg.style('cursor', 'grab');
          // Resume auto-rotation
          rotationRef.current = setInterval(() => {
            if (!isDraggingGlobe.current) {
              yawRef.current += 0.15;
              projection.rotate([yawRef.current, projection.rotate()[1]]);
              redrawGlobe();
            }
          }, 30);
        })
    );

    // Auto-rotation
    rotationRef.current = setInterval(() => {
      if (!isDraggingGlobe.current) {
        yawRef.current += 0.15;
        projection.rotate([yawRef.current, -30]);
        redrawGlobe();
      }
    }, 30);

    // ── Force network on top ──
    document.getElementById('net-style')?.remove();
    const style = document.createElement('style');
    style.id = 'net-style';
    style.textContent = `
      .net-hl { stroke: rgba(16,185,129,0.8) !important; stroke-width: 2.5px !important; stroke-dasharray: none !important; animation: none !important; }
      .net-link { stroke-dasharray: 5 5; animation: dash-flow 2s linear infinite; }
      @keyframes dash-flow { to { stroke-dashoffset: -40; } }
      .net-pulse { animation: pulse-node 2.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
      @keyframes pulse-node { 0%,100% { opacity:0.18; transform:scale(1); } 50% { opacity:0.06; transform:scale(1.3); } }
      .net-ping { animation: ping-node 3s ease-out infinite; transform-box: fill-box; transform-origin: center; }
      @keyframes ping-node { 0% { opacity:0.6; transform:scale(1); } 80%,100% { opacity:0; transform:scale(2.2); } }
    `;
    document.head.appendChild(style);

    const netG = svg.append('g');

    const linkEl = netG.append('g')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links).join('line')
      .attr('class', 'net-link')
      .style('stroke', 'rgba(16,185,129,0.28)').style('stroke-width', '1.5px');
    linkGroupRef.current = linkEl as unknown as d3.Selection<SVGLineElement, GraphLink, SVGGElement, unknown>;

    const sim = d3.forceSimulation<Person>(nodes)
      .force('link', d3.forceLink<Person, GraphLink>(links).distance(75).strength(0.32))
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(cx, cy))
      .force('collision', d3.forceCollide(32))
      .force('bound', () => {
        nodes.forEach(n => {
          const dx = (n.x ?? cx) - cx, dy = (n.y ?? cy) - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > radius * 0.86) {
            const s = (radius * 0.86) / dist;
            n.x = cx + dx * s; n.y = cy + dy * s;
          }
        });
      });

    const nodeEl = netG.append('g')
      .selectAll<SVGGElement, Person>('g.node')
      .data(nodes).join('g').attr('class', 'node').style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, Person>()
          .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on('end',   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      );
    nodeGroupRef.current = nodeEl as unknown as d3.Selection<SVGGElement, Person, SVGGElement, unknown>;

    // Ping ring (expands outward, fades) — staggered per node
    nodeEl.append('circle')
      .attr('class', 'net-ping')
      .attr('r', d => 16 + d.connections / 9)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5)
      .attr('pointer-events', 'none')
      .style('animation-delay', (_, i) => `${(i * 0.28) % 3}s`);

    // Pulse glow — breathes in/out
    nodeEl.append('circle')
      .attr('class', 'net-pulse')
      .attr('r', d => 22 + d.connections / 6)
      .attr('fill', d => d.color)
      .attr('stroke', 'none')
      .attr('pointer-events', 'none')
      .style('animation-delay', (_, i) => `${(i * 0.18) % 2.5}s`);

    // Main circle
    nodeEl.append('circle')
      .attr('r', d => 13 + d.connections / 10)
      .attr('fill', d => d.color + '35').attr('stroke', d => d.color).attr('stroke-width', 2)
      .on('click', (_e, d) => handleClick(d));

    // Initials
    nodeEl.append('text')
      .attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('font-size', d => 8 + d.connections / 16).attr('font-weight', '700')
      .attr('fill', d => d.color).attr('pointer-events', 'none').text(d => d.initials);

    // Name label
    nodeEl.append('text')
      .attr('text-anchor', 'middle').attr('dy', d => 28 + d.connections / 10)
      .attr('font-size', '8').attr('fill', 'rgba(210,220,230,0.9)').attr('pointer-events', 'none')
      .text(d => d.name.split(' ')[0]);

    sim.on('tick', () => {
      linkEl
        .attr('x1', d => d.source.x!).attr('y1', d => d.source.y!)
        .attr('x2', d => d.target.x!).attr('y2', d => d.target.y!);
      nodeEl.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      sim.stop();
      if (rotationRef.current) clearInterval(rotationRef.current);
      document.getElementById('net-style')?.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 140px)', background: '#060d18' }}>
      <svg ref={svgRef} className="w-full h-full" />

      {/* Search bar + community pills — top centre */}
      <div className="absolute top-4 left-0 right-0 flex flex-col items-center gap-2 px-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto w-full max-w-xs">
          <div
            className="flex items-center gap-2 flex-1 rounded-2xl px-4 py-2.5 transition-all"
            style={{ background: 'rgba(6,13,24,0.75)', border: '1px solid rgba(16,185,129,0.35)', backdropFilter: 'blur(12px)' }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: '#10b981' }} />
            <input
              type="text"
              placeholder="Search people..."
              value={graphSearch}
              onChange={e => setGraphSearch(e.target.value)}
              className="bg-transparent text-xs text-white placeholder:text-white/35 outline-none w-full"
            />
            {graphSearch && (
              <button onClick={() => setGraphSearch('')} className="shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Community filter pills */}
        <div className="flex gap-2 pointer-events-auto overflow-x-auto max-w-xs w-full pb-0.5 scrollbar-hide">
          <button
            onClick={() => onCommunityChange(null)}
            className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all"
            style={activeCommunity === null
              ? { background: '#10b981', color: '#fff', borderColor: '#10b981' }
              : { background: 'rgba(6,13,24,0.75)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(16,185,129,0.3)', backdropFilter: 'blur(8px)' }
            }
          >
            All
          </button>
          {MY_COMMUNITIES.map(c => (
            <button
              key={c.id}
              onClick={() => onCommunityChange(activeCommunity === c.id ? null : c.id)}
              className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all"
              style={activeCommunity === c.id
                ? { background: '#10b981', color: '#fff', borderColor: '#10b981' }
                : { background: 'rgba(6,13,24,0.75)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(16,185,129,0.3)', backdropFilter: 'blur(8px)' }
              }
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* City filter pills */}
        <div className="flex gap-2 pointer-events-auto overflow-x-auto max-w-xs w-full pb-0.5 scrollbar-hide">
          {[null, 'Almaty', 'Astana'].map(city => (
            <button
              key={city ?? 'all'}
              onClick={() => onCityChange(city)}
              className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all flex items-center gap-1"
              style={activeCity === city
                ? { background: 'rgba(16,185,129,0.25)', color: '#10b981', borderColor: '#10b981' }
                : { background: 'rgba(6,13,24,0.75)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(16,185,129,0.2)', backdropFilter: 'blur(8px)' }
              }
            >
              {city === null ? '📍 All cities' : `📍 ${city}`}
            </button>
          ))}
        </div>
      </div>

      {/* Hint */}
      <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] pointer-events-none" style={{ color: 'rgba(255,255,255,0.2)' }}>
        Drag globe to rotate · tap node to view profile
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function NetworkPage() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<'list' | 'graph'>('list');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Person | null>(null);
  const [connected, setConnected] = useState<Set<number>>(new Set());
  const [activeCommunity, setActiveCommunity] = useState<string | null>(searchParams.get('community'));
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [memberFilter, setMemberFilter] = useState<'all' | 'friends'>('all');

  const filtered = people.filter(p => {
    if (activeCommunity && p.community !== activeCommunity) return false;
    if (activeCommunity && memberFilter === 'friends' && !connected.has(p.id)) return false;
    if (activeCity && !(p.location ?? '').toLowerCase().includes(activeCity.toLowerCase())) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q));
  });

  const toggleConnect = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setConnected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col items-center">
      <div className="w-full max-w-md">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">Network</h1>
              <p className="text-xs text-muted-foreground mt-0.5">People you can reach</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Toggle pill */}
              <div className="flex items-center bg-muted rounded-xl p-1 gap-1">
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    view === 'list'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  List
                </button>
                <button
                  onClick={() => setView('graph')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    view === 'graph'
                      ? 'bg-card text-[#10b981] shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Graph
                </button>
              </div>
            </div>
          </div>

          {/* Search — only in list mode */}
          {view === 'list' && (
            <>
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2.5 mb-3">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name, role or skill..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-muted-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Community filter pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button
                  onClick={() => { setActiveCommunity(null); setMemberFilter('all'); }}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    activeCommunity === null
                      ? 'bg-[#10b981] text-white border-[#10b981]'
                      : 'bg-transparent text-muted-foreground border-border hover:border-[#10b981]/50'
                  }`}
                >
                  All
                </button>
                {MY_COMMUNITIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setActiveCommunity(activeCommunity === c.id ? null : c.id); setMemberFilter('all'); }}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      activeCommunity === c.id
                        ? 'bg-[#10b981] text-white border-[#10b981]'
                        : 'bg-transparent text-muted-foreground border-border hover:border-[#10b981]/50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Member sub-filter — shown only when a community is selected */}
              {activeCommunity && (
                <div className="flex items-center gap-2 mt-2 mb-1">
                  <div className="flex items-center bg-muted rounded-xl p-1 gap-1">
                    <button
                      onClick={() => setMemberFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        memberFilter === 'all'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground'
                      }`}
                    >
                      Все участники
                    </button>
                    <button
                      onClick={() => setMemberFilter('friends')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        memberFilter === 'friends'
                          ? 'bg-card text-[#10b981] shadow-sm'
                          : 'text-muted-foreground'
                      }`}
                    >
                      Мои connections
                    </button>
                  </div>
                </div>
              )}

              {/* City filter pills */}
              <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                {[null, 'Almaty', 'Astana'].map(city => (
                  <button
                    key={city ?? 'all'}
                    onClick={() => setActiveCity(city)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1 ${
                      activeCity === city
                        ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]'
                        : 'bg-transparent text-muted-foreground border-border hover:border-[#10b981]/50'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    {city ?? 'All cities'}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Graph view ── */}
      {view === 'graph' && (
        <div>
          <GraphView onSelectPerson={p => setSelected(p)} activeCommunity={activeCommunity} onCommunityChange={setActiveCommunity} activeCity={activeCity} onCityChange={setActiveCity} />
        </div>
      )}

      {/* ── List view ── */}
      {view === 'list' && (
        <div className="px-4 py-4 space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">No members found</div>
          )}
          {filtered.map(person => (
            <button
              key={person.id}
              onClick={() => setSelected(person)}
              className="w-full text-left bg-card border border-border rounded-2xl p-4 flex items-start gap-3 active:scale-[0.98] transition-transform"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                style={{ background: person.color + '20', border: `2px solid ${person.color}`, color: person.color }}
              >
                {person.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm text-foreground leading-tight">{person.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{person.role}</div>
                    {person.location && (
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {person.location.split(',')[0]}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {person.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">{person.mutualCount}</span> mutual · {person.mutualNames.slice(0, 2).join(', ')}
                    {person.mutualNames.length > 2 ? ` +${person.mutualNames.length - 2}` : ''}
                  </div>
                  <button
                    onClick={e => toggleConnect(person.id, e)}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full transition-all active:scale-95"
                    style={
                      connected.has(person.id)
                        ? { background: person.color + '20', color: person.color, border: `1px solid ${person.color}` }
                        : { background: person.color, color: '#fff' }
                    }
                  >
                    {connected.has(person.id) ? '⏳ Pending' : '+ Connect'}
                  </button>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      </div>{/* end max-w-md wrapper */}

      {/* ── Bottom sheet detail ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-card rounded-t-3xl p-6 pb-24 max-h-[80vh] overflow-y-auto w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{ background: selected.color + '20', border: `2px solid ${selected.color}`, color: selected.color }}
              >
                {selected.initials}
              </div>
              <div>
                <div className="font-bold text-base text-foreground">{selected.name}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{selected.role}</div>
                {selected.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{selected.location}</span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium text-foreground">{selected.mutualCount}</span> mutual connections
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {selected.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-5">
              <div className="bg-muted/40 rounded-2xl p-3 text-center">
                <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-base font-bold text-foreground">{selected.connections}</div>
                <div className="text-[10px] text-muted-foreground">Connections</div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-muted/40 rounded-2xl p-4 mb-5">
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="text-xs font-semibold text-[#10b981]">AI Analysis</span>
              </div>
              <ul className="space-y-2">
                {selected.aiSummary.map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: selected.color }} />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reach via */}
            <p className="text-xs text-muted-foreground mb-5">
              Reach via:{' '}
              <span className="text-foreground font-medium">{selected.mutualNames.join(', ')}</span>
            </p>

            <button
              onClick={() => { toggleConnect(selected.id); setSelected(null); }}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95"
              style={{ background: selected.color }}
            >
              {connected.has(selected.id) ? '⏳ Pending' : '+ Connect'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
