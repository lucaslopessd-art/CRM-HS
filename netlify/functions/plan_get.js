import { getClient } from './_supabase.mjs';

export default async (req,res)=>{
  const sb = getClient();
  const email = req.body?.payload?.email || '';
  if (!sb || !email) return res.json({items:{}});
  const { data, error } = await sb.from('weekly_plan').select('items').eq('owner_email',email).single();
  if (error || !data) return res.json({items:{}});
  return res.json({items: data.items || {}});
}
