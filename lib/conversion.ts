export function convertCmToFt(cm:number) {
  // 1 centimeter equals roughly 0.0328084 feet
  const feet = cm * 0.0328084;
  
  // Rounds the result to 2 decimal places
  return Number(feet.toFixed(2));
}
