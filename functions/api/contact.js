export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, message } = body;

    if (!firstName || !lastName || !phone || !email) {
      return new Response(
        JSON.stringify({ error: 'All required fields must be filled out.' }),
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

    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

    const airtableResponse = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          'First Name': firstName,
          'Last Name': lastName,
          'Phone': phone,
          'Email': email,
          'Message': message || '',
          'Submitted At': new Date().toISOString()
        }
      })
    });

    if (!airtableResponse.ok) {
      const errText = await airtableResponse.text();
      console.error('Airtable error:', errText);
      return new Response(
        JSON.stringify({ error: 'Failed to submit. Please try again or call (919) 441-0934.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error('Contact form error:', err);
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
