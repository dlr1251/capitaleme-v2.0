import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/middleware/auth.js';

export const POST: APIRoute = requireAuth(async (context, user) => {
  try {
    const body = await context.request.json();
    const { title } = body || {};

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Missing or invalid title' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'XAI API key not configured on server' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = 'You are an expert Colombian legal writer producing rigorous, didactic, elegant English prose grounded in Colombian law. Always return only valid Markdown for the content body.';

    const userPrompt = `I’m building a long-term legal knowledge repository in English about Colombian Law, aimed at:

- Foreigners (expats, investors, digital nomads) living or doing business in Colombia
- Colombian lawyers and law students studying or explaining law in English
- Myself, as a lawyer, to deepen and organize my understanding for publication, education, and consulting

Please generate a complete legal article or entry in English, based on Colombian law, on the title of the article topic.

Follow this exact format, tone, and style:

I. Legal Definition
Provide a precise but elegant definition, grounded in Colombian law. Use formal but expressive language. Make it clear and give at least two definitions so it can be more didactic.

II. Legal Framework
List in detail and describe the relevant Colombian laws, resolutions, decrees, codes, constitutional articles and jurisprudence that govern this particular institution. With links to their official source. Make a table.

III. Core Legal Elements
Break down the internal structure of the concept (e.g., elements of a contract, requirements for a divorce, criteria for tax residency, etc.) and explain in detail each in a subsection explaining why is it relevant. Use a numbered list or short subsections.

IV. Doctrinal Note
Explain ways to categorize this institution and/or its core legal elements.
Develop a thoughtful, deep reflection divided into:
- Juridical Principles (Why does this rule exist from the general law theory?)
- Interpretive or Practical Tensions (What makes its application complex or controversial?)
- Social Insights (What does this reveal about Colombian law or society?)
Use an elegant, essay-like tone, similar to the best Colombian legal thinkers (e.g., Valencia Zea, Devis Echandía, Carnelutti, Couture). Don’t fear subtlety or philosophical depth — but stay anchored to Colombian context, with subtle and witty references to international analogue concepts.

V. Examples
Give a clear and realistic example — preferably involving an expat or a foreign business — that shows the rule in action. Then, a common example, and then a special or extraordinary example.

VI. FAQ Section
Include 7 common questions that users might ask about this topic, with direct and clear answers (but still technically precise).

VII. Glossary Terms (if applicable)
Define 4–8 key terms (in English, translated from Spanish).

VIII. Translation & commentaries
Include a final analytical section dedicated to the translation and conceptual challenges of rendering this Colombian legal institution in English. Break it down as follows:
A. Terminological Dissonance
B. Comparative Legal Mapping
C. Pragmatic Translation Choices
D. Translational Insight

IX. Fun Facts and Curiosities
Search and include 7 fun facts and curious stories about this topic, that are real and not very wide known to the public.

Style & Constraints
- The article must be written in English but based 100% on Colombian law.
- Do not translate literally — instead, express the Colombian institution faithfully in legal English.
- Tone must be precise, didactic, elegant, and reflective.
- Include citations to laws, if copy-paste raw legal text, explain it and show the translation challenges and choices.
- Assume your audience is intelligent but not necessarily familiar with Colombian law.
- Avoid robotic tone or shallow summaries — this is a serious legal journal, not a blog.

Generate a complete entry on "${title}" in Colombia, following the format above.

Start writing the title and use the h1, h2 and h3 rigorously.

Write only the article, generate a markdown file. If using links for references, embed them in md.`;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-2-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      let errorText: any = null;
      try {
        errorText = await response.text();
      } catch {}
      return new Response(
        JSON.stringify({ error: `xAI error: ${response.status} ${response.statusText}`, detail: errorText }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const markdown = data?.choices?.[0]?.message?.content || '';

    if (!markdown) {
      return new Response(JSON.stringify({ error: 'Empty response from xAI' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ markdown }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});


