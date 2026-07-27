// Location constants
export const DEFAULT_LOCATION = {
  lat: 7.2518336239080154,
  lng: 81.85421409721363,
  name: 'Addalachenai, Sri Lanka',
};

// Map configuration
export const MAP_CONFIG = {
  zoom: 15,
  title: 'Complaint Location',
};

// Complaint categories
export const COMPLAINT_CATEGORIES = [
  'Waste Management',
  'Street Lighting',
  'Drainage Systems',
  'Roads & Repairs',
  'General Support',
];

// Timing constants (in milliseconds)
export const TIMING = {
  redirectDelay: 500,
  smoothScrollDelay: 100,
  successMessageDuration: 2000,
};

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ACCOUNT: '/account',
  COMPLAINT_CREATE: '/complaint/create',
  ADMIN: '/admin',
  VERIFY_EMAIL: '/auth/verify-email',
};

// API endpoints
export const API_ENDPOINTS = {
  TOKEN_CHECK: '/api/token-check',
  COMPLAINT_CREATE: '/api/complaint/create',
};

// Service configuration
export const SERVICES = [
  {
    id: 'waste-management',
    title: 'Waste Management',
    category: 'Waste Management',
    image: '/images/service-waste-management.jpg',
    gradient: 'from-green-600 to-green-700',
    description: 'Daily waste collection and proper disposal systems for community',
    fullDescription: 'Our comprehensive waste management system ensures proper collection, segregation, and disposal of waste materials. We handle everything from residential waste to commercial debris, maintaining clean and healthy surroundings for the entire community.',
    services: [
      'Daily waste collection from residential areas',
      'Proper waste segregation and recycling',
      'Clean-up of public spaces',
      'Garbage bin maintenance'
    ]
  },
  {
    id: 'street-lighting',
    title: 'Street Lighting',
    category: 'Street Lighting',
    image: '/images/service-street-lights.jpg',
    gradient: 'from-yellow-500 to-yellow-600',
    description: 'Maintenance of street lights for safe roads at night',
    fullDescription: 'We maintain street lighting infrastructure to ensure safe and well-lit roads throughout the community. Our team conducts regular inspections, repairs, and replacements to keep all lights functional.',
    services: [
      'Street light installation and maintenance',
      'Emergency repairs for non-functional lights',
      'Regular inspections and testing',
      '24/7 emergency response'
    ]
  },
  {
    id: 'drainage-systems',
    title: 'Drainage Systems',
    category: 'Drainage Systems',
    image: '/images/service-drainage-maintenance.jpg',
    gradient: 'from-blue-600 to-blue-700',
    description: 'Regular drainage maintenance and blockage resolution',
    fullDescription: 'Our drainage system maintenance ensures proper water flow and prevents flooding. We handle blockage clearing, pipe repairs, and preventive maintenance to keep drainage systems functioning efficiently.',
    services: [
      'Drainage cleaning and de-silting',
      'Blockage removal and repairs',
      'Pipe maintenance and replacement',
      'Storm water management'
    ]
  },
  {
    id: 'roads-repairs',
    title: 'Roads & Repairs',
    category: 'Roads & Repairs',
    image: '/images/service-road-maintenance.jpg',
    gradient: 'from-gray-600 to-gray-700',
    description: 'Repair damaged roads and maintain safe access routes',
    fullDescription: 'We maintain and repair roads to ensure safe and smooth travel for all community members. Our team addresses potholes, cracks, and other road damage promptly.',
    services: [
      'Pothole repairs and road patching',
      'Road resurfacing and asphalt laying',
      'Road marking and signage',
      'Bridge and culvert maintenance'
    ]
  },
  {
    id: 'general-support',
    title: 'General Support',
    category: 'General Support',
    image: '/images/service-general-support.jpg',
    gradient: 'from-purple-600 to-purple-700',
    description: 'Submit other concerns and suggestions for improvement',
    fullDescription: 'Beyond our core services, we are here to address any community concerns and suggestions. Submit your concerns and help us improve our services.',
    services: [
      'General inquiries and support',
      'Community feedback and suggestions',
      'Special event coordination',
      'Emergency services coordination'
    ]
  }
];
