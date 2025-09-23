import { getClient } from './_supabase.mjs';

export default async (req,res)=>{
  const sb = getClient();
  const { id, reason } = req.body?.payload||{};
  if (!sb) return res.json({ok:true});
  const { error } = await sb.from('deals').update({stage:'LOST', lost_reason: reason||'outro'}).eq('id',id);
  if (error) return res.status(500).json({ok:false,error:error.message});
  return res.json({ok:true});
}
