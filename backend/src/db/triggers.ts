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

    await client.query(sql);

    console.log('Triggers and functions applied successfully');


    const dataSql = await fs.readFile('drizzle/0002-init-data.sql', 'utf8');
    await client.query(dataSql);
    console.log('Data applied successfully');

  } catch (err) {
    console.error('Error applying triggers:', err);
  } finally {
    await client.end();
  }
}

runTriggers();