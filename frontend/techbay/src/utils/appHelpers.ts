import { format } from 'date-fns';

export const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), 'dd-MMM-yyyy');
};

export const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}

export function formatTime(ms: number) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const urlToFile = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileNameWithPrefix = url.split('/').pop() || 'file';
    const parts = fileNameWithPrefix.split('-');
    const filteredParts = parts.filter(part => isNaN(Number(part)));
    const fileName = filteredParts.join('-');
    return new File([blob], fileName, { type: blob.type });
};
