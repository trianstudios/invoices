import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home";
import InvoiceView from "@/views/InvoiceView";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/invoices/:invoiceId",
        name: "InvoiceView",
        component: InvoiceView
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
