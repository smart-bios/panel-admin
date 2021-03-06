<template>
    <div>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="elevation-12">
              <v-toolbar color="secondary" flat>
                <v-toolbar-title>Iniciar sesión</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field label="Login" name="login" prepend-icon="mdi-account" type="text" v-model="user.email"
                  ></v-text-field>

                  <v-text-field label="Password" name="password" prepend-icon="mdi-lock" type="password" v-model="user.password"
                  ></v-text-field>
                </v-form>
                <v-alert dense type="error" v-if="error">{{message}}</v-alert>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
    </div>
</template>

<script>
import decode from 'jwt-decode'
    export default {
        data(){
            return {
                error: false,
                user: {
                    email: '',
                    password: ''
                },
                message: ''
            }
        },
        methods: {
            async login(){
                try {
                    let res = await this.axios.post('/user/login',this.user)
                    let user = decode(res.data.token)
                    if(user.role == 'ADMIN'){
                        this.$store.dispatch("saveToken", res.data.token);
                        this.$router.push({name: 'Home'});
                        this.error = false
                    }else{
                        this.error = true
                        this.message = 'No posee las credenciales de administrador'
                    }
                } catch (error) {
                    if (error.response) {
                        this.message = error.response.data.message
                        this.error = true
                        console.log("error.response.data",error.response.data);
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
