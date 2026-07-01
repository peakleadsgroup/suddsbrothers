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
    const {
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      zip,
      authorizedDecisionMaker
    } = body;

    if (!firstName || !lastName || !email || !phone || !street || !city || !state || !zip) {
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

    const firstNameVal = String(firstName).trim();
    const lastNameVal = String(lastName).trim();
    const fullName = `${firstNameVal} ${lastNameVal}`.trim();
    const streetVal = String(street).trim();
    const cityVal = String(city).trim();
    const stateVal = String(state).trim();
    const zipVal = String(zip).trim();
    const zipNumber = parseInt(zipVal, 10);

    if (!Number.isFinite(zipNumber)) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid zip code.' }),
        { status: 400, headers: corsHeaders }
      );
    }

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

    const fullSummary = [
      'Pressure Washing Quote Lead Information:',
      '',
      `Name: ${fullName}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      'Authorized Decision Maker: Yes',
      '',
      'Address:',
      streetVal,
      `${cityVal}, ${stateVal} ${zipVal}`,
      '',
      'Source: Lander Quiz',
      `Lead generated on: ${generatedAt} EST`
    ].join('\n');

    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

    const fields = {
      'First Name': firstNameVal,
      'Last Name': lastNameVal,
      'Full Name': fullName,
      Phone: String(phone).trim(),
      Email: String(email).trim(),
      Street: streetVal,
      City: cityVal,
      State: stateVal,
      Zip: zipNumber,
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
      console.error('Airtable lander error:', errText);

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
