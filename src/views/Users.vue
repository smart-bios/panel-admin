<template>
    <div>
        <h1>Usuarios</h1>
        <hr class="mb-3">
        <v-card class="px-3 mt-3" min-height="720">
            <v-card-title>
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" small elevation="3" dark v-on="on">ADD User</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{formTitle}}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-text-field label="Username*" v-model="user.username" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field label="Email*" type="email" v-model="user.email" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" v-if="editedIndex == -1">
                                        <v-text-field label="Password*" type="password" v-model="user.password" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-select
                                            :items= role
                                            label="User Type*"
                                            v-model="user.role"
                                            required
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-select
                                            :items= estado
                                            label="Status"
                                            v-model="user.status"
                                            required
                                        ></v-select>
                                    </v-col>           
                                </v-row>
                            </v-container>
                            <small>*indicates required field</small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" dark small elevation="3" @click="close">Close</v-btn>
                            <v-btn color="primary" dark small elevation="3" @click="register">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
        
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="users"
                    :search="search"
                    class="elevation-1"
                >
                    <template v-slot:[`item.status`]="{ item }">
                        <v-chip :color="getColor(item.status)" dark></v-chip>
                    </template>
                    <template v-slot:[`item.action`]="{ item }">
                        <v-btn x-small color="info" dark @click="edit(item)" >Edit</v-btn>
                        <v-btn x-small color="error" dark @click="remove(item)" >Delete</v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-snackbar v-model="snackbar" :timeout= "timeout" :color="status">
            {{message}}
        </v-snackbar>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                search: '',
                dialog: false,
                snackbar: false,
                timeout : 4000,
                headers: [
                    {text: 'Nombre usuario', value: 'username', align: 'left', sortable: false},
                    {text: 'E-mail', value: 'email', align: 'left', sortable: false},
                    {text: 'Tipo de usuario', value: 'role', align: 'left', sortable: false},
                    {text: 'Estado', value: 'status', align: 'left', sortable: false},
                    {text: 'Fecha de registro', value: 'createdAt', align: 'left', sortable: false},
                    {text: '', value: 'action', align: 'left', sortable: false},
                ],
                role: ['USER','ADMIN'],
                estado: [{text: 'Enabled', value: true}, {text: 'Disabled', value: false} ],
                users: [],
                user: {
                    id: '',
                    username: '',
                    email: '',
                    password: '',
                    role: 'USER',
                    status: true
                },
                editedIndex : -1,
                message: '',
                status: ''
            }
        },

        created(){
            this.list()
        },

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New user' : 'Edit user'
            },
        },

        methods:{

            async list(){
                try {
                    let config = { headers : { token : this.$store.state.token}}
                    //let res = await this.axios.get('/user/list', config)
                    let res = await this.axios.get('/user/list', config)
                    this.users = res.data.result
                } catch (error) {
                     console.log(error)
                }             
            },

            async register(){
               let config = { headers : { token : this.$store.state.token}}
               if(this.editedIndex == -1){
                   try {
                       //let res = await this.axios.post('/user/add', this.user, config)
                       let res = await this.axios.post('/user/add', this.user, config)
                       this.message = res.data.msg
                       this.status = res.data.status
                       if(res.data.status == 'success'){
                            this.list()
                            this.close()
                       }
                       this.snackbar= true
                   } catch (error) {
                       console.log(error)
                   }
               }else{
                   try {
                       //let res = await this.axios.put(`/user/update/${this._id}`, this.user, config)
                        let res = await this.axios.put(`/user/edit/${this.user.id}`, {
                            username: this.user.username,
                            email: this.user.email,
                            role: this.user.role,
                            status: this.user.status
                        }, config)
                        
                        this.message = res.data.msg
                        this.status = res.data.status
                        
                        if(res.data.status == 'success'){
                            this.list()
                            this.close()
                        }
                   } catch (error) {
                       console.log(error)  
                   }
               }
            },

            edit(item){

                this.editedIndex = 1;
                this.user.id = item._id
                this.user.username = item.username
                this.user.email = item.email
                this.user.role = item.role
                this.dialog = true 
            },

            async remove(item){
                let config = { headers : { token : this.$store.state.token}}
                confirm('Estás segura de que quieres eliminar este usuario?') &&
                await this.axios.delete(`/user/delete/${item._id}`, config)
                .then(res => {
                    this.message = res.data.msg
                    this.status = res.data.status
                    this.list();
                    this.snackbar = true
                }).catch(error => {
                    console.log(error)
                });
            },

            clear(){
                this.user.username = ''
                this.user.email = ''
                this.user.password = ''
            },
            close(){
                this.clear();
                this.dialog = false
                this.editedIndex=-1;
            
            },

            getColor (state) {
                if (state) return 'green'
                else return 'red'
            },
        }
        
    }
</script>