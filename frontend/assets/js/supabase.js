// frontend/assets/js/supabase.js
// Supabase connection + helper functions

const SUPABASE_URL = 'https://cqwotasxfmfhplqnemgw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxd290YXN4Zm1maHBscW5lbWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMDgyNjMsImV4cCI6MjA4MDg4NDI2M30.POzJGiss5WrmGFtfU18AA39UqPZLU12uMCFZQcA76ys';

async function sbGet(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  return res.json();
}

async function sbInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function sbUpdate(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function sbDelete(table, id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  return res.ok;
}

async function sbUpload(file, bucket = 'media', folder = '') {
  // Generate unique filename
  const ext = file.name.split('.').pop();
  const name = Date.now() + '-' + Math.random().toString(36).substring(2, 9) + '.' + ext;
  const path = folder ? `${folder}/${name}` : name;

  // Upload to Supabase Storage
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': file.type,
      'x-upsert': 'true'
    },
    body: file
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error('Upload failed: ' + err);
  }

  // Return public URL
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

async function sbDeleteFile(url, bucket = 'media') {
  // Extract path from URL
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return false;
  const path = url.substring(idx + marker.length);

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  return res.ok;
}

window.sb = {
  get: sbGet,
  insert: sbInsert,
  update: sbUpdate,
  delete: sbDelete,
  upload: sbUpload,
  deleteFile: sbDeleteFile
};