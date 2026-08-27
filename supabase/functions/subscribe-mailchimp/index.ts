import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export default {
  fetch: withSupabase({ auth: ["publishable"] }, async (req, ctx) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    try {
      const { email } = await req.json();

      if (!email) {
        return new Response(JSON.stringify({ error: 'Email is required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      // 1. Insert into Supabase (optional, but good for tracking)
      const { error: dbError } = await ctx.supabase.from('newsletter_subscribers').insert([
        { email, status: 'subscribed' }
      ]);
      if (dbError) {
        console.error('Supabase insert error:', dbError);
      }

      // 2. Add to Mailchimp
      const MAILCHIMP_API_KEY = Deno.env.get('MAILCHIMP_API_KEY');
      const MAILCHIMP_LIST_ID = Deno.env.get('MAILCHIMP_LIST_ID');
      const MAILCHIMP_DC = Deno.env.get('MAILCHIMP_DC'); // e.g., 'us1'

      if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_DC) {
        throw new Error('Mailchimp configuration missing');
      }

      const response = await fetch(`https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
        }),
      });

      const responseData = await response.json();

      if (!response.ok && responseData.title !== 'Member Exists') {
        throw new Error(responseData.detail || 'Error adding to Mailchimp');
      }

      return new Response(JSON.stringify({ success: true, message: 'Subscribed successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } catch (err: any) {
      console.error(err);
      return new Response(JSON.stringify({ error: err.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }),
};
