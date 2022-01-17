<template>
    <div @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-column">
        <form @submit.prevent="submitForm" class="invoice-content">
            <Loading v-show="loading"/>
            <h1 v-if="!editInvoice">New Invoice</h1>
            <h1 v-else>Edit Invoice</h1>

            <!-- Bill From -->
            <div class="bill-from flex flex-column">
                <h4>Bill From</h4>
                <div class="input flex flex-column">
                    <label for="billerStreetAddress">Biller Street Address</label>
                    <input type="text" required id="billerStreetAddress" v-model="billerStreetAddress"/>
                </div>
                <div class="location-details flex">
                    <div class="input flex flex-column">
                        <label for="billerCity">Biller City</label>
                        <input type="text" required id="billerCity" v-model="billerCity"/>
                    </div>
                    <div class="input flex flex-column">
                        <label for="billerZipCode">Biller Zip Code</label>
                        <input type="text" required id="billerZipCode" v-model="billerZipCode"/>
                    </div>
                    <div class="input flex flex-column">
                        <label for="billerCountry">Biller Country</label>
                        <input type="text" required id="billerCountry" v-model="billerCountry"/>
                    </div>
                </div>
            </div>

            <!-- Bill To -->
            <div class="bill-to flex flex-column">
                <h4>Bill To</h4>
                <div class="input flex flex-column">
                    <label for="clientName">Client Name</label>
                    <input type="text" required id="clientName" v-model="clientName"/>
                </div>
                <div class="input flex flex-column">
                    <label for="clientEmail">Client Email</label>
                    <input type="email" required id="clientEmail" v-model="clientEmail"/>
                </div>
                <div class="input flex flex-column">
                    <label for="clientStreetAddress">Client Street Address</label>
                    <input type="text" required id="clientStreetAddress" v-model="clientStreetAddress"/>
                </div>
                <div class="location-details flex">
                    <div class="input flex flex-column">
                        <label for="clientCity">Client City</label>
                        <input type="text" required id="clientCity" v-model="clientCity"/>
                    </div>
                    <div class="input flex flex-column">
                        <label for="clientZipCode">Client Zip Code</label>
                        <input type="text" required id="clientZipCode" v-model="clientZipCode"/>
                    </div>
                    <div class="input flex flex-column">
                        <label for="clientCountry">Client Country</label>
                        <input type="text" required id="clientCountry" v-model="clientCountry"/>
                    </div>
                </div>
            </div>

            <!-- Invoice Work Details -->
            <div class="invoice-work flex flex-column">
                <div class="payment flex">
                    <div class="input flex flex-column">
                        <label for="invoiceDate">Invoice Date</label>
                        <input disabled type="text" required id="invoiceDate" v-model="invoiceDate"/>
                    </div>
                    <div class="input flex flex-column">
                        <label for="paymentDueDate">Payment Due Date</label>
                        <input disabled type="text" required id="paymentDueDate" v-model="paymentDueDate"/>
                    </div>
                </div>
                <div class="input flex flex-column">
                    <label for="paymentTerms">Payment Terms</label>
                    <select required id="paymentTerms" v-model="paymentTerms">
                        <option value="30">Net 30 Days</option>
                        <option value="60">Net 60 Days</option>
                    </select>
                </div>
                <div class="input flex flex-column">
                    <label for="productDescription">Product Description</label>
                    <input type="text" required id="productDescription" v-model="productDescription"/>
                </div>
                <div class="work-items">
                    <h3>Item List</h3>
                    <table class="item-list">
                        <tr class="table-heading flex">
                            <th class="item-name">Name</th>
                            <th class="quantity">Quantity</th>
                            <th class="price">Price</th>
                            <th class="total">Total</th>
                            <th class="delete-icon">Remove</th>
                        </tr>
                        <tr class="table-items flex" v-for="(item, index) in invoiceItemList" :key="index">
                            <td class="item-name">
                                <input type="text" v-model="item.itemName"/>
                            </td>
                            <td class="quantity">
                                <input type="number" v-model="item.quantity"/>
                            </td>
                            <td class="price">
                                <input type="text" v-model="item.price"/>
                            </td>
                            <td class="total">
                                ${{ (item.total = item.quantity * item.price) }}
                            </td>
                            <td class="delete-icon-container">
                                <div @click="deleteInvoiceItem(item.id)" class="delete-icon">
                                    <img src="@/assets/icon-delete.svg" alt="delete-icon"/>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div @click="addNewInvoiceItem" class="flex button">
                        <img src="@/assets/icon-plus.svg" alt="add-invoice-item"/>
                        Add New Items
                    </div>
                </div>
            </div>

            <!-- Save/Exit -->
            <div class="save flex">
                <div class="left">
                    <button @click="closeInvoice" type="button" class="red">Cancel</button>
                </div>
                <div class="right flex">
                    <button v-if="!editInvoice" @click="saveDraft" type="submit" class="dark-purple">Save Draft</button>
                    <button v-if="!editInvoice" @click="publishInvoice" type="submit" class="purple">Create Invoice
                    </button>
                    <button v-else @click="editInvoice" type="submit" class="purple">Update Invoice</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import Loading from "@/components/Loading";
    import {mapMutations, mapState, mapActions} from "vuex";
    import {uid} from "uid";
    import {saveInvoice, updateInvoice} from "@/services/invoices";

    export default {
        name: "InvoiceModal",
        data() {
            return {
                dateOptions: {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                },
                invoiceId: null,
                loading: null,
                billerStreetAddress: null,
                billerCity: null,
                billerZipCode: null,
                billerCountry: null,
                clientName: null,
                clientEmail: null,
                clientStreetAddress: null,
                clientCity: null,
                clientZipCode: null,
                clientCountry: null,
                invoiceDateUnix: null,
                invoiceDate: null,
                paymentTerms: null,
                paymentDueDateUnix: null,
                paymentDueDate: null,
                productDescription: null,
                invoicePending: null,
                invoiceDraft: null,
                invoiceItemList: [],
                invoiceTotal: 0,
            }
        },
        components: {
            Loading,
        },
        created() {
            if (!this.editInvoice) {
                this.invoiceDateUnix = Date.now();
                this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString("en-us", this.dateOptions);
            }

            if (this.editInvoice) {
                const currentInvoice = this.currentInvoiceArray[0];

                this.invoiceId = currentInvoice.id;
                this.billerStreetAddress = currentInvoice.billerStreetAddress;
                this.billerCity = currentInvoice.billerCity;
                this.billerZipCode = currentInvoice.billerZipCode;
                this.billerCountry = currentInvoice.billerCountry;
                this.clientName = currentInvoice.clientName;
                this.clientEmail = currentInvoice.clientEmail;
                this.clientStreetAddress = currentInvoice.clientStreetAddress;
                this.clientCity = currentInvoice.clientCity;
                this.clientZipCode = currentInvoice.clientZipCode;
                this.clientCountry = currentInvoice.clientCountry;
                this.invoiceDateUnix = currentInvoice.invoiceDateUnix;
                this.invoiceDate = currentInvoice.invoiceDate;
                this.paymentTerms = currentInvoice.paymentTerms;
                this.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
                this.paymentDueDate = currentInvoice.paymentDueDate;
                this.productDescription = currentInvoice.productDescription;
                this.invoicePending = currentInvoice.invoicePending;
                this.invoiceDraft = currentInvoice.invoiceDraft;
                this.invoiceItemList = currentInvoice.invoiceItemList;
                this.invoiceTotal = currentInvoice.invoiceTotal;
            }
        },
        methods: {
            ...mapMutations(["TOGGLE_INVOICE", "TOGGLE_MODAL", "TOGGLE_EDIT_INVOICE"]),
            ...mapActions(["UPDATE_INVOICE", "GET_INVOICES"]),
            checkClick(e) {
                if (e.target === this.$refs.invoiceWrap) {
                    this.TOGGLE_MODAL();
                }
            },
            closeInvoice() {
                this.TOGGLE_INVOICE();
                if (this.editInvoice) {
                    this.TOGGLE_EDIT_INVOICE();
                }
            },
            addNewInvoiceItem() {
                this.invoiceItemList.push({
                    id: uid(),
                    itemName: "",
                    quantity: "",
                    price: 0,
                    total: 0,
                })
            },
            deleteInvoiceItem(id) {
                this.invoiceItemList = this.invoiceItemList.filter(item => item.id !== id);
            },
            calcInvoiceTotal() {
                this.invoiceTotal = 0;
                this.invoiceItemList.forEach(item => {
                    this.invoiceTotal += item.total;
                })
            },
            publishInvoice() {
                this.invoicePending = true;
            },
            saveDraft() {
                this.invoiceDraft = true;
            },
            async saveInvoice() {
                if (this.invoiceItemList.length <= 0) {
                    alert("Please ensure you have filled out the work items!");
                    return;
                }

                this.loading = true;

                this.calcInvoiceTotal();

                const postData = JSON.stringify({
                    invoiceNumber: uid(6),
                    billerStreetAddress: this.billerStreetAddress,
                    billerCity: this.billerCity,
                    billerZipCode: this.billerZipCode,
                    billerCountry: this.billerCountry,

                    clientName: this.clientName,
                    clientEmail: this.clientEmail,
                    clientStreetAddress: this.clientStreetAddress,
                    clientCity: this.clientCity,
                    clientZipCode: this.clientZipCode,
                    clientCountry: this.clientCountry,

                    paymentTerms: this.paymentTerms,
                    paymentDueDate: this.paymentDueDate,
                    paymentDueDateUnix: this.paymentDueDateUnix,
                    productDescription: this.productDescription,
                    invoiceItemList: this.invoiceItemList,
                    invoiceTotal: this.invoiceTotal,

                    invoicePending: this.invoicePending,
                    invoiceDraft: this.invoiceDraft,
                    invoicePaid: null,
                });

                await saveInvoice(postData);

                this.TOGGLE_INVOICE();

            },
            async updateInvoice() {
                if (this.invoiceItemList.length <= 0) {
                    alert("Please ensure you have filled out the work items!");
                    return;
                }

                this.loading = true;

                this.calcInvoiceTotal();

                const postData = JSON.stringify({
                    billerStreetAddress: this.billerStreetAddress,
                    billerCity: this.billerCity,
                    billerZipCode: this.billerZipCode,
                    billerCountry: this.billerCountry,

                    clientName: this.clientName,
                    clientEmail: this.clientEmail,
                    clientStreetAddress: this.clientStreetAddress,
                    clientCity: this.clientCity,
                    clientZipCode: this.clientZipCode,
                    clientCountry: this.clientCountry,

                    paymentTerms: this.paymentTerms,
                    paymentDueDate: this.paymentDueDate,
                    paymentDueDateUnix: this.paymentDueDateUnix,
                    productDescription: this.productDescription,
                    invoiceItemList: this.invoiceItemList,
                    invoiceTotal: this.invoiceTotal,
                });

                await updateInvoice(postData, this.currentInvoice.id);

                this.loading = false;

                const data = {
                    invoiceId: this.invoiceId,
                    routeId: this.$route.params.invoiceId
                };

                this.UPDATE_INVOICE(data);

                this.GET_INVOICES();

            },
            submitForm() {
                if (this.editInvoice) {
                    this.updateInvoice();
                    return;
                }
                this.saveInvoice();
            }
        },
        computed: {
            ...mapState(["editInvoice", "currentInvoiceArray"]),
        },
        watch: {
            paymentTerms() {
                const futureDate = new Date();
                this.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.paymentTerms));
                this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString("en-us", this.dateOptions);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .invoice-wrap {
        position: fixed;
        top: 0;
        left: 0;
        background-color: transparent;
        width: 100%;
        height: 100vh;
        overflow: scroll;

        &::-webkit-scrollbar {
            display: none;
        }

        @media (min-width: 900px) {
            left: 90px;
        }

        .invoice-content {
            position: relative;
            padding: 56px;
            max-width: 700px;
            width: 100%;
            background-color: var(--background);
            color: var(--white);
            box-shadow: var(--darker-box-shadow);

            h1 {
                margin-bottom: 48px;
                color: var(--white);
            }

            h3 {
                margin-bottom: 16px;
                font-size: 18px;
                color: var(--gray);
            }

            h4 {
                color: var(--light-purple);
                font-size: 12px;
                margin-bottom: 24px;
            }

            // Bill to / Bill from
            .bill-to, .bill-from {
                margin-bottom: 48px;

                .location-details {
                    gap: 16px;

                    div {
                        flex: 1;
                    }
                }
            }

            // Invoice work
            .invoice-work {
                .payment {
                    gap: 24px;

                    div {
                        flex: 1;
                    }
                }

                .work-items {
                    .item-list {
                        width: 100%;

                        // Item Table Styling
                        .table-heading, .table-items {
                            gap: 16px;
                            font-size: 12px;

                            .item-name {
                                flex-basis: 45%;
                            }

                            .quantity {
                                flex-basis: 15%;
                            }

                            .price {
                                flex-basis: 15%;
                            }

                            .total {
                                flex-basis: 15%;
                                align-self: center;
                                text-align: center;
                            }

                            .delete-icon-container {
                                flex-basis: 10%;
                                align-self: center;
                                text-align: center;
                            }
                        }

                        .table-heading {
                            margin-bottom: 16px;

                            th {
                                text-align: left;

                                &:last-child {
                                    text-align: center;
                                }
                            }
                        }

                        .table-items {
                            position: relative;
                            margin-bottom: 24px;

                            .delete-icon {
                                transition: .3s ease-in-out;
                                width: 40px;
                                height: 40px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                margin: 0 auto;

                                &:hover {
                                    background-color: var(--dark-purple);
                                    border-radius: 50%;
                                }

                                img {
                                    width: 12px;
                                    height: 16px;
                                }

                            }
                        }
                    }

                    .button {
                        color: var(--white);
                        background-color: var(--dark-purple);
                        align-items: center;
                        justify-content: center;
                        width: 100%;

                        img {
                            margin-right: 10px;
                        }
                    }
                }
            }

            .save {
                margin-top: 60px;

                div {
                    flex: 1;
                }

                .right {
                    justify-content: flex-end;
                }
            }
        }

        .input {
            margin-bottom: 20px;
        }

        label {
            font-size: 12px;
            margin-bottom: 6px;
        }

        input, select {
            width: 100%;
            background-color: var(--darker-purple);
            color: var(--white);
            border-radius: 4px;
            padding: 12px 11px;
            border: none;

            &:focus {
                outline: none;
            }
        }
    }
</style>
