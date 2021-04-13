<template>
    <div class="login">
        <v-card class="elevation-12 mx-auto my-12" max-width="550">
            <v-toolbar dark color="primary" flat>
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <v-form ref="form" v-model="form">
                    <v-text-field 
                        label="Login"
                        type= "email"
                        v-model="user.email"
                        prepend-icon="mdi-account"
                        :rules="[rules.email, rules.required]"
                    ></v-text-field>

                    <v-text-field 
                        label="Password"
                        type="password"
                        v-model="user.password"
                        prepend-icon="mdi-lock"
                        :rules="[rules.required]"
                    ></v-text-field>
                </v-form>
                
                <v-alert dense type="error" v-if="error">{{message}}</v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                    :disabled="!form"
                    color="primary"
                    depressed
                    @click="login"
                >
                    Login
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                form: false,
                error: false,
                user: {
                    email: '',
                    password: ''
                },
                rules: {
                    email: v => !!(v || '').match(/@/) || 'Please enter a valid email',
                    required: v => !!v || 'This field is required'
                },
                message: ''
            }
        },
        
        methods: {
            async login(){
                try {
                    let res = await this.axios.post('/user/login', this.user)
                    let user = await this.$store.dispatch('saveToken', res.data.token)
                    
                    if(user.role == 'ADMIN'){
                        this.$router.push({name: 'Home'});
                        this.error = false
                    }else{
                        this.error = true
                        this.message = 'No posee las credenciales de administrador'
                    }
                } catch (error) {
                    if (error.response) {
                        this.message = error.response.data.msg
                        this.error = true
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
