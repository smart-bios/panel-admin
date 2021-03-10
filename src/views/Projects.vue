<template>
    <div>
        <h1>Proyectos</h1>
        <hr class="mb-3">
        <v-card class="px-3 mt-3">
            <v-card-title>
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark small elevation="3" v-bind="attrs" v-on="on"> Add Project</v-btn>
                    </template>

                    <v-card>
                        <v-card-title> {{formTitle}} </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" md="3">
                                        <v-text-field label="Code*"  @keyup="uppercase" v-model="project.code" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="7">
                                        <v-text-field label="Advisor" v-model="project.advisor" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="2">
                                        <v-text-field label="Year" v-model="project.year" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12">
                                        <v-textarea outlined label="Description" v-model="project.description"
                                        ></v-textarea>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" dark small elevation="3" @click="close">Close</v-btn>
                            <v-btn color="primary" dark small elevation="3" @click="register">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-card-title>
            
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="4" v-for="item in projects" :key= item._id>
                        <v-card elevation="12">
                            <v-card-title >{{item.code}}</v-card-title>
                            <v-card-subtitle> {{item.advisor}} | {{item.year}}</v-card-subtitle>
                            <v-card-text>
                                <p>{{item.description}}</p>
                                <p>{{item.methods}}</p>

                            </v-card-text>
                            <v-card-actions>
                                <v-btn x-small color="info" dark @click="edit(item)" >Edit</v-btn>
                                <v-btn x-small color="error" dark @click="remove(item)" >Delete</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-snackbar v-model="snackbar" :timeout= "timeout" :color="status">{{message}}</v-snackbar>

    </div>
</template>

<script>
    export default {
        data(){
            return {
                dialog: false,
                snackbar: false,
                timeout : 4000,
                projects: [],
                project: {
                    id: '',
                    code: '',
                    advisor: '',
                    year: '',
                    description: ''                },
                editedIndex : -1,
                message: '',
                status: ''

            }
        },
        created(){
            this.list();
        },

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New project' : 'Edit project'
            },
        },

        methods: {
            async list() {
                try {
                    let res = await this.axios.get('/project/list')
                    this.projects = res.data.result
                
                } catch (error) {
                    console.log(error)
                }
            },

            async register(){

               if(this.editedIndex == -1){
                   try {
                       //let res = await this.axios.post('/user/add', this.user, config)
                       let res = await this.axios.post('/project/add', this.project)
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
                        let res = await this.axios.put(`/project/edit/${this.project.id}`, this.project)
                        
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
               }
            },

            async remove(item){
                //let config = { headers : { token : this.$store.state.token}}
                confirm('Estás seguro de que quieres eliminar?') &&
                await this.axios.delete(`/project/delete/${item._id}`)
                .then(res => {
                    this.message = res.data.msg
                    this.status = res.data.status
                    this.list();
                    this.snackbar = true
                }).catch(error => {
                    console.log(error)
                });
            },


            edit(item){

                this.editedIndex = 1;
                this.project.id = item._id
                this.project.code = item.code
                this.project.advisor = item.advisor
                this.project.year = item.year
                this.project.description = item.description
                this.dialog = true 
            },

            clear(){
                this.project.code = ''
                this.project.advisor = ''
                this.project.year = ''
                this.project.description = ''
                
            },

            close(){
                this.clear()
                this.dialog = false
                this.editedIndex=-1;
            },

            uppercase() {
                this.project.code = this.project.code.toUpperCase();
            }

        }
        
    }
</script>

<style lang="scss" scoped>

</style>