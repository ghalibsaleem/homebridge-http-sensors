import Ajv from 'ajv';
import * as schema from '../config/schema.json';




const ajv = new Ajv();

export function validateConfig(input) {
  //import foo = require('ajv/lib/refs/json-schema-draft-04.json');
  //ajv.addMetaSchema(foo);
  const isValid = ajv.validate(schema, input);
  if (!isValid) {
    return undefined;
  }
  return true;
}