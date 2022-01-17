import {createStore} from 'vuex';
import {deleteInvoice, fetchInvoices, updateInvoice} from "@/services/invoices";

export default createStore({
    state: {
        invoiceData: [],
        invoiceModal: null,
        modalActive: null,
        invoicesLoaded: null,
        currentInvoiceArray: null,
        editInvoice: null,
    },
    mutations: {
        TOGGLE_INVOICE(state) {
            state.invoiceModal = !state.invoiceModal;
        },
        TOGGLE_MODAL(state) {
            state.modalActive = !state.modalActive;
        },
        SET_INVOICE_DATA(state, payload){
            state.invoiceData.push(payload);
        },
        INVOICES_LOADED(state){
            state.invoicesLoaded = true;
        },
        SET_CURRENT_INVOICE(state, payload){
            state.currentInvoiceArray = state.invoiceData.filter((stateInvoice) => {
                return stateInvoice.id = payload
            });
        },
        TOGGLE_EDIT_INVOICE(state){
            state.editInvoice = !state.editInvoice;
        },
        DELETE_INVOICE(state, payload){
            state.invoiceData = state.invoiceData.filter(stateInvoice => stateInvoice.id !== payload);
        },
        UPDATE_STATUS_TO_PAID(state, payload){
            state.invoiceData.forEach(invoice => {
               if(invoice.id === payload){
                   invoice.invoicePaid = true;
                   invoice.invoicePending = false;
               }
            });
        },
        UPDATE_STATUS_TO_PENDING(state, payload){
            state.invoiceData.forEach(invoice => {
                if(invoice.id === payload){
                    invoice.invoicePaid = false;
                    invoice.invoicePending = true
                    invoice.invoiceDraft = false;
                }
            });
        },
    },
    actions: {
        async GET_INVOICES({commit, state}) {

            const invoices = await fetchInvoices();

            if(invoices.data.length > 0) {

                invoices.data.forEach(invoice => {

                    if (!state.invoiceData.some(stateInvoice => stateInvoice.id === invoice.id)) {
                        commit("SET_INVOICE_DATA", invoice);
                    }

                });

                commit("INVOICES_LOADED");

            }
        },
        async UPDATE_INVOICE({commit, dispatch}, {invoiceId, routeId}){
            commit("DELETE_INVOICE", invoiceId);

            await dispatch("GET_INVOICES");

            commit("TOGGLE_INVOICE");

            commit("TOGGLE_EDIT_INVOICE");

            commit("SET_CURRENT_INVOICE", routeId);
        },
        async DELETE_INVOICE({commit}, invoiceId){
            await deleteInvoice(invoiceId);
            commit("DELETE_INVOICE", invoiceId);
        },
        async UPDATE_STATUS_TO_PAID({commit}, invoiceId){
            await updateInvoice({
                invoice_paid: true,
                invoice_pending: false
            }, invoiceId);
            commit("UPDATE_STATUS_TO_PAID", invoiceId)
        },
        async UPDATE_STATUS_TO_PENDING({commit}, invoiceId){
            await updateInvoice({
                invoice_paid: false,
                invoice_pending: true,
                invoice_draft: false,
            }, invoiceId);
            commit("UPDATE_STATUS_TO_PENDING", invoiceId)
        },
    },
    modules: {}
});
