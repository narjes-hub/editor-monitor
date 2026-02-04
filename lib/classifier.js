const Groq = require('groq-sdk');
const { getBrandById } = require('./brands');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function classifyContent(prompt, brandId) {
  const brand = getBrandById(brandId);

  if (!brand) {
    return { isOnBrand: false, reason: 'Unknown brand', confidence: 0 };
  }

  const systemPrompt = `You are a content compliance checker for a media company. Your job is to determine if content is appropriate for a specific brand.

BRAND: ${brand.name}
WEBSITE: ${brand.website}
PRODUCT: ${brand.description}
TARGET AUDIENCE: ${brand.target_audience}

VALID TOPICS FOR THIS BRAND:
${brand.valid_topics.join(', ')}

INVALID/OFF-BRAND EXAMPLES:
${brand.invalid_examples.join(', ')}

KEY INGREDIENTS (if relevant):
${brand.key_ingredients.join(', ')}

CONTENT STYLE:
${brand.content_style}

Your task: Analyze the submitted content and determine if it is ON-BRAND or OFF-BRAND.

ON-BRAND means: The content is related to the brand's product, target audience, and valid topics.
OFF-BRAND means: The content is unrelated to the brand, or is for a different product/industry entirely.

Respond in this exact JSON format:
{
  "isOnBrand": true/false,
  "confidence": 0-100,
  "detectedTopic": "brief description of what the content is about",
  "reason": "explanation of why this is on-brand or off-brand"
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please analyze this content:\n\n${prompt}` }
      ],
      temperature: 0.1,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content || '';

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        isOnBrand: result.isOnBrand === true,
        confidence: result.confidence || 50,
        detectedTopic: result.detectedTopic || 'Unknown',
        reason: result.reason || 'No reason provided'
      };
    }

    // Fallback if JSON parsing fails
    return {
      isOnBrand: true,
      confidence: 50,
      detectedTopic: 'Could not analyze',
      reason: 'Classification failed, allowing by default'
    };

  } catch (error) {
    console.error('Classification error:', error);
    // On error, allow the request but log it
    return {
      isOnBrand: true,
      confidence: 0,
      detectedTopic: 'Error during classification',
      reason: `Classification error: ${error.message}`
    };
  }
}

module.exports = { classifyContent };
