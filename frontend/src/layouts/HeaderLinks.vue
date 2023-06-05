<template>
    <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "HeaderLinks",
    props: {
        isDrawer: {
            type: Boolean,
            required: false,
        },
    },
    setup() {
        return {};
    },
});
</script>
