export async function beginPuller(funct_t, config) {
  setInterval(funct_t, config);
}