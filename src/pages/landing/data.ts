import { Search, Building2, KeyRound, FileText, ShieldCheck, MessageCircle } from 'lucide-react'
import type {
  FAQItem,
  FeaturedListingItem,
  HowItWorksStep,
  HowItWorksWorkflow,
  MikoQuestionPill,
  TestimonialItem,
  WhyMokogoFeature,
} from './types'

export const rotatingHeroPlaceholders = [
  'Try: Koregaon Park, Pune',
  'Try: Baner, Pune',
  'Try: Wakad, Pune',
]

export const searchCities = ['Pune']

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: '01',
    title: 'Search your city & area',
    description: 'Pick your city, shortlist neighborhoods, and start with verified options.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Browse verified listings & connect directly with owners',
    description: 'See real homes, compare details, and message owners without middlemen.',
    icon: Building2,
  },
  {
    number: '03',
    title: 'Move in. Zero brokerage.',
    description: 'Finalize faster, save on fees, and move into a place that fits your vibe.',
    icon: KeyRound,
  },
]

export const listYourPlaceSteps: HowItWorksStep[] = [
  {
    number: '01',
    title: 'Add your space details',
    description: 'Share rent, photos, preferences, and the kind of tenant or flatmate you want.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Get discovered by genuine seekers',
    description: 'Show up where active renters are already searching with a listing that feels credible and clear.',
    icon: ShieldCheck,
  },
  {
    number: '03',
    title: 'Connect directly and close faster',
    description: 'Talk to interested people without broker noise and fill your place with more confidence.',
    icon: MessageCircle,
  },
]

export const howItWorksWorkflows: HowItWorksWorkflow[] = [
  {
    id: 'find',
    label: 'Find Your Place',
    title: 'For seekers: from search to move-in in 3 simple steps',
    description: 'Clean search, direct connections, and zero brokerage from day one.',
    steps: howItWorksSteps,
  },
  {
    id: 'list',
    label: 'List Your Place',
    title: 'For owners: from listing to closure in 3 simple steps',
    description: 'Create a trusted listing, reach the right audience, and connect directly without middlemen.',
    steps: listYourPlaceSteps,
  },
]

export const mikoQuestionPills: MikoQuestionPill[] = [
  { emoji: '📍', text: 'Which city are you searching in?' },
  { emoji: '🌿', text: "What's your ideal home vibe?" },
  { emoji: '🏠', text: 'How do you usually spend time at home?' },
  { emoji: '🎯', text: "What's your top priority right now?" },
  { emoji: '📆', text: 'When are you thinking of moving?' },
  { emoji: '🔐', text: 'How important is personal space for you?' },
  { emoji: '🚫', text: 'Anything that’s a hard no for you?' },
]

export const whyMokogoFeatures: WhyMokogoFeature[] = [
  {
    icon: '🔍',
    title: 'Verified Listings Only',
    description: 'Every listing is manually reviewed. No fake posts, no ghosts.',
  },
  {
    icon: '💸',
    title: 'Zero Brokerage. Always.',
    description: 'Pay no commission. Talk directly to the owner and save thousands.',
  },
  {
    icon: '🤝',
    title: 'Real Owner Contact',
    description: 'Skip the middlemen. Message or call owners directly from the platform.',
  },
  {
    icon: '🏳️‍🌈',
    title: 'Inclusive & Safe',
    description: "LGBTQ+ friendly filters. Find spaces where you'll truly belong.",
  },
]

export const faqItems: FAQItem[] = [
  {
    question: 'Is Mokogo really free to use?',
    answer:
      'Yes. Searching, browsing, and connecting on Mokogo is free for seekers, with zero brokerage on the homes you find here.',
  },
  {
    question: 'How are listings verified?',
    answer:
      'Each live listing goes through checks for authenticity and completeness before it appears publicly, helping reduce spam and misleading posts.',
  },
  {
    question: 'What is Miko Vibe Search?',
    answer:
      'Miko Vibe Search is our quick lifestyle matching flow that uses six simple questions to recommend homes that fit how you actually live.',
  },
  {
    question: 'Can I list a PG or hostel?',
    answer:
      'Yes. Owners and operators can list rooms, shared spaces, PGs, and similar stays as long as the details are accurate and complete.',
  },
  {
    question: 'How do I contact a room owner?',
    answer:
      'Open a listing, review the details, and use the contact flow to connect directly with the owner or host without a broker in between.',
  },
]

export const featuredDummyListings: FeaturedListingItem[] = [
  {
    id: 'listing-1',
    image: '/pune-city.png',
    furnishing: 'Fully Furnished',
    title: 'Master Room in 3BHK',
    location: 'Koregaon Park, Pune',
    preference: 'Working professionals only',
    price: '₹9,999/mo',
  },
  {
    id: 'listing-2',
    image: '/mumbai-city.png',
    furnishing: 'Semi Furnished',
    title: 'Private Room in 2BHK',
    location: 'Baner, Pune',
    preference: 'Students and professionals',
    price: '₹8,499/mo',
  },
  {
    id: 'listing-3',
    image: '/bangalore-city.png',
    furnishing: 'Unfurnished',
    title: 'Private Room in 1BHK',
    location: 'Wakad, Pune',
    preference: 'Women preferred',
    price: '₹7,999/mo',
  },
  {
    id: 'listing-4',
    image: '/hyderabad-city.png',
    furnishing: 'Fully Furnished',
    title: 'Sharing Room in 3BHK',
    location: 'Viman Nagar, Pune',
    preference: 'Open to all flatmates',
    price: '₹6,999/mo',
  },
  {
    id: 'listing-5',
    image: '/delhi-city.png',
    furnishing: 'Semi Furnished',
    title: 'Master Room in 2BHK',
    location: 'Kharadi, Pune',
    preference: 'Working professionals only',
    price: '₹10,499/mo',
  },
  {
    id: 'listing-6',
    image: '/pune-city.png',
    furnishing: 'Fully Furnished',
    title: 'Private Room in 3BHK',
    location: 'Hinjewadi, Pune',
    preference: 'Students preferred',
    price: '₹8,999/mo',
  },
]

export const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: 'Aarohi Kulkarni',
    role: 'Product Analyst',
    city: 'Pune, India',
    image: 'https://i.pravatar.cc/60?img=44',
    rating: 5,
    text: 'No brokers, no hassle. Direct contact with the owner saved me so much time and money!',
  },
  {
    id: 2,
    name: 'Rahul Mehra',
    role: 'Software Engineer',
    city: 'Pune, India',
    image: 'https://i.pravatar.cc/60?img=12',
    rating: 5,
    text: 'Found my perfect flatmate in 3 days. Miko Vibe Search is actually genius.',
  },
  {
    id: 3,
    name: 'Priya Nair',
    role: 'UX Designer',
    city: 'Pune, India',
    image: 'https://i.pravatar.cc/60?img=25',
    rating: 5,
    text: 'As someone new to Pune, Mokogo felt like a friend helping me settle in.',
  },
  {
    id: 4,
    name: 'Arjun Shah',
    role: 'Room Owner',
    city: 'Pune, India',
    image: 'https://i.pravatar.cc/60?img=18',
    rating: 5,
    text: 'Listed my flat and got 5 genuine inquiries in 24 hours. No spam, no brokers.',
  },
  {
    id: 5,
    name: 'Sneha Joshi',
    role: 'Content Writer',
    city: 'Pune, India',
    image: 'https://i.pravatar.cc/60?img=32',
    rating: 5,
    text: 'The LGBTQ+ friendly filter made such a difference. Found a safe, welcoming space finally.',
  },
]

export const whatsappCommunityUrl =
  'https://wa.me/?text=Hi%20Mokogo%20team%2C%20please%20share%20the%20Mokogo%20WhatsApp%20community%20link.'
