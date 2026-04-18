export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  image: string;
  description: string;
  shelterId: string;
  vaccinated: boolean;
  neutered: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  description: string;
  dogsCount: number;
  rating: number;
  image: string;
}

export interface AdoptionRequest {
  id: string;
  dogName: string;
  applicantName: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export const shelters: Shelter[] = [
  { id: "1", name: "Paws of Hope", location: "Koramangala, Bangalore", phone: "+91 98765 43210", email: "info@pawsofhope.org", description: "A no-kill shelter dedicated to rescuing and rehabilitating stray dogs across South Bangalore.", dogsCount: 24, rating: 4.8, image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400" },
  { id: "2", name: "Stray Aid Foundation", location: "Indiranagar, Bangalore", phone: "+91 98765 43211", email: "help@strayaid.org", description: "Working since 2015 to provide medical care and shelter to abandoned dogs.", dogsCount: 18, rating: 4.6, image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400" },
  { id: "3", name: "FurEver Home NGO", location: "HSR Layout, Bangalore", phone: "+91 98765 43212", email: "adopt@fureverhome.in", description: "Connecting loving families with rescued street dogs through responsible adoption programs.", dogsCount: 31, rating: 4.9, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400" },
  { id: "4", name: "Wagging Tails Rescue", location: "Whitefield, Bangalore", phone: "+91 98765 43213", email: "contact@waggingtails.org", description: "Community-driven rescue focused on vaccinating, neutering, and rehoming stray dogs.", dogsCount: 15, rating: 4.5, image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400" },
];

export const dogs: Dog[] = [
  { id: "1", name: "Bruno", breed: "Indian Pariah", age: "2 years", gender: "Male", size: "Medium", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400", description: "A friendly and energetic boy who loves morning walks and belly rubs.", shelterId: "1", vaccinated: true, neutered: true },
  { id: "2", name: "Bella", breed: "Labrador Mix", age: "1.5 years", gender: "Female", size: "Large", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400", description: "Gentle soul who gets along with kids and other pets beautifully.", shelterId: "1", vaccinated: true, neutered: false },
  { id: "3", name: "Rocky", breed: "German Shepherd Mix", age: "3 years", gender: "Male", size: "Large", image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400", description: "Loyal and protective. Perfect for families looking for a guardian companion.", shelterId: "2", vaccinated: true, neutered: true },
  { id: "4", name: "Luna", breed: "Indian Spitz", age: "8 months", gender: "Female", size: "Small", image: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400", description: "Playful little pup with the softest fur. Still learning her tricks!", shelterId: "2", vaccinated: true, neutered: false },
  { id: "5", name: "Max", breed: "Indie", age: "4 years", gender: "Male", size: "Medium", image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=400", description: "Calm and composed. Max loves lazy afternoons and gentle pats.", shelterId: "3", vaccinated: true, neutered: true },
  { id: "6", name: "Coco", breed: "Beagle Mix", age: "2 years", gender: "Female", size: "Medium", image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=400", description: "Curious explorer with an adorable howl. Great with active families.", shelterId: "3", vaccinated: true, neutered: true },
  { id: "7", name: "Tiger", breed: "Rottweiler Mix", age: "5 years", gender: "Male", size: "Large", image: "https://images.unsplash.com/photo-1558929996-da64ba858215?w=400", description: "Don't let the name fool you — Tiger is a gentle giant who loves cuddles.", shelterId: "4", vaccinated: true, neutered: true },
  { id: "8", name: "Daisy", breed: "Pomeranian Mix", age: "1 year", gender: "Female", size: "Small", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400", description: "A tiny bundle of joy with boundless energy and a fluffy tail.", shelterId: "4", vaccinated: true, neutered: false },
];

export const adoptionRequests: AdoptionRequest[] = [
  { id: "1", dogName: "Bruno", applicantName: "Rahul Sharma", status: "approved", date: "2026-03-15" },
  { id: "2", dogName: "Luna", applicantName: "Priya Patel", status: "pending", date: "2026-03-22" },
  { id: "3", dogName: "Max", applicantName: "Arjun Mehta", status: "pending", date: "2026-03-25" },
  { id: "4", dogName: "Bella", applicantName: "Sneha Reddy", status: "rejected", date: "2026-03-10" },
  { id: "5", dogName: "Coco", applicantName: "Vikram Singh", status: "approved", date: "2026-03-28" },
];

export const donationTiers = [
  { amount: 500, label: "Feed a dog for a week", icon: "🍖" },
  { amount: 1500, label: "Vaccinate a rescued dog", icon: "💉" },
  { amount: 3000, label: "Sponsor a shelter dog for a month", icon: "🏠" },
  { amount: 5000, label: "Fund a rescue operation", icon: "🚑" },
];
