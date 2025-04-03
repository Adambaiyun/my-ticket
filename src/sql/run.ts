// run-sql.ts
import fs from 'fs';
import path from 'path';
import pool from '../db';

async function runSQLFile(filePath: string) {
  const fullPath = path.resolve(__dirname, filePath);
  const sql = fs.readFileSync(fullPath, 'utf-8');

  try {
    await pool.query(sql);
    console.log('SQL file executed successfully');
  } catch (err) {
    console.error('Error executing SQL file:', err);
  } finally {
    await pool.end();
  }
}

runSQLFile('./schema.sql');