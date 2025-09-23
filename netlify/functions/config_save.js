import { getClient } from './_supabase.mjs';

export default async (req, res) => {
  const payload = req.body?.payload || {};
  const sb = getClient();
  if (!sb) return res.json({ok:true, storage:'none'});
  const row = { id: 1, config: payload };
  const { error } = await sb.from('company_settings').upsert(row, { onConflict: 'id' });
  if (error) return res.status(500).json({ok:false, error:error.message});
  return res.json({ok:true});
}
