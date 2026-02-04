const { supabase } = require('../lib/supabase');
const { classifyContent } = require('../lib/classifier');
const { sendAlertEmail } = require('../lib/email');
const { getBrandById } = require('../lib/brands');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get API key from header
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    // Look up editor by API key
    const { data: editor, error: editorError } = await supabase
      .from('editors')
      .select('*, brands(*)')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single();

    if (editorError || !editor) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const { tool, prompt } = req.body;

    if (!tool || !prompt) {
      return res.status(400).json({ error: 'Tool and prompt are required' });
    }

    const validTools = ['veo3', 'makeugc', 'elevenlabs', 'higgsfield'];
    if (!validTools.includes(tool.toLowerCase())) {
      return res.status(400).json({
        error: 'Invalid tool',
        validTools: validTools
      });
    }

    // Classify the content
    const classification = await classifyContent(prompt, editor.brand_id);

    const timestamp = new Date().toISOString();

    // Log the request
    const { data: request, error: requestError } = await supabase
      .from('requests')
      .insert({
        editor_id: editor.id,
        tool: tool.toLowerCase(),
        prompt: prompt,
        is_flagged: !classification.isOnBrand,
        flag_reason: classification.reason,
        detected_topic: classification.detectedTopic,
        confidence: classification.confidence
      })
      .select()
      .single();

    if (requestError) {
      console.error('Error logging request:', requestError);
    }

    // If flagged, send alert email
    if (!classification.isOnBrand) {
      const brand = getBrandById(editor.brand_id);

      // Log alert
      if (request) {
        await supabase
          .from('alerts')
          .insert({
            request_id: request.id,
            email_sent: true,
            sent_at: timestamp
          });
      }

      // Send email alert
      await sendAlertEmail({
        editor: { name: editor.name, email: editor.email },
        brand: brand,
        tool: tool,
        prompt: prompt,
        detectedTopic: classification.detectedTopic,
        reason: classification.reason,
        timestamp: timestamp
      });

      console.log(`🚨 FLAGGED: ${editor.name} attempted off-brand content for ${tool}`);
    }

    // Return response (request is allowed but logged)
    return res.status(200).json({
      success: true,
      message: 'Request logged successfully',
      editor: editor.name,
      brand: editor.brands?.name,
      tool: tool,
      flagged: !classification.isOnBrand,
      analysis: {
        isOnBrand: classification.isOnBrand,
        confidence: classification.confidence,
        detectedTopic: classification.detectedTopic
      },
      // Note: In production, you would forward to the actual AI tool API here
      // and return their response. For now, we just log and acknowledge.
      note: 'Request has been logged. In production, this would forward to the actual AI tool.'
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
