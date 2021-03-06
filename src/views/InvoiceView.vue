<template>
    <div v-if="currentInvoice" class="invoice-view container">
        <router-link class="nav-link flex" :to="{ name: 'Home' }">
            <img src="@/assets/icon-arrow-left.svg" alt="" /> Go Back
        </router-link>
        <!-- Header -->
        <div class="header flex">
            <div class="left flex">
                <span>Status</span>
                <div
                        class="status-button flex"
                        :class="{
            paid: currentInvoice.invoicePaid,
            draft: currentInvoice.invoiceDraft,
            pending: currentInvoice.invoicePending,
          }"
                >
                    <span v-if="currentInvoice.invoicePaid">Paid</span>
                    <span v-if="currentInvoice.invoiceDraft">Draft</span>
                    <span v-if="currentInvoice.invoicePending">Pending</span>
                </div>
            </div>
            <div class="right flex">
                <button @click="toggleEditInvoice" class="dark-purple">Edit</button>
                <button @click="deleteInvoice(currentInvoice.docId)" class="red">Delete</button>
                <button @click="updateStatusToPaid(currentInvoice.docId)" v-if="currentInvoice.invoicePending" class="green">
                    Mark as Paid
                </button>
                <button
                        v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid"
                        @click="updateStatusToPending(currentInvoice.docId)"
                        class="orange"
                >
                    Mark as Pending
                </button>
            </div>
        </div>

        <!-- Invoice Details -->
        <div class="invoice-details flex flex-column">
            <div class="top flex">
                <div class="left flex flex-column">
                    <p><span>#</span>{{ currentInvoice.invoice_number }}</p>
                </div>
                <div class="right flex flex-column">
                    <h2>{{ currentInvoice.systemCompany.company_name }}</h2>
                    <br>
                    <p>{{ currentInvoice.systemCompany.street }}</p>
                    <p>{{ currentInvoice.systemCompany.city }}</p>
                    <p>{{ currentInvoice.systemCompany.zip_code }}</p>
                    <p>{{ currentInvoice.systemCompany.country }}</p>
                </div>
            </div>
            <div class="middle flex">
                <div class="payment flex flex-column">
                    <h4>Invoice Date</h4>
                    <p>
                        {{ currentInvoice.invoiceCreatedAt }}
                    </p>
                    <h4>Payment Date</h4>
                    <p>
                        {{ currentInvoice.invoiceDueDate }}
                    </p>
                </div>
                <div class="bill flex flex-column">
                    <h4>Bill To</h4>
                    <p>{{ currentInvoice.name }}</p>
                    <p>{{ currentInvoice.street }}</p>
                    <p>{{ currentInvoice.city }}</p>
                    <p>{{ currentInvoice.suburb }}</p>
                    <p>{{ currentInvoice.zip_code }}</p>
                    <p>{{ currentInvoice.country }}</p>
                </div>
                <div class="send-to flex flex-column">
                    <h4>Sent To</h4>
                    <p>{{ currentInvoice.email }}</p>
                </div>
            </div>
            <div class="bottom flex flex-column">
                <div class="billing-items">
                    <div class="heading flex">
                        <p>Description</p>
                        <p>taxed</p>
                        <p>Amount</p>
                    </div>
                    <div v-for="(item, index) in currentInvoice.invoice_details" :key="index" class="item flex">
                        <p>{{ item.itemDescription }}</p>
                        <p>{{ item.itemAmountTaxed }}</p>
                        <p>$ {{ item.itemAmount }}</p>
                    </div>
                </div>
                <div class="total flex">
                    <p>Amount Due</p>
                    <p>$ {{ currentInvoice.total_amount }}</p>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="invoice-view container">
        <h4>Oops! Something has gone wrong with the data display</h4>
        <p>Try clearing your browser and trying again!</p>
    </div>
</template>

<script>
    import { mapActions, mapMutations, mapState } from "vuex";
    export default {
        name: "invoiceView",
        data() {
            return {
                currentInvoice: null,
            };
        },
        created() {
            this.getCurrentInvoice();
        },
        methods: {
            ...mapMutations(["SET_CURRENT_INVOICE", "TOGGLE_EDIT_INVOICE", "TOGGLE_INVOICE"]),

            ...mapActions(["DELETE_INVOICE", "UPDATE_STATUS_TO_PENDING", "UPDATE_STATUS_TO_PAID"]),

            getCurrentInvoice() {
                this.SET_CURRENT_INVOICE(this.$route.params.invoiceId);
                this.currentInvoice = this.currentInvoiceArray[0];
            },

            toggleEditInvoice() {
                this.TOGGLE_EDIT_INVOICE();
                this.TOGGLE_INVOICE();
            },

            async deleteInvoice(invoiceId) {
                await this.DELETE_INVOICE(invoiceId);
                this.$router.push({ name: "Home" });
            },

            updateStatusToPaid(invoiceId) {
                this.UPDATE_STATUS_TO_PAID(invoiceId);
            },

            updateStatusToPending(invoiceId) {
                this.UPDATE_STATUS_TO_PENDING(invoiceId);
            },
        },
        computed: {
            ...mapState(["currentInvoiceArray", "editInvoice"]),
        },
        watch: {
            editInvoice() {
                if (!this.editInvoice) {
                    this.currentInvoice = this.currentInvoiceArray[0];
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .invoice-view {
        .nav-link {
            margin-bottom: 32px;
            align-items: center;
            color: #fff;
            font-size: 12px;
            img {
                margin-right: 16px;
                width: 7px;
                height: 10px;
            }
        }

        .header,
        .invoice-details {
            background-color: #1e2139;
            border-radius: 20px;
        }

        .header {
            align-items: center;
            padding: 24px 32px;
            font-size: 12px;

            .left {
                align-items: center;

                span {
                    color: #dfe3fa;
                    margin-right: 16px;
                }
            }

            .right {
                flex: 1;
                justify-content: flex-end;

                button {
                    color: #fff;
                }
            }
        }

        .invoice-details {
            padding: 48px;
            margin-top: 24px;

            .top {
                div {
                    color: #dfe3fa;
                    flex: 1;
                }

                .left {
                    font-size: 12px;
                    p:first-child {
                        font-size: 24px;
                        text-transform: uppercase;
                        color: #fff;
                        margin-bottom: 8px;
                    }

                    p:nth-child(2) {
                        font-size: 16px;
                    }

                    span {
                        color: #888eb0;
                    }
                }

                .right {
                    font-size: 12px;
                    align-items: flex-end;
                }
            }

            .middle {
                margin-top: 50px;
                color: #dfe3fa;
                gap: 16px;

                h4 {
                    font-size: 12px;
                    font-weight: 400;
                    margin-bottom: 12px;
                }

                p {
                    font-size: 16px;
                }

                .bill,
                .payment {
                    flex: 1;
                }

                .payment {
                    h4:nth-child(3) {
                        margin-top: 32px;
                    }

                    p {
                        font-weight: 600;
                    }
                }

                .bill {
                    p:nth-child(2) {
                        font-size: 16px;
                    }
                    p:nth-child(3) {
                        margin-top: auto;
                    }

                    p {
                        font-size: 12px;
                    }
                }

                .send-to {
                    flex: 2;
                }
            }

            .bottom {
                margin-top: 50px;

                .billing-items {
                    padding: 32px;
                    border-radius: 20px 20px 0 0;
                    background-color: #252945;

                    .heading {
                        color: #dfe3fa;
                        font-size: 12px;
                        margin-bottom: 32px;

                        p:first-child {
                            flex: 3;
                            text-align: left;
                        }

                        p {
                            flex: 1;
                            text-align: right;
                        }
                    }

                    .item {
                        margin-bottom: 32px;
                        font-size: 13px;
                        color: #fff;

                        &:last-child {
                            margin-bottom: 0;
                        }

                        p:first-child {
                            flex: 3;
                            text-align: left;
                        }

                        p {
                            flex: 1;
                            text-align: right;
                        }
                    }
                }

                .total {
                    color: #fff;
                    padding: 32px;
                    background-color: rgba(12, 14, 22, 0.7);
                    align-items: center;
                    border-radius: 0 0 20px 20px;

                    p {
                        flex: 1;
                        font-size: 12px;
                    }

                    p:nth-child(2) {
                        font-size: 28px;
                        text-align: right;
                    }
                }
            }
        }
    }
</style>
