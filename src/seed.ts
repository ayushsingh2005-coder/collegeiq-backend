import { query, initDB } from './db';
import dotenv from 'dotenv';
dotenv.config();

const colleges = [
  { name: 'IIT Bombay', location: 'Mumbai, Maharashtra', fees: 200000, rating: 4.8, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 98, overview: 'IIT Bombay is one of the premier engineering institutions in India.' },
  { name: 'IIT Delhi', location: 'New Delhi, Delhi', fees: 200000, rating: 4.7, courses: ['B.Tech', 'M.Tech', 'MSc', 'PhD'], placement_percentage: 97, overview: 'IIT Delhi is a leading technical institution in the national capital.' },
  { name: 'IIT Madras', location: 'Chennai, Tamil Nadu', fees: 200000, rating: 4.9, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 99, overview: 'IIT Madras is ranked #1 in India with exceptional placements.' },
  { name: 'BITS Pilani', location: 'Pilani, Rajasthan', fees: 500000, rating: 4.5, courses: ['B.Tech', 'M.Tech', 'MBA', 'MSc'], placement_percentage: 92, overview: 'BITS Pilani is known for its practice school program and strong alumni network.' },
  { name: 'NIT Trichy', location: 'Tiruchirappalli, Tamil Nadu', fees: 150000, rating: 4.4, courses: ['B.Tech', 'M.Tech', 'MCA', 'PhD'], placement_percentage: 89, overview: 'NIT Trichy is consistently ranked among the top NITs in India.' },
  { name: 'VIT Vellore', location: 'Vellore, Tamil Nadu', fees: 350000, rating: 4.1, courses: ['B.Tech', 'M.Tech', 'MBA', 'MCA'], placement_percentage: 85, overview: 'VIT Vellore is known for its international collaborations.' },
  { name: 'IIIT Hyderabad', location: 'Hyderabad, Telangana', fees: 300000, rating: 4.6, courses: ['B.Tech', 'M.Tech', 'MS', 'PhD'], placement_percentage: 95, overview: 'IIIT Hyderabad specializes in Information Technology.' },
  { name: 'Delhi Technological University', location: 'New Delhi, Delhi', fees: 120000, rating: 4.2, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 87, overview: 'DTU is one of the oldest technical universities in Delhi.' },
  { name: 'Jadavpur University', location: 'Kolkata, West Bengal', fees: 50000, rating: 4.3, courses: ['B.Tech', 'M.Tech', 'MSc', 'PhD'], placement_percentage: 84, overview: 'Jadavpur University is known for excellence in engineering.' },
  { name: 'Manipal Institute of Technology', location: 'Manipal, Karnataka', fees: 420000, rating: 4.0, courses: ['B.Tech', 'M.Tech', 'MBA'], placement_percentage: 80, overview: 'MIT Manipal has a beautiful campus and strong global alumni network.' },
  { name: 'NIT Warangal', location: 'Warangal, Telangana', fees: 150000, rating: 4.3, courses: ['B.Tech', 'M.Tech', 'MCA', 'PhD'], placement_percentage: 88, overview: 'NIT Warangal is one of the oldest and most prestigious NITs.' },
  { name: 'Thapar Institute of Engineering', location: 'Patiala, Punjab', fees: 450000, rating: 4.1, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 83, overview: 'Thapar is known for strong engineering programs and placements.' },
  { name: 'SRM Institute of Science and Technology', location: 'Chennai, Tamil Nadu', fees: 380000, rating: 3.9, courses: ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'PhD'], placement_percentage: 78, overview: 'SRM is one of the largest private universities in India.' },
  { name: 'Amrita Vishwa Vidyapeetham', location: 'Coimbatore, Tamil Nadu', fees: 320000, rating: 4.0, courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'], placement_percentage: 82, overview: 'Amrita is known for values-based education and research.' },
  { name: 'PSG College of Technology', location: 'Coimbatore, Tamil Nadu', fees: 100000, rating: 4.2, courses: ['B.Tech', 'M.Tech', 'MCA', 'MBA'], placement_percentage: 86, overview: 'PSG Tech has excellent industry partnerships in Tamil Nadu.' },
];

const seed = async () => {
  await initDB();
  for (const college of colleges) {
    await query(
      `INSERT INTO colleges (name, location, fees, rating, courses, placement_percentage, overview)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING`,
      [college.name, college.location, college.fees, college.rating, college.courses, college.placement_percentage, college.overview]
    );
  }
  console.log('Seeded 15 colleges');
  process.exit(0);
};

seed().catch(console.error);