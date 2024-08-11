import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Button } from '../ui/button';
import axios from '../../utils/axios';
import { USER_ORDER_INVOICE_DOWNLOAD_URL } from '../../utils/urls/userUrls';

type DownloadInvoiceProps = {
    orderID: string;
    orderNumber: string;
}
const DownloadInvoice = ({ orderID, orderNumber }: DownloadInvoiceProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await axios.get(USER_ORDER_INVOICE_DOWNLOAD_URL(orderID), {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderNumber}.pdf`); 
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={"link"} size={"sm"} className="p-0 h-max underline"
      onClick={handleDownload} 
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} /> : 'Download Invoice'}
    </Button>
  );
};


export default DownloadInvoice;
