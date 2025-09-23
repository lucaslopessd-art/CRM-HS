import { getClient } from './_supabase.mjs';

export default async (req,res)=>{
  const sb = getClient();
  const p = req.body?.payload||{};
  const user = req.body?.user||null;
  const row = {
    title: p.title, value: p.value, stage:'OFFER',
    owner_email: user?.email || null
  };
  if (!sb) return res.json({ok:true, storage:'none'});
  const { error } = await sb.from('deals').insert(row);
  if (error) return res.status(500).json({ok:false,error:error.message});
  return res.json({ok:true});
}
