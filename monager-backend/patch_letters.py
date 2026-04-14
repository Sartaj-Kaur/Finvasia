from database import supabase
from utils import format_uid
import uuid

user_id = format_uid('FQBTsYRCaWQILokaLeZA8VyWNmE2')

# 1. Move any April letters to March
res = supabase.table('twin_letters').select('*').eq('user_id', user_id).execute()
for l in res.data:
    if l['month'] == 4:
        supabase.table('twin_letters').update({'month': 3}).eq('id', l['id']).execute()

# 2. Insert a February letter to ensure plural history
supabase.table('twin_letters').insert({
    'id': str(uuid.uuid4()),
    'user_id': user_id,
    'content': "February was an incredible month of solid foundation building. Your diligence in logging your lifestyle expenses enabled Monager to capture a major allocation surplus. Keep the momentum going! \n\nWe saw an intense spike in transit costs early in the month, but it smoothed out nicely towards the end.",
    'month': 2,
    'year': 2026
}).execute()

print('Patched letters successfully!')
