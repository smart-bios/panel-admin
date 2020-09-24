<template>
    <div>
        <v-navigation-drawer v-model="drawer" class="indigo darken-4" app clipped dark v-if="logged"> 
            <template v-slot:prepend>
                <v-list-item two-line>
                <v-list-item-avatar>
                    <v-avatar color="orange darken-4">
                        <v-icon dark>mdi-account-circle</v-icon>
                    </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>{{username}}</v-list-item-title>
                    <v-list-item-subtitle>Bienvenido.</v-list-item-subtitle>
                </v-list-item-content>
                </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list dense>
                <v-list-item-group v-model="item" color="primary">
                    <v-list-item
                        v-for="(item, i) in items"
                        :key="i"
                        :to="item.to"
                    >
                        <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                        <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>

            <template v-slot:append>
                <div class="pa-2">
                    <v-btn block @click="logout">Logout</v-btn>
                </div>
            </template>
        </v-navigation-drawer>

        <v-app-bar app clipped-left>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="logged"></v-app-bar-nav-icon>
            <v-toolbar-title>PANEL ADMINISTRACION</v-toolbar-title>
        </v-app-bar>

    </div>
</template>

<script>
    export default {
        data: () => ({
            drawer: null,
            item: 0,
            items: [
                { text: 'Files', icon: 'mdi-folder', to: 'Storage' },
                { text: 'Users', icon: 'mdi-account-multiple', to: 'Users' },
                { text: 'References genomes', icon: 'mdi-format-align-justify', to: 'Genomes' },
                { text: 'Databases', icon: 'mdi-database', to: 'Databases'},
            ],
        }),

        created () {
            this.$vuetify.theme.dark = true
        },

        computed:{
            logged(){
                return this.$store.state.user && this.$store.state.user.role === 'ADMIN_ROLE';
            },
            username(){
                return this.$store.state.user.username
            }
        },

        methods:{
            logout(){
                this.$store.dispatch("logout");
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>