import { addDays, subDays, format } from 'date-fns';

// Helpers
const generateTimeSeriesData = (days: number, baseValue: number, volatility: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const value = Math.max(0, Math.floor(baseValue + (Math.random() - 0.5) * volatility));
    return {
      date: format(date, 'MMM dd'),
      value,
    };
  });
};

const generateMultiSeriesData = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    return {
      date: format(date, 'MMM dd'),
      DAU: Math.floor(1200 + Math.random() * 300),
      MAU: Math.floor(5000 + Math.random() * 500),
    };
  });
};

// Mock Data Exports

export const kpiData = {
  totalUsers: 12450,
  signupsToday: 142,
  active30d: 8320,
  activePremium: 1250,
  totalMatches: 45200,
  womenMenRatio: "42:58",
  verificationQueue: 48,
  deactivatedUsers: 156,
};

export const signupsData = generateTimeSeriesData(30, 120, 40);
export const activeUserEngagementData = generateMultiSeriesData(90);

export const countryDistribution = [
  { name: 'India', women: 400, men: 600 },
  { name: 'USA', women: 300, men: 350 },
  { name: 'UK', women: 200, men: 250 },
  { name: 'Canada', women: 150, men: 180 },
  { name: 'UAE', women: 100, men: 150 },
];

export const topUsers = [
  { id: 1, name: "Aarav Patel", age: 28, location: "Mumbai, IN", activityScore: 98, status: "Premium", verified: true },
  { id: 2, name: "Priya Sharma", age: 26, location: "Delhi, IN", activityScore: 95, status: "Premium", verified: true },
  { id: 3, name: "Rohan Gupta", age: 30, location: "London, UK", activityScore: 92, status: "Free", verified: true },
  { id: 4, name: "Sneha Reddy", age: 27, location: "Bangalore, IN", activityScore: 89, status: "Premium", verified: true },
  { id: 5, name: "Vikram Singh", age: 32, location: "Toronto, CA", activityScore: 88, status: "Free", verified: true },
  { id: 6, name: "Ananya Das", age: 25, location: "Kolkata, IN", activityScore: 85, status: "Free", verified: true },
  { id: 7, name: "Arjun Kumar", age: 29, location: "Dubai, UAE", activityScore: 82, status: "Premium", verified: true },
  { id: 8, name: "Meera Iyer", age: 28, location: "Chennai, IN", activityScore: 80, status: "Free", verified: true },
  { id: 9, name: "Kabir Khan", age: 31, location: "Mumbai, IN", activityScore: 78, status: "Premium", verified: true },
  { id: 10, name: "Zara Sheikh", age: 26, location: "New York, USA", activityScore: 76, status: "Free", verified: false },
];

export const verificationQueue = [
  { id: 101, name: "Rahul Verma", age: 29, location: "Pune, IN", submitted: "2 hrs ago", documents: "Passport" },
  { id: 102, name: "Ishita Malhotra", age: 27, location: "Chandigarh, IN", submitted: "5 hrs ago", documents: "Aadhar" },
  { id: 103, name: "Amit Shah", age: 33, location: "Ahmedabad, IN", submitted: "1 day ago", documents: "License" },
  { id: 104, name: "Nisha Patel", age: 26, location: "Surat, IN", submitted: "1 day ago", documents: "PAN Card" },
  { id: 105, name: "Karan Johar", age: 30, location: "Mumbai, IN", submitted: "2 days ago", documents: "Passport" },
];
