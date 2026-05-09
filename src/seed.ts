import { query, initDB } from './db';
import dotenv from 'dotenv';
dotenv.config();

const states = [
  { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'] },
  { state: 'Delhi', cities: ['New Delhi', 'Dwarka', 'Rohini'] },
  { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Vellore'] },
  { state: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Manipal', 'Hubli', 'Mangalore'] },
  { state: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Karimnagar'] },
  { state: 'West Bengal', cities: ['Kolkata', 'Durgapur', 'Kharagpur'] },
  { state: 'Rajasthan', cities: ['Jaipur', 'Pilani', 'Jodhpur', 'Udaipur'] },
  { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Gandhinagar'] },
  { state: 'Uttar Pradesh', cities: ['Lucknow', 'Noida', 'Kanpur', 'Allahabad', 'Varanasi'] },
  { state: 'Punjab', cities: ['Chandigarh', 'Ludhiana', 'Patiala', 'Amritsar'] },
  { state: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Tirupati'] },
  { state: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'] },
  { state: 'Madhya Pradesh', cities: ['Bhopal', 'Indore', 'Gwalior'] },
  { state: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur'] },
  { state: 'Odisha', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela'] },
];

const prefixes = [
  'Institute of Technology', 'College of Engineering', 'University',
  'Institute of Engineering', 'College of Technology', 'Technical University',
  'Institute of Science and Technology', 'Engineering College',
  'College of Engineering and Technology', 'School of Engineering',
  'Institute of Management and Technology', 'College of Applied Sciences',
];

const nameWords = [
  'National', 'Regional', 'State', 'Central', 'Modern', 'Global', 'Premier', 'Elite',
  'Advanced', 'Pioneer', 'Sunrise', 'Excellence', 'Heritage', 'Future', 'Vision',
  'Apex', 'Summit', 'Horizon', 'Stellar', 'Dynamic', 'Innovative', 'Progressive',
  'United', 'Allied', 'Integrated', 'Applied', 'Oriental', 'Occidental',
];

const allCoursesets = [
  ['B.Tech', 'M.Tech', 'MBA', 'PhD'],
  ['B.Tech', 'M.Tech', 'MSc', 'PhD'],
  ['B.Tech', 'M.Tech', 'MBA', 'MCA'],
  ['B.Tech', 'MBA', 'MCA'],
  ['B.Tech', 'M.Tech', 'MCA', 'PhD'],
  ['B.Tech', 'M.Tech', 'MBA', 'MSc', 'PhD'],
  ['B.Tech', 'MCA', 'MBA'],
  ['B.Tech', 'M.Tech'],
  ['MBA', 'MCA', 'MSc'],
  ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'PhD'],
];

const overviewTemplates = [
  (name: string, city: string) => `${name} in ${city} is a premier institution known for academic excellence and strong industry connections.`,
  (name: string, city: string) => `Located in ${city}, ${name} offers world-class education with state-of-the-art facilities and experienced faculty.`,
  (name: string, city: string) => `${name} has been shaping engineers and managers in ${city} with a focus on innovation and practical learning.`,
  (name: string, city: string) => `A top-ranked institution in ${city}, ${name} is recognized for research output and high placement records.`,
  (name: string, city: string) => `${name} provides quality technical education in ${city} with strong alumni networks across major Indian companies.`,
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateColleges(count: number) {
  const colleges = [];
  const usedNames = new Set<string>();

  const real = [
    { name: 'IIT Bombay', location: 'Mumbai, Maharashtra', fees: 200000, rating: 4.8, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 98, overview: 'IIT Bombay is one of the premier engineering institutions in India.' },
    { name: 'IIT Delhi', location: 'New Delhi, Delhi', fees: 200000, rating: 4.7, courses: ['B.Tech', 'M.Tech', 'MSc', 'PhD'], placement_percentage: 97, overview: 'IIT Delhi is a leading technical institution in the national capital.' },
    { name: 'IIT Madras', location: 'Chennai, Tamil Nadu', fees: 200000, rating: 4.9, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 99, overview: 'IIT Madras is ranked #1 in India with exceptional placements.' },
    { name: 'IIT Kanpur', location: 'Kanpur, Uttar Pradesh', fees: 200000, rating: 4.7, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 96, overview: 'IIT Kanpur is known for cutting-edge research and strong alumni network.' },
    { name: 'IIT Kharagpur', location: 'Kharagpur, West Bengal', fees: 200000, rating: 4.6, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 95, overview: 'IIT Kharagpur is the oldest IIT with a sprawling campus and excellent placements.' },
    { name: 'IIT Roorkee', location: 'Roorkee, Uttarakhand', fees: 200000, rating: 4.5, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 93, overview: 'IIT Roorkee is one of the oldest technical institutes in Asia.' },
    { name: 'BITS Pilani', location: 'Pilani, Rajasthan', fees: 500000, rating: 4.5, courses: ['B.Tech', 'M.Tech', 'MBA', 'MSc'], placement_percentage: 92, overview: 'BITS Pilani is known for its practice school program and strong alumni network.' },
    { name: 'NIT Trichy', location: 'Tiruchirappalli, Tamil Nadu', fees: 150000, rating: 4.4, courses: ['B.Tech', 'M.Tech', 'MCA', 'PhD'], placement_percentage: 89, overview: 'NIT Trichy is consistently ranked among the top NITs in India.' },
    { name: 'VIT Vellore', location: 'Vellore, Tamil Nadu', fees: 350000, rating: 4.1, courses: ['B.Tech', 'M.Tech', 'MBA', 'MCA'], placement_percentage: 85, overview: 'VIT Vellore is known for its international collaborations.' },
    { name: 'IIIT Hyderabad', location: 'Hyderabad, Telangana', fees: 300000, rating: 4.6, courses: ['B.Tech', 'M.Tech', 'MS', 'PhD'], placement_percentage: 95, overview: 'IIIT Hyderabad specializes in Information Technology.' },
    { name: 'Delhi Technological University', location: 'New Delhi, Delhi', fees: 120000, rating: 4.2, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 87, overview: 'DTU is one of the oldest technical universities in Delhi.' },
    { name: 'Jadavpur University', location: 'Kolkata, West Bengal', fees: 50000, rating: 4.3, courses: ['B.Tech', 'M.Tech', 'MSc', 'PhD'], placement_percentage: 84, overview: 'Jadavpur University is known for excellence in engineering.' },
    { name: 'Manipal Institute of Technology', location: 'Manipal, Karnataka', fees: 420000, rating: 4.0, courses: ['B.Tech', 'M.Tech', 'MBA'], placement_percentage: 80, overview: 'MIT Manipal has a beautiful campus and strong global alumni network.' },
    { name: 'NIT Warangal', location: 'Warangal, Telangana', fees: 150000, rating: 4.3, courses: ['B.Tech', 'M.Tech', 'MCA', 'PhD'], placement_percentage: 88, overview: 'NIT Warangal is one of the oldest and most prestigious NITs.' },
    { name: 'NIT Surathkal', location: 'Mangalore, Karnataka', fees: 150000, rating: 4.2, courses: ['B.Tech', 'M.Tech', 'MCA', 'PhD'], placement_percentage: 86, overview: 'NIT Surathkal is a top NIT known for strong technical education.' },
    { name: 'Thapar Institute of Engineering', location: 'Patiala, Punjab', fees: 450000, rating: 4.1, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 83, overview: 'Thapar is known for strong engineering programs and placements.' },
    { name: 'SRM Institute of Science and Technology', location: 'Chennai, Tamil Nadu', fees: 380000, rating: 3.9, courses: ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'PhD'], placement_percentage: 78, overview: 'SRM is one of the largest private universities in India.' },
    { name: 'Amrita Vishwa Vidyapeetham', location: 'Coimbatore, Tamil Nadu', fees: 320000, rating: 4.0, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 82, overview: 'Amrita is known for values-based education and research.' },
    { name: 'PSG College of Technology', location: 'Coimbatore, Tamil Nadu', fees: 100000, rating: 4.2, courses: ['B.Tech', 'M.Tech', 'MCA', 'MBA'], placement_percentage: 86, overview: 'PSG Tech has excellent industry partnerships in Tamil Nadu.' },
    { name: 'IIIT Bangalore', location: 'Bengaluru, Karnataka', fees: 350000, rating: 4.4, courses: ['M.Tech', 'MSc', 'PhD'], placement_percentage: 92, overview: 'IIIT Bangalore is a premier postgraduate research institution.' },
  ];

  for (const r of real) usedNames.add(r.name);
  colleges.push(...real);

  // Generate unique names using index to guarantee uniqueness
  for (const stateObj of states) {
    for (const city of stateObj.cities) {
      for (const word of nameWords) {
        for (const prefix of prefixes) {
          if (colleges.length >= count) break;
          const name = `${city} ${word} ${prefix}`;
          if (usedNames.has(name)) continue;
          usedNames.add(name);

          const rating = randFloat(3.2, 4.6);
          const placement = rand(55, 93);
          const fees = rand(1, 12) * 50000;
          const courses = pick(allCoursesets);
          const overviewFn = pick(overviewTemplates);

          colleges.push({
            name,
            location: `${city}, ${stateObj.state}`,
            fees,
            rating,
            courses,
            placement_percentage: placement,
            overview: overviewFn(name, city),
          });
        }
        if (colleges.length >= count) break;
      }
      if (colleges.length >= count) break;
    }
    if (colleges.length >= count) break;
  }

  return colleges;
}

export const seed = async () => {
  await initDB();

  // First delete existing duplicates keeping lowest id
  await query(`
    DELETE FROM colleges
    WHERE id NOT IN (
      SELECT MIN(id) FROM colleges GROUP BY name
    )
  `);

  const colleges = generateColleges(1000);
  let inserted = 0;
  let skipped = 0;

  for (const college of colleges) {
    try {
      const result = await query(
        `INSERT INTO colleges (name, location, fees, rating, courses, placement_percentage, overview)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (name) DO NOTHING`,
        [college.name, college.location, college.fees, college.rating,
         college.courses, college.placement_percentage, college.overview]
      );
      if (result.rowCount && result.rowCount > 0) inserted++;
      else skipped++;
    } catch (err) {
      console.error('Error inserting:', college.name, err);
    }
  }

  console.log(`Seeded ${inserted} new colleges, skipped ${skipped} duplicates`);
};

if (require.main === module) {
  seed().catch(console.error).finally(() => process.exit(0));
}