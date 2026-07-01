function parseAirtableError(errText) {
  try {
    const data = JSON.parse(errText);
    if (data.error && data.error.message) return data.error.message;
  } catch (_) {
    /* ignore */
  }
  return null;
}

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

    const firstNameVal = String(firstName).trim();
    const lastNameVal = String(lastName).trim();
    const fullName = `${firstNameVal} ${lastNameVal}`.trim();
    const phoneVal = String(phone).trim();
    const emailVal = String(email).trim();
    const messageVal = message ? String(message).trim() : '';

    const generatedAt = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    });

    const fullSummaryLines = [
      'Pressure Washing Contact Form Lead:',
      '',
      `Name: ${fullName}`,
      `Phone: ${phoneVal}`,
      `Email: ${emailVal}`
    ];

    if (messageVal) {
      fullSummaryLines.push(`Message: ${messageVal}`);
    }

    fullSummaryLines.push(
      '',
      'Source: Website Contact Form',
      `Lead generated on: ${generatedAt} EST`
    );

    const fullSummary = fullSummaryLines.join('\n');

    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

    const fields = {
      'First Name': firstNameVal,
      'Last Name': lastNameVal,
      'Full Name': fullName,
      Phone: phoneVal,
      Email: emailVal,
      'Full Summary': fullSummary
    };

    const airtableResponse = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });

    if (!airtableResponse.ok) {
      const errText = await airtableResponse.text();
      console.error('Airtable contact error:', errText);

      const airtableMessage = parseAirtableError(errText);
      return new Response(
        JSON.stringify({
          error: airtableMessage || 'Failed to submit. Please try again or call (919) 441-0934.'
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders
    });
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
