# Mini Inventory - Supabase Static Export

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run Supabase schema migration:
- Buka Supabase SQL Editor
- Jalankan query dari file `supabase-schema.sql`

4. Build for production:
```bash
npm run export
```

5. Upload hasil build ke cPanel:
- Folder `dist/` berisi file hasil build
- Upload semua isi folder `dist/` ke `public_html/` di cPanel

## Database Schema (supabase-schema.sql)

Jalankan file `supabase-schema.sql` di Supabase SQL Editor untuk membuat tabel `products`.

## Catatan untuk cPanel Static Hosting

- Gunakan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public key)
- Untuk keamanan lebih baik, buat RLS Policy di Supabase
- File hasil build di folder `dist/` bisa diupload langsung ke public_html