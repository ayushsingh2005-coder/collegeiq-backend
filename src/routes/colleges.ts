import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { search, location, course, minFees, maxFees, page = '1', limit = '9' } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const offset = (pageNum - 1) * limitNum;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIdx = 1;

  if (search) {
    conditions.push(`name ILIKE $${paramIdx}`);
    params.push(`%${search}%`);
    paramIdx++;
  }
  if (location) {
    conditions.push(`location ILIKE $${paramIdx}`);
    params.push(`%${location}%`);
    paramIdx++;
  }
  if (course) {
    conditions.push(`$${paramIdx} = ANY(courses)`);
    params.push(course);
    paramIdx++;
  }
  if (minFees) {
    conditions.push(`fees >= $${paramIdx}`);
    params.push(parseInt(minFees as string));
    paramIdx++;
  }
  if (maxFees) {
    conditions.push(`fees <= $${paramIdx}`);
    params.push(parseInt(maxFees as string));
    paramIdx++;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const countResult = await query(`SELECT COUNT(*) FROM colleges ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      `SELECT * FROM colleges ${where} ORDER BY rating DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limitNum, offset]
    );

    res.json({
      colleges: result.rows,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/action/compare', async (req: Request, res: Response): Promise<void> => {
  const { ids } = req.query;
  if (!ids) {
    res.status(400).json({ error: 'ids required' });
    return;
  }
  const idArray = (ids as string).split(',').map(Number).filter(Boolean).slice(0, 3);
  if (idArray.length < 2) {
    res.status(400).json({ error: 'Provide at least 2 college IDs' });
    return;
  }
  try {
    const placeholders = idArray.map((_, i) => `$${i + 1}`).join(',');
    const result = await query(`SELECT * FROM colleges WHERE id IN (${placeholders})`, idArray);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM colleges WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'College not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;