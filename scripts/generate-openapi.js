import { convert } from '@scalar/postman-to-openapi';  
import Collection from '../postman/collection.json' with {type: "json"}; 
import fs from 'fs'; 
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const yamlPath = path.join(__dirname, '../postman/openapi.yaml');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateYaml() {
  if (!fs.existsSync(yamlPath)) {
    process.stdout.write('⏳ Generating openapi.yaml');

    // Simulated loading animation
    for (let i = 0; i < 3; i++) {
      await sleep(400);
      process.stdout.write('.');
    }

    const openapi = await convert(JSON.stringify(Collection));
    const yamlOutput = typeof openapi === 'string' ? openapi : yaml.dump(openapi);

    fs.writeFileSync(yamlPath, yamlOutput, 'utf-8');
    console.log('\n✅ openapi.yaml created successfully.');
  } else {
    console.log('✅ openapi.yaml already exists. Skipping creation.');
  }
}

generateYaml();
