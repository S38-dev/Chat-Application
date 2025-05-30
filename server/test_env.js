const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '.env');

console.log(`Attempting to load .env from: ${envPath}`);

try {
  console.log('Checking if file exists...');
  if (fs.existsSync(envPath)) {
    console.log('.env file found.');
    console.log('Attempting to read file content...');
    const envFileContent = fs.readFileSync(envPath, { encoding: 'utf8', flag: 'r' });
    console.log('.env file content read successfully.');
    console.log('.env file content:\n', envFileContent);

    console.log('Attempting to parse file content...');
    const config = dotenv.parse(envFileContent);
    console.log('Parsed .env config:', config);

    console.log('Attempting to configure process.env...');
    dotenv.config({ path: envPath });
    console.log('dotenv.config() called.');

    console.log('process.env.DB_PASSWORD after config:', process.env.DB_PASSWORD);
    console.log('process.env.TEST_VAR after config:', process.env.TEST_VAR);

  } else {
    console.error(`.env file not found at: ${envPath}`);
  }

} catch (error) {
  console.error('Error during .env processing:', error);
  if (error.code === 'ENOENT') {
    console.error('Error details: The file was not found.');
  } else if (error.code === 'EACCES' || error.code === 'EPERM') {
    console.error('Error details: Permission denied to read the file.');
  } else {
    console.error('Error details:', error);
  }
}