import { getSupabase, isSupabaseConfigured } from './supabaseClient.js';
import { db } from './db.js';

export async function migrateDataToSupabase() {
  console.log('🚀 Starting Supabase Data Migration Utility...');

  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase is not configured in environment. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    return {
      success: false,
      reason: 'Supabase credentials not configured in environment',
    };
  }

  const supabase = getSupabase();
  const summary = {
    users: 0,
    volunteers: 0,
    requests: 0,
    schemes: 0,
    notifications: 0,
    feedback: 0,
    errors: [],
  };

  const collections = ['users', 'volunteers', 'requests', 'schemes', 'notifications', 'feedback'];

  for (const collection of collections) {
    try {
      const items = db.getCollection(collection);
      if (!items || items.length === 0) {
        console.log(`ℹ️ Collection '${collection}' has 0 items to migrate.`);
        continue;
      }

      console.log(`🔄 Migrating ${items.length} records into '${collection}'...`);
      const sanitizedItems = collection === 'notifications'
        ? items.map(({ updatedAt, ...rest }) => rest)
        : items;
      const { data, error } = await supabase.from(collection).upsert(sanitizedItems, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error migrating '${collection}':`, error.message);
        summary.errors.push({ collection, error: error.message });
      } else {
        summary[collection] = items.length;
        console.log(`✅ Successfully migrated ${items.length} records to '${collection}'!`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error on collection '${collection}':`, err.message);
      summary.errors.push({ collection, error: err.message });
    }
  }

  console.log('\n=============================================');
  console.log('MIGRATION SUMMARY:');
  console.log(JSON.stringify(summary, null, 2));
  console.log('=============================================\n');

  return {
    success: summary.errors.length === 0,
    summary,
  };
}

// Allow direct CLI execution: node server/src/database/migrateToSupabase.js
if (process.argv[1] && process.argv[1].endsWith('migrateToSupabase.js')) {
  migrateDataToSupabase()
    .then((res) => {
      if (!res.success) {
        process.exit(1);
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error('Fatal Migration Error:', err);
      process.exit(1);
    });
}
