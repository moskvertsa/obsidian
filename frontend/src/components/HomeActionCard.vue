<template>
    <connect-wallet :to="to" style="max-width: 325px">
        <q-card class="card-border box-shadow-box cursor-pointer q-py-md">
            <q-card-section class="text-center text-bold text-h6 header-black q-pb-none">
                {{ text }}
            </q-card-section>

            <q-card-section class="text-center"> {{ description }} </q-card-section>
        </q-card>
    </connect-wallet>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConnectWallet from "components/ConnectWallet.vue";

export default defineComponent({
    name: "HomeActionCard",

    components: { ConnectWallet },

    props: {
        description: {
            type: String,
            required: true,
        },

        text: {
            type: String,
            required: true,
        },

        to: {
            type: String,
            required: true,
        },
    },

    setup() {
        return {};
    },
});
</script>

<style lang="sass" scoped>

.box-shadow-box
    box-shadow: rgba(43, 113, 255, 0.3) -10px 10px 2rem 1rem
    z-index: 99999
</style>
