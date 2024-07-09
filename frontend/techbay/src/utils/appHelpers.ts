import { format } from 'date-fns';

export const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd-MMM-yyyy');
};

export const formatPrice = (price:number) => {
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
    const fileName = url.split('/').pop() || 'file';
    return new File([blob], fileName, { type: blob.type });
};
