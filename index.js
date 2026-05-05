export default {
  async fetch(request, env) {
    
    if (request.method !== 'POST') {
      return new Response('OK', { status: 200 });
    }

    try {
      const body = await request.json();
      
      const transcript = body.message?.transcript || 
                        'No transcript available';
                        
      const summary = body.message?.summary || 
                     'No summary available';

      const emailBody = `
NEW LEAD — STORM GUARD ROOFING

━━━━━━━━━━━━━━━━━━━

CALL SUMMARY:
${summary}

━━━━━━━━━━━━━━━━━━━

FULL TRANSCRIPT:
${transcript}

━━━━━━━━━━━━━━━━━━━

Powered by LeakProof — AppearAI
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'LeakProof <notifications@appearai.io>',
          to: ['hello@appearai.io'],
          subject: 'New Roofing Lead — Storm Guard',
          text: emailBody,
        }),
      });

      return new Response(
        JSON.stringify({ success: true }), 
        { status: 200 }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }), 
        { status: 500 }
      );
    }
  },
};
