import Ajv from 'ajv';
import * as schema from '../config/schema.json';



const ajv = new Ajv();

export function validateConfig(input) {
  const isValid = ajv.validate(schema, input);
  if (!isValid) {
    return undefined;
  }
  return true;
}