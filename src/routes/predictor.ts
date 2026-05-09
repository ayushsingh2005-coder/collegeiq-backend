import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

function getRankTier(exam: string, rank: number) {
  const e = exam.toLowerCase();

  if (e === 'jee_advanced') {
    if (rank <= 500)  return { minRating: 4.7, minPlacement: 95, maxFees: 300000, label: 'IIT tier' };
    if (rank <= 2000) return { minRating: 4.5, minPlacement: 90, maxFees: 350000, label: 'Top IIT/IIIT tier' };
    if (rank <= 5000) return { minRating: 4.2, minPlacement: 85, maxFees: 400000, label: 'NIT/IIIT tier' };
    return                   { minRating: 3.8, minPlacement: 75, maxFees: 500000, label: 'Good private colleges' };
  }

  if (e === 'jee_main') {
    if (rank <= 1000)  return { minRating: 4.5, minPlacement: 90, maxFees: 350000, label: 'Top NIT/IIIT tier' };
    if (rank <= 10000) return { minRating: 4.2, minPlacement: 85, maxFees: 400000, label: 'NIT/State top colleges' };
    if (rank <= 50000) return { minRating: 4.0, minPlacement: 78, maxFees: 500000, label: 'Good private colleges' };
    return                    { minRating: 3.5, minPlacement: 70, maxFees: 600000, label: 'All colleges' };
  }

  // CUET / others — looser filter
  if (rank <= 1000)  return { minRating: 4.3, minPlacement: 85, maxFees: 400000, label: 'Top colleges' };
  if (rank <= 10000) return { minRating: 4.0, minPlacement: 78, maxFees: 500000, label: 'Good colleges' };
  return                    { minRating: 3.5, minPlacement: 65, maxFees: 600000, label: 'All colleges' };
}

// GET /api/predictor?exam=jee_main&rank=5000&course=B.Tech
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { exam, rank, course } = req.query;

  if (!exam || !rank) {
    res.status(400).json({ error: 'exam and rank are required' });
    return;
  }

  const rankNum = parseInt(rank as string);
  if (isNaN(rankNum) || rankNum <= 0) {
    res.status(400).json({ error: 'rank must be a positive number' });
    return;
  }

  const tier = getRankTier(exam as string, rankNum);

  try {
    let q = `
      SELECT * FROM colleges
      WHERE rating >= $1
        AND placement_percentage >= $2
        AND fees <= $3
    `;
    const params: (number | string)[] = [tier.minRating, tier.minPlacement, tier.maxFees];

    if (course && course !== '') {
      params.push(`%${course}%`);
      q += ` AND $${params.length} = ANY(courses::text[]) OR array_to_string(courses, ',') ILIKE $${params.length}`;
    }

    q += ` ORDER BY rating DESC, placement_percentage DESC LIMIT 10`;

    const result = await query(q, params);

    res.json({
      exam,
      rank: rankNum,
      tier: tier.label,
      colleges: result.rows,
      total: result.rows.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

export default router;