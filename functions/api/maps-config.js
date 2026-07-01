export async function onRequestGet(context) {
  const key = context.env.GOOGLE_MAPS_API_KEY;

  if (!key) {
    return new Response(
      JSON.stringify({ error: 'Google Maps is not configured.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({ key }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
