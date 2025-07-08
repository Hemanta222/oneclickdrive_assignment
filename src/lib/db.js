import sqlite from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'


export async function getDb() {
    let dbInstance = null;

    if (dbInstance) return dbInstance;

    const dbPath = path.join(process.cwd(), 'db.sqlite')
    dbInstance = await open({ filename: dbPath, driver: sqlite.Database })

    await dbInstance.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);');
    
    await dbInstance.exec('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, brand TEXT NOT NULL, model TEXT NOT NULL, year INTEGER NOT NULL, price REAL NOT NULL, mileage REAL NOT NULL, currency TEXT NOT NULL, condition TEXT NOT NULL, status TEXT NOT NULL, post_date TEXT);');

    return dbInstance;
}