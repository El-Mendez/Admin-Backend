export default function toInt(value: any): number {
  if (typeof value === 'string') {
    return Number.parseInt(value, 10);
  } if (typeof value === 'number' && Number.isInteger(value)) {
    return Math.floor(value);
  }
  return NaN;
}
