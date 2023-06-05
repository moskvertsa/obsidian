<template>
    <div>
        <q-layout view="hhh lpr ffr" style="z-index: 0">
            <q-header class="q-mx-md q-mt-md" style="color: #000000; background-color: rgba(0, 0, 0, 0)">
                <div class="column all-content-format">
                    <!-- Main header -->
                    <div class="row justify-between items-center no-wrap">
                        <div class="col-sm-auto">
                            <div class="row justify-start items-center">
                                <!-- LOGO AND TITLE -->
                                <div class="row items-center cursor-pointer">
                                    <div class="row items-center">
                                        <img
                                            @click="$router.push({ name: 'home' })"
                                            alt="Obsidian logo"
                                            src="~assets/obsidian.png"
                                            style="max-width: 50px"
                                            class="q-ml-md"
                                        />
                                        <div
                                            v-if="$q.screen.gt.sm"
                                            @click="$router.push({ name: 'home' })"
                                            class="text-h5 dark-toggle"
                                        >
                                            <span class="header-black q-ml-md">Obsidian</span>
                                        </div>

                                        <div v-else-if="$q.screen.xs">
                                            <div v-if="isLoading" class="q-ml-md row">
                                                <q-spinner color="primary" size="1em" />
                                            </div>
                                            <address-settings
                                                v-else-if="!isLoading && (userDisplayName || network)"
                                                :avatar="avatar"
                                                :userAddress="userAddress"
                                                :userDisplayName="userDisplayName"
                                                :advancedMode="advancedMode"
                                                class="q-ml-md row"
                                            />
                                        </div>
                                    </div>

                                    <!-- NAVIGATION LINKS -->
                                    <div v-if="!$q.screen.xs">
                                        <header-links
                                            :class="{
                                                col: true,
                                                'justify-center': true,
                                                'q-ml-xs': true,
                                                'q-col-gutter-x-xl': $q.screen.gt.sm,
                                                'q-col-gutter-x-md': $q.screen.lt.md,
                                            }"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- HAMBURGER MENU -->
                        <q-btn
                            v-if="$q.screen.xs"
                            flat
                            @click="drawerRight = !drawerRight"
                            icon="fas fa-bars"
                            class="darkgrey"
                        />

                        <!-- ADDRESS AND SETTINGS AND NETWORK SELECTOR -->
                        <div v-else class="col-sm-auto">
                            <div v-if="isLoading" class="row justify-end items-center">
                                <q-spinner color="primary" size="1em" />
                            </div>
                            <div
                                v-else-if="!isLoading && (userDisplayName || network)"
                                class="row justify-end items-center no-wrap"
                            >
                                <div class="q-mr-md">
                                    <address-settings
                                        :avatar="avatar"
                                        :userAddress="userAddress"
                                        :userDisplayName="userDisplayName"
                                        :advancedMode="false"
                                        class="row"
                                    />
                                </div>
                                <network-dropdown />
                            </div>

                            <connect-wallet v-else-if="!isLoading" :to="redirectPath" :params="redirectParams">
                                <div class="row justify-end items-center">
                                    <connect-wallet :to="redirectPath" :params="redirectParams">
                                        <base-button
                                            class="cursor-pointer"
                                            color="primary"
                                            :label="$t('Base-Layout.connect-wallet')"
                                            :outline="true"
                                            :rounded="true"
                                        />
                                    </connect-wallet>
                                </div>
                            </connect-wallet>
                        </div>
                    </div>
                </div>
            </q-header>

            <q-page-container>
                <router-view />
            </q-page-container>
        </q-layout>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import ArgentWarningModal from "components/ArgentWarningModal.vue";
import BaseButton from "src/components/BaseButton.vue";
import BaseTooltip from "src/components/BaseTooltip.vue";
import ConnectWallet from "src/components/ConnectWallet.vue";
import useSettingsStore from "src/store/settings";
import useWalletStore from "src/store/wallet";
import AddressSettings from "./AddressSettings.vue";
import HeaderLinks from "src/layouts/HeaderLinks.vue";
import NetworkDropdown from "src/layouts/NetworkDropdown.vue";
import { Language } from "src/components/models";

export default defineComponent({
    name: "BaseLayout",
    components: { AddressSettings, ArgentWarningModal, BaseButton, BaseTooltip, ConnectWallet, HeaderLinks, NetworkDropdown }, // prettier-ignore
    setup() {
        const { advancedMode, isDark, language, supportedLanguages, toggleAdvancedMode, setLanguage, toggleDarkMode } =
            useSettingsStore();
        const {
            avatar,
            isAccountSetup,
            isAccountSetupLegacy,
            isArgent,
            isLoading,
            network,
            userAddress,
            userDisplayName,
            setLanguage: setWalletLanguage,
        } = useWalletStore();

        const currentLanguage = ref({ label: language.value.label, value: language.value.value });
        const argentModalDismissed = ref(false);
        const showArgentModal = computed(() => isArgent.value && !argentModalDismissed.value);
        const redirectPath = computed(() => {
            if (window.location.pathname === "/send") {
                return "send";
            }
            return undefined;
        });
        const redirectParams = computed(() => {
            if (window.location.pathname === "/send") {
                return window.location.search;
            }
            return undefined;
        });

        const version = window.logger.version;

        const changeLanguage = (language: Language) => {
            setLanguage(language);
            setWalletLanguage(language.value);
        };
        return {
            advancedMode,
            argentModalDismissed,
            avatar,
            currentLanguage,
            drawerRight: ref(false),
            isAccountSetup,
            isAccountSetupLegacy,
            isDark,
            isLoading,
            language,
            network,
            changeLanguage,
            redirectPath,
            redirectParams,
            showArgentModal,
            supportedLanguages,
            toggleAdvancedMode,
            toggleDarkMode,
            userAddress,
            userDisplayName,
            version,
        };
    },
});
</script>

<style lang="sass" scoped>
.icon
  width: 30px

.spaced-letters
  text-transform: uppercase
  letter-spacing: 0.4em
</style>
