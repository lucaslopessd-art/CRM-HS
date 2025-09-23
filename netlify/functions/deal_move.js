import { getClient } from './_supabase.mjs';

const order = ['OFFER','PROSPECT','VISIT','WIN'];
export default async (req,res)=>{
  const sb = getClient();
  const { id, dir } = req.body?.payload||{};
  if (!sb) return res.json({ok:true});
  const { data, error } = await sb.from('deals').select('id,stage').eq('id',id).single();
  if (error||!data) return res.status(404).json({ok:false});
  let i = order.indexOf(data.stage);
  if (dir==='prev') i = Math.max(0,i-1); else i = Math.min(order.length-1,i+1);
  const { error: e2 } = await sb.from('deals').update({stage: order[i]}).eq('id',id);
  if (e2) return res.status(500).json({ok:false,error:e2.message});
  return res.json({ok:true,stage:order[i]});
}
