export function capitalize(val) {
    if (typeof val !== 'string') return '';
    return val.split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');
}

export function escapeRegex(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }