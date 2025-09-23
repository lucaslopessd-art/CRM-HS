import { getClient } from './_supabase.mjs';

export default async (req,res)=>{
  const sb = getClient();
  if (!sb) {
    // mock vazio
    return res.json({items:[]});
  }
  const { data, error } = await sb.from('deals').select('*').order('created_at',{ascending:false}).limit(200);
  if (error) return res.status(500).json({error:error.message});
  return res.json({items:data||[]});
}
