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

export const cityAreaHintExamples: Record<string, string[]> = {
  pune: ['Try: Koregaon Park, Pune', 'Try: Baner, Pune', 'Try: Wakad, Pune'],
  mumbai: ['Try: Andheri, Mumbai', 'Try: Bandra, Mumbai', 'Try: Powai, Mumbai'],
  bangalore: ['Try: Koramangala, Bangalore', 'Try: Indiranagar, Bangalore', 'Try: HSR Layout, Bangalore'],
  hyderabad: ['Try: Gachibowli, Hyderabad', 'Try: Hitech City, Hyderabad', 'Try: Kondapur, Hyderabad'],
  'delhi ncr': ['Try: South Delhi, Delhi NCR', 'Try: DLF Phase 3, Delhi NCR', 'Try: Noida Sector 62, Delhi NCR'],
  chennai: ['Try: Adyar, Chennai', 'Try: Velachery, Chennai', 'Try: OMR, Chennai'],
  kolkata: ['Try: Salt Lake, Kolkata', 'Try: New Town, Kolkata', 'Try: Ballygunge, Kolkata'],
  ahmedabad: ['Try: Prahlad Nagar, Ahmedabad', 'Try: Vastrapur, Ahmedabad', 'Try: Thaltej, Ahmedabad'],
  jaipur: ['Try: Mansarovar, Jaipur', 'Try: Malviya Nagar, Jaipur', 'Try: Vaishali Nagar, Jaipur'],
  surat: ['Try: Vesu, Surat', 'Try: Adajan, Surat', 'Try: Pal, Surat'],
  indore: ['Try: Vijay Nagar, Indore', 'Try: Palasia, Indore', 'Try: Rau, Indore'],
  chandigarh: ['Try: Sector 17, Chandigarh', 'Try: Sector 35, Chandigarh', 'Try: Sector 44, Chandigarh'],
  kochi: ['Try: Kakkanad, Kochi', 'Try: Edappally, Kochi', 'Try: Panampilly Nagar, Kochi'],
  coimbatore: ['Try: RS Puram, Coimbatore', 'Try: Peelamedu, Coimbatore', 'Try: Avinashi Road, Coimbatore'],
  vizag: ['Try: MVP Colony, Vizag', 'Try: Madhurawada, Vizag', 'Try: Seethammadhara, Vizag'],
  nagpur: ['Try: Dharampeth, Nagpur', 'Try: Civil Lines, Nagpur', 'Try: Wardha Road, Nagpur'],
  lucknow: ['Try: Gomti Nagar, Lucknow', 'Try: Aliganj, Lucknow', 'Try: Indira Nagar, Lucknow'],
  bhopal: ['Try: Arera Colony, Bhopal', 'Try: MP Nagar, Bhopal', 'Try: Kolar Road, Bhopal'],
  patna: ['Try: Boring Road, Patna', 'Try: Kankarbagh, Patna', 'Try: Bailey Road, Patna'],
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: '01',
    title: 'Search your city & area',
    description: 'Pick your city, shortlist neighborhoods, and start with verified options.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Connect directly with owners',
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
    description: 'Skip the middlemen. Message owners directly from the platform.',
  },
  {
    icon: '🏳️‍🌈',
    title: 'Inclusive & Safe',
    description: "LGBTQ+ friendly filters. Find spaces where you'll truly belong.",
  },
]

export const faqItems: FAQItem[] = [
  {
    question: 'What exactly is Mokogo and how is it different?',
    answer:
      "Mokogo is a shared housing discovery platform. We don't act as brokers, take commissions, or push deals. You connect directly with flat owners or current tenants. No middlemen, no brokerage fees, no spam calls from agents.",
  },
  {
    question: "Is it really free? What's the catch?",
    answer:
      "Yes, completely free right now for both listing and finding a place. No hidden charges, no premium unlocks. Mokogo is free because we're building trust first. That's the only agenda.",
  },
  {
    question: 'Will Mokogo always be free?',
    answer:
      "Listing a space will always be free. In the future, we may introduce a small fee for connecting seekers with listers but we'll be upfront about it well in advance, and we'll only charge when the value is clear.",
  },
  {
    question: 'How do I find a room or flatmate that actually fits me?',
    answer:
      "You can search by city, budget, and area. Mokogo also helps match you based on lifestyle preferences so you're not just finding a room, you're finding a living situation that works for you.",
  },
  {
    question: 'How do I know the listings are real and not fake or outdated?',
    answer:
      "Listings on Mokogo are closely monitored and organised, not pulled from random group posts or broker aggregators. If something looks off, you can flag it and we'll look into it.",
  },
  {
    question: 'Do I need an account just to browse?',
    answer:
      "You can browse listings without an account. You'll need to sign up when you want to connect with a lister or post your own space.",
  },
  {
    question: "I'm a lister. Will brokers or random people spam me?",
    answer:
      "No. Mokogo is built specifically to keep brokers out. Your contact details aren't publicly exposed so you only hear from people who are genuinely looking.",
  },
  {
    question: 'Which cities is Mokogo currently available in?',
    answer:
      "We're starting in Pune, Mumbai, Bangalore, Hyderabad, and Delhi NCR. More cities are coming. If yours isn't listed yet, you can sign up to be notified when we launch there.",
  },
  {
    question: 'What happens after I connect with someone? Does Mokogo stay involved?',
    answer:
      "Once we connect you, the conversation and decision is entirely yours. Mokogo doesn't interfere, take a cut, or push any outcome. We're a discovery platform. What happens next is between real people.",
  },
  {
    question: 'Is Mokogo safe to use, especially for women and LGBTQ users?',
    answer:
      "Your phone number and personal details are never publicly visible on Mokogo. We built it this way deliberately because women shouldn't have to share their number with strangers just to find a flat, and because LGBTQ users deserve a space where they can look for housing without uncertainty about whether they'll be welcomed.",
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
