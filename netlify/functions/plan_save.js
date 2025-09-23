import { getClient } from './_supabase.mjs';

export default async (req,res)=>{
  const sb = getClient();
  const { email, items } = req.body?.payload||{};
  if (!sb || !email) return res.json({ok:true, storage:'none'});
  const row = { owner_email: email, items: items||{} };
  const { error } = await sb.from('weekly_plan').upsert(row, { onConflict: 'owner_email' });
  if (error) return res.status(500).json({ok:false,error:error.message});
  return res.json({ok:true});
}
