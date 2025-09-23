import { getClient } from './_supabase.mjs';

export default async (req,res)=>{
  const sb = getClient();
  if (!sb) return res.json({totalCommission:0,futureToReceive:0});
  const { data, error } = await sb.from('commissions').select('amount,status');
  if (error) return res.status(500).json({error:error.message});
  let total=0, future=0;
  for(const r of data){
    total += Number(r.amount||0);
    if (r.status==='FUTURE') future += Number(r.amount||0);
  }
  return res.json({totalCommission:total,futureToReceive:future});
}
