import httpClient from "@/services/api/httpClient";

const INVOICES_ENDPOINT = 'invoices';
const INVOICE_STORE_ENDPOINT = '/invoices/store';
const INVOICE_SHOW_ENDPOINT = '/invoices/show';
const INVOICE_UPDATE_ENDPOINT = '/invoices/update';
const INVOICE_DESTROY_ENDPOINT = '/invoices/destroy';

const fetchInvoices = async () => httpClient.get(INVOICES_ENDPOINT);

const fetchInvoice = async (invoiceId) => httpClient.get(INVOICE_SHOW_ENDPOINT, {
    params: {
        invoice: invoiceId
    }
});

const saveInvoice = async (data) => httpClient.put(INVOICE_STORE_ENDPOINT, {data});

const updateInvoice = async (data, invoiceId) => httpClient.patch(INVOICE_UPDATE_ENDPOINT, {data}, {
    params: {
        invoice: invoiceId
    }
});

const deleteInvoice = async (invoiceId) => httpClient.delete(INVOICE_DESTROY_ENDPOINT, {
    params: {
        invoice: invoiceId
    }
});

export {
    deleteInvoice,
    updateInvoice,
    fetchInvoices,
    fetchInvoice,
    saveInvoice,
}
