import { getClient } from './_supabase.mjs';

export default async (req,res)=>{
  const sb = getClient();
  if (!sb) return res.json({funnel:{}, avg:0});
  const { data, error } = await sb.from('deals').select('stage,value');
  if (error) return res.status(500).json({error:error.message});
  const funnel = {};
  let sum = 0, cnt = 0;
  for (const d of data){
    funnel[d.stage] = (funnel[d.stage]||0)+1;
    if (d.stage==='WIN'){ sum+=Number(d.value||0); cnt++; }
  }
  return res.json({funnel, avg: cnt? (sum/cnt): 0});
}
