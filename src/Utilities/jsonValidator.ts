import Ajv from 'ajv';
import { readFileSync } from 'fs';



const ajv = new Ajv();

export function validateConfig(input) {

  function readJsonFile(file) {
    const raw:string = readFileSync(file, 'utf8');
    return JSON.parse(raw);
  }

  const schema = readJsonFile('../config/schema.json');
  const isValid = ajv.validate(schema, input);
  if (!isValid) {
    return undefined;
  }
  return true;
}