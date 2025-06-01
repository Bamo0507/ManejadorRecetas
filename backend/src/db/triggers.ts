import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import fs from 'fs/promises';
import 'dotenv/config';

async function runTriggers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const db = drizzle(client);

    const sql = await fs.readFile('drizzle/0001-init-triggers.sql', 'utf8');

    // Drizzle doesn't support multiple statements in a single `execute`, so use pg directly
    await client.query(sql);

    console.log('✅ Triggers and functions applied successfully');
  } catch (err) {
    console.error('❌ Error applying triggers:', err);
  } finally {
    await client.end();
  }
}

runTriggers();