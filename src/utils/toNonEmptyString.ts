export default function toNonEmptyString(value: any): string | null {
    if(value == null) {
        return null;
    }
    return value.toString().trim() || null;
}
