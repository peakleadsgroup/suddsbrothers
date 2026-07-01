export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      street,
      city,
      state,
      zip,
      authorizedDecisionMaker
    } = body;

    if (!name || !email || !phone || !street || !city || !state || !zip) {
      return new Response(
        JSON.stringify({ error: 'Please complete all required fields.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (authorizedDecisionMaker !== 'yes') {
      return new Response(
        JSON.stringify({ error: 'We can only work on the property if you\'re authorized to make decisions.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const token = env.AIRTABLE_TOKEN;
    const baseId = env.AIRTABLE_BASE_ID;
    const tableName = env.AIRTABLE_TABLE_NAME;

    if (!token || !baseId || !tableName) {
      return new Response(
        JSON.stringify({ error: 'Form is not configured. Please call (919) 441-0934.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const nameParts = String(name).trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const fullAddress = `${street}, ${city}, ${state} ${zip}`;

    const message = [
      'Source: Lander Quiz',
      `Authorized Decision Maker: Yes`,
      `Address: ${fullAddress}`
    ].join('\n');

    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

    const airtableResponse = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          'First Name': firstName,
          'Last Name': lastName,
          Phone: phone,
          Email: email,
          Message: message,
          'Submitted At': new Date().toISOString()
        }
      })
    });

    if (!airtableResponse.ok) {
      const errText = await airtableResponse.text();
      console.error('Airtable lander error:', errText);
      return new Response(
        JSON.stringify({ error: 'Failed to submit. Please try again or call (919) 441-0934.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error('Lander form error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please call (919) 441-0934.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
