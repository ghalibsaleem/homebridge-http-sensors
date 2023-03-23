import axios from 'axios';

export async function getTextData(url:string) {
  try {
    const response = await axios.get(url);
    return parseFloat(response.data);
  } catch (error) {
    return 0;
  }
}

export async function getJsonData(url:string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return 0;
  }
}

