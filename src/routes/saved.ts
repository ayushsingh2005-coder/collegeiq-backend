import { Router, Response } from 'express';
import { query } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT c.* FROM colleges c
       JOIN saved_colleges sc ON sc.college_id = c.id
       WHERE sc.user_id = $1`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:collegeId', async (req: AuthRequest, res: Response): Promise<void> => {
  const { collegeId } = req.params;
  try {
    await query(
      'INSERT INTO saved_colleges (user_id, college_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.userId, collegeId]
    );
    res.json({ message: 'Saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:collegeId', async (req: AuthRequest, res: Response): Promise<void> => {
  const { collegeId } = req.params;
  try {
    await query(
      'DELETE FROM saved_colleges WHERE user_id = $1 AND college_id = $2',
      [req.userId, collegeId]
    );
    res.json({ message: 'Removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;