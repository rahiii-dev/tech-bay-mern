export function capitalize(val) {
    if (typeof val !== 'string') return '';
    return val.split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');
}

export function escapeRegex(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function calculateDateAfterDays(days = 1) {
    const date = new Date()
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

export const formatPrice = (price) => {
    return price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}
