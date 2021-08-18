export default function toString(value: any): string | null {
    if(value == null) {
        return null;
    }
    return value.toString()
}
