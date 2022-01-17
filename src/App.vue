<template>
    <div v-if="invoicesLoaded">
        <div v-if="!mobile" class="app flex flex-column">
            <Navigation />
            <div class="app-content flex flex-column">
                <Modal v-if="modalActive" />
                <transition name="invoice">
                    <InvoiceModal v-if="invoiceModal" />
                </transition>
                <router-view />
            </div>
        </div>
        <div v-else class="mobile-message flex flex-column">
            <h2>Sorry, this app is not supported on small mobile devices</h2>
            <p>To use this app please use a desktop, laptop, or tablet</p>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from "vuex";
    import Navigation from "@/components/Navigation";
    import InvoiceModal from "@/components/InvoiceModal";
    import Modal from "@/components/Modal";
    export default {
        name: 'App',
        data(){
            return {
                mobile: null
            }
        },
        components: {
            Navigation,
            InvoiceModal,
            Modal,
        },
        created(){
            this.GET_INVOICES();
            this.checkScreenSizes();
            window.addEventListener("resize", this.checkScreenSizes)
        },
        methods: {

            ...mapActions(["GET_INVOICES"]),

            checkScreenSizes(){
                const windowWidth = window.innerWidth;
                if(windowWidth <= 750){
                    this.mobile = true;
                    return;
                }
                this.mobile = false
            }
        },
        computed: {
            ...mapState(["invoiceModal", "modalActive", "invoicesLoaded"])
        }
    }
</script>

<style lang="scss">
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

    :root{
        --white: #ffffff;
        --dirty-white: #dfe3fa;
        --dark-gray: rgba(223, 227, 250, 0.1);
        --gray: #777f98;
        --background: #141625;
        --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --darker-box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --darker-purple: #1e2139;
        --dark-purple: #252945;
        --red: #ec5757;
        --light-purple: #7c5dfa;
        --light-green: #33d69f;
        --dirty-green: rgba(51, 214, 160, 0.1);
        --orange: #ff8f00;
        --dirty-orange: rgba(255, 145, 0, 0.1);;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Poppins", sans-serif;
    }

    .app {
        background-color: var(--background);
        min-height: 100vh;
        @media (min-width: 900px) {
            flex-direction: row !important;
        }

        .app-content {
            padding: 0 20px;
            flex: 1;
            position: relative;
        }
    }

    .mobile-message {
        text-align: center;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: var(--background);
        color: var(--white);

        p {
            margin-top: 16px;
        }
    }

    // animated invoice

    .invoice-enter-active,
    .invoice-leave-active {
        transition: 0.8s ease all;
    }

    .invoice-enter-from,
    .invoice-leave-to {
        transform: translateX(-700px);
    }

    button,
    .button {
        cursor: pointer;
        padding: 16px 24px;
        border-radius: 30px;
        border: none;
        font-size: 12px;
        margin-right: 8px;
        color: var(--white);
    }

    .dark-purple {
        background-color: var(--dark-purple);
    }

    .red {
        background-color: var(--red);
    }

    .purple {
        background-color: var(--light-purple);
    }

    .green {
        background-color: var(--light-green);
    }

    .orange {
        background-color: var(--orange);
    }

    // utility classes

    .flex {
        display: flex;
    }

    .flex-column {
        flex-direction: column;
    }

    .container {
        width: 100%;
        padding: 40px 10px;
        max-width: 850px;
        margin: 0 auto;

        @media (min-width: 900px) {
            padding-top: 72px;
        }
    }

    .nav-link {
        text-decoration: none;
        color: initial;
    }

    // Status Button Styling

    .status-button {
        &::before {
            content: "";
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }

        font-size: 12px;
        margin-right: 30px;
        align-items: center;
        padding: 8px 30px;
        border-radius: 10px;
    }

    .paid {
        &::before {
            background-color: var(--light-green);
        }

        color: var(--light-green);
        background-color: var(--dirty-green);
    }

    .pending {
        &::before {
            background-color: var(--orange);
        }

        color: var(--orange);
        background-color: var(--dirty-orange);
    }

    .draft {
        &::before {
            background-color: var(--dirty-white);
        }

        color: var(--dirty-white);
        background-color: var(--dark-gray)
    }
</style>
