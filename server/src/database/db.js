import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';
import { getSeedData } from './seedData.js';
import { getSupabase, isSupabaseConfigured } from './supabaseClient.js';

let writeLock = Promise.resolve();

class JsonDatabase {
  constructor() {
    this.dbPath = env.DB_FILE;
    this.backupPath = env.BACKUP_FILE;
    this.dataDir = env.DATA_DIR;
    this.ensureInitialized();
  }

  ensureInitialized() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    if (!fs.existsSync(this.dbPath)) {
      console.log('📦 Database file not found. Initializing with seed data...');
      const seed = getSeedData();
      this.writeSync(seed);
      // Also write initial backup
      try {
        fs.writeFileSync(this.backupPath, JSON.stringify(seed, null, 2), 'utf8');
      } catch (err) {
        console.error('Failed to create initial backup:', err.message);
      }
      console.log(`✅ Database initialized at ${this.dbPath}`);
    }
  }

  readSync() {
    try {
      const content = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading database file:', error.message);
      // If corrupted, try restoring from backup
      if (fs.existsSync(this.backupPath)) {
        console.warn('⚠️ Restoring corrupted database from backup...');
        const backup = fs.readFileSync(this.backupPath, 'utf8');
        fs.writeFileSync(this.dbPath, backup, 'utf8');
        return JSON.parse(backup);
      }
      throw error;
    }
  }

  writeSync(data) {
    data.meta = {
      ...data.meta,
      lastUpdated: new Date().toISOString(),
    };
    const content = JSON.stringify(data, null, 2);
    const tempPath = `${this.dbPath}.${Date.now()}.tmp`;

    // Atomic write: write to temp file then rename
    fs.writeFileSync(tempPath, content, 'utf8');
    fs.renameSync(tempPath, this.dbPath);
  }

  async writeAtomic(data) {
    const executeWrite = async () => {
      data.meta = {
        ...data.meta,
        lastUpdated: new Date().toISOString(),
      };
      const content = JSON.stringify(data, null, 2);
      const tempPath = `${this.dbPath}.${Date.now()}-${Math.random().toString(36).substring(7)}.tmp`;

      await fs.promises.writeFile(tempPath, content, 'utf8');
      await fs.promises.rename(tempPath, this.dbPath);

      // Periodically or safely create backup
      try {
        await fs.promises.writeFile(this.backupPath, content, 'utf8');
      } catch (err) {
        // non-blocking
      }
    };

    writeLock = writeLock.then(executeWrite, executeWrite);
    return writeLock;
  }

  isUsingSupabase() {
    return Boolean(env.USE_SUPABASE && isSupabaseConfigured());
  }

  getLastOperation() {
    return this.lastOperation || { destination: 'local_json', status: 'ready' };
  }

  // --- Collection Query Helpers ---

  getCollection(collectionName) {
    const db = this.readSync();
    return db[collectionName] || [];
  }

  findById(collectionName, id) {
    const items = this.getCollection(collectionName);
    return items.find((item) => String(item.id) === String(id)) || null;
  }

  findOne(collectionName, predicate) {
    const items = this.getCollection(collectionName);
    return items.find(predicate) || null;
  }

  find(collectionName, filterFn = () => true) {
    const items = this.getCollection(collectionName);
    return items.filter(filterFn);
  }

  async insert(collectionName, item) {
    let supabaseSuccess = false;
    let supabaseErrorMsg = null;

    // 1. Supabase insert if enabled
    if (this.isUsingSupabase()) {
      try {
        const supabase = getSupabase();
        const { error } = await supabase.from(collectionName).insert(item);
        if (error) {
          supabaseErrorMsg = error.message;
          console.warn(`[Database] Supabase insert to '${collectionName}' failed: ${error.message}. Storing in local JSON.`);
        } else {
          supabaseSuccess = true;
          console.log(`[Database] Successfully wrote record '${item.id || ''}' to Supabase '${collectionName}'!`);
        }
      } catch (err) {
        supabaseErrorMsg = err.message;
        console.warn(`[Database] Supabase insert exception: ${err.message}. Storing in local JSON.`);
      }
    }

    this.lastOperation = {
      action: 'insert',
      collection: collectionName,
      destination: supabaseSuccess ? 'supabase' : 'local_json',
      supabaseError: supabaseErrorMsg,
      timestamp: new Date().toISOString(),
    };

    // 2. Synchronize to local atomic persistence
    const db = this.readSync();
    if (!db[collectionName]) {
      db[collectionName] = [];
    }
    db[collectionName].unshift(item);
    await this.writeAtomic(db);
    return item;
  }

  async updateById(collectionName, id, updates) {
    let supabaseSuccess = false;
    let supabaseErrorMsg = null;

    // 1. Supabase update if enabled
    if (this.isUsingSupabase()) {
      try {
        const supabase = getSupabase();
        const updatePayload = collectionName === 'notifications' 
          ? { ...updates } 
          : { ...updates, updatedAt: new Date().toISOString() };

        const { error } = await supabase
          .from(collectionName)
          .update(updatePayload)
          .eq('id', id);
        if (error) {
          supabaseErrorMsg = error.message;
          console.warn(`[Database] Supabase update '${collectionName}' id ${id} failed: ${error.message}. Updating in local JSON.`);
        } else {
          supabaseSuccess = true;
          console.log(`[Database] Successfully updated record '${id}' in Supabase '${collectionName}'!`);
        }
      } catch (err) {
        supabaseErrorMsg = err.message;
        console.warn(`[Database] Supabase update exception: ${err.message}. Updating in local JSON.`);
      }
    }

    this.lastOperation = {
      action: 'update',
      collection: collectionName,
      id,
      destination: supabaseSuccess ? 'supabase' : 'local_json',
      supabaseError: supabaseErrorMsg,
      timestamp: new Date().toISOString(),
    };

    // 2. Synchronize to local atomic persistence
    const db = this.readSync();
    if (!db[collectionName]) return null;

    const index = db[collectionName].findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;

    const updatedItem = {
      ...db[collectionName][index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    db[collectionName][index] = updatedItem;
    await this.writeAtomic(db);
    return updatedItem;
  }

  async deleteById(collectionName, id) {
    let supabaseSuccess = false;
    let supabaseErrorMsg = null;

    // 1. Supabase delete if enabled
    if (this.isUsingSupabase()) {
      try {
        const supabase = getSupabase();
        const { error } = await supabase.from(collectionName).delete().eq('id', id);
        if (error) {
          supabaseErrorMsg = error.message;
          console.warn(`[Database] Supabase delete '${collectionName}' id ${id} failed: ${error.message}. Deleting in local JSON.`);
        } else {
          supabaseSuccess = true;
          console.log(`[Database] Successfully deleted record '${id}' in Supabase '${collectionName}'!`);
        }
      } catch (err) {
        supabaseErrorMsg = err.message;
        console.warn(`[Database] Supabase delete exception: ${err.message}. Deleting in local JSON.`);
      }
    }

    this.lastOperation = {
      action: 'delete',
      collection: collectionName,
      id,
      destination: supabaseSuccess ? 'supabase' : 'local_json',
      supabaseError: supabaseErrorMsg,
      timestamp: new Date().toISOString(),
    };

    // 2. Synchronize to local atomic persistence
    const db = this.readSync();
    if (!db[collectionName]) return false;

    const initialLength = db[collectionName].length;
    db[collectionName] = db[collectionName].filter((item) => String(item.id) !== String(id));
    if (db[collectionName].length !== initialLength) {
      await this.writeAtomic(db);
      return true;
    }
    return false;
  }

  async reset() {
    const seed = getSeedData();

    // 1. Supabase reset if enabled
    if (this.isUsingSupabase()) {
      try {
        const supabase = getSupabase();
        const collections = ['users', 'volunteers', 'requests', 'schemes', 'notifications', 'feedback'];
        for (const col of collections) {
          if (seed[col] && seed[col].length > 0) {
            await supabase.from(col).upsert(seed[col], { onConflict: 'id' });
          }
        }
      } catch (err) {
        console.warn(`[Supabase] Reset notice:`, err.message);
      }
    }

    await this.writeAtomic(seed);
    return seed;
  }

  async syncFromSupabase() {
    if (!this.isUsingSupabase()) return;
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const collections = ['users', 'volunteers', 'requests', 'schemes', 'notifications', 'feedback'];
      const current = this.readSync();
      let updated = false;

      for (const col of collections) {
        const { data, error } = await supabase.from(col).select('*');
        if (!error && Array.isArray(data)) {
          current[col] = data;
          updated = true;
        }
      }

      if (updated) {
        await this.writeAtomic(current);
        console.log('🔄 [Database] Synchronized live data from Supabase into local cache.');
      }
    } catch (err) {
      console.warn('⚠️ [Database] Failed to sync from Supabase:', err.message);
    }
  }
}

export const db = new JsonDatabase();
