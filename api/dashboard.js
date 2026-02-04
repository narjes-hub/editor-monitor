const { supabase } = require('../lib/supabase');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth check
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword && authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { filter, limit = 50, offset = 0 } = req.query;

    // Build query
    let query = supabase
      .from('request_details')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filter === 'flagged') {
      query = query.eq('is_flagged', true);
    }

    const { data: requests, error } = await query;

    if (error) {
      throw error;
    }

    // Get summary stats
    const { data: stats } = await supabase
      .from('requests')
      .select('is_flagged')
      .then(({ data }) => {
        const total = data?.length || 0;
        const flagged = data?.filter(r => r.is_flagged).length || 0;
        return {
          data: {
            total,
            flagged,
            clean: total - flagged,
            flagRate: total > 0 ? ((flagged / total) * 100).toFixed(1) : 0
          }
        };
      });

    // Get editor stats
    const { data: editorStats } = await supabase
      .from('requests')
      .select(`
        editor_id,
        is_flagged,
        editors (name, brand_id)
      `)
      .then(({ data }) => {
        const byEditor = {};
        data?.forEach(r => {
          const name = r.editors?.name || 'Unknown';
          if (!byEditor[name]) {
            byEditor[name] = { total: 0, flagged: 0 };
          }
          byEditor[name].total++;
          if (r.is_flagged) byEditor[name].flagged++;
        });
        return { data: byEditor };
      });

    return res.status(200).json({
      requests,
      stats,
      editorStats,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
