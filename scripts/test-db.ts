import connectToDatabase from '../src/lib/db';

async function main() {
  console.log('Attempting to connect to database...');
  try {
    const conn = await connectToDatabase();
    console.log('Successfully connected to database!');
    console.log('Connection state:', conn.readyState);
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

main();
