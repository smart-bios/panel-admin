<template>
    <div>
        <v-navigation-drawer v-model="drawer" class="secondary" app clipped dark v-if="logged"> 
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
                <v-list-item-group v-model="item" color="accent" dark>
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

        <v-app-bar app clipped-left color="primary" dark>
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
                { text: 'Proyectos', icon: 'mdi-database', to: 'Projects'},
                { text: 'Ensambles', icon: 'mdi-database', to: 'Assemblys'},
                { text: 'Genes', icon: 'mdi-database', to: 'Genes'},
                { text: 'Proteinas', icon: 'mdi-database', to: 'Proteins'},
                { text: 'Especies', icon: 'mdi-database', to: 'Species' },
                { text: 'Usuarios', icon: 'mdi-account-multiple', to: 'Users' },
                { text: 'Archivos', icon: 'mdi-folder', to: 'Files' },
                
                
            ],
        }),

        created () {
            this.$vuetify.theme.dark = false
        },

        computed:{
            logged(){
                return this.$store.state.user && this.$store.state.user.role === 'ADMIN';
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
