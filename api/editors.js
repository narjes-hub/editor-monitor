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

  // Admin auth check
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword && authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }

  try {
    const { data: editors, error } = await supabase
      .from('editors')
      .select(`
        id,
        name,
        email,
        api_key,
        is_active,
        created_at,
        brands (
          id,
          name,
          website
        )
      `)
      .order('brands(name)', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    // Format for easy reading
    const formatted = editors.map(e => ({
      name: e.name,
      email: e.email,
      brand: e.brands?.name,
      apiKey: e.api_key,
      isActive: e.is_active
    }));

    return res.status(200).json({
      editors: formatted,
      total: formatted.length
    });

  } catch (error) {
    console.error('Editors API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
