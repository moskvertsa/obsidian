import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: () => import("layouts/BaseLayout.vue"),
        children: [
            { name: "home", path: "", component: () => import("pages/Home.vue") },
            { name: "send", path: "/send", component: () => import("pages/AccountSend.vue") },
            { name: "receive", path: "/receive", component: () => import("pages/AccountReceive.vue") },
            { name: "sent", path: "/sent", component: () => import("pages/AccountSent.vue") },
            { name: "setup", path: "/setup", component: () => import("pages/AccountSetup.vue") },
        ],
    },
    {
        path: "/:catchAll(.*)*",
        component: () => import("pages/Error404.vue"),
    },
];

export default routes;
