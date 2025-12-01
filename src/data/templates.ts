export interface SURGETemplate {
    id: string;
    name: string;
    description: string;
    category: 'conference' | 'meetup' | 'workshop' | 'hackathon' | 'community';
    preview: string;
    defaultData: {
        title: string;
        theme: "sketch" | "modern" | "flat" | "pixel" | "monochrome" | "abstract";
        keywords: string;
    };
}

export const templates: SURGETemplate[] = [
    {
        id: 'web3-conference',
        name: 'Web3 Conference',
        description: 'Professional design for major conferences',
        category: 'conference',
        preview: '/templates/web3-conference.png',
        defaultData: {
            title: 'Web3 Summit 2025',
            theme: 'modern',
            keywords: 'blockchain, conference, technology, innovation'
        }
    },
    {
        id: 'community-meetup',
        name: 'Community Meetup',
        description: 'Friendly style for community gatherings',
        category: 'meetup',
        preview: '/templates/community-meetup.png',
        defaultData: {
            title: 'Community Meetup',
            theme: 'flat',
            keywords: 'community, networking, friends, collaboration'
        }
    },
    {
        id: 'hackathon',
        name: 'Hackathon',
        description: 'Energetic design for hackathons',
        category: 'hackathon',
        preview: '/templates/hackathon.png',
        defaultData: {
            title: 'ETH Hackathon',
            theme: 'pixel',
            keywords: 'coding, building, innovation, competition'
        }
    },
    {
        id: 'workshop',
        name: 'Workshop',
        description: 'Educational style for workshops',
        category: 'workshop',
        preview: '/templates/workshop.png',
        defaultData: {
            title: 'Smart Contract Workshop',
            theme: 'sketch',
            keywords: 'learning, education, development, skills'
        }
    }
];
