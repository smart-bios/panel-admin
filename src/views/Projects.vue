<template>
    <div>
        <h1>Proyectos</h1>
        <hr class="mb-3">
        <v-card class="px-3 mt-3" min-height="720">

            <v-card-title>
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark small elevation="3" v-bind="attrs" v-on="on"> Nuevo Proyecto</v-btn>
                    </template>

                    <v-card>
                        <v-card-title> {{formTitle}} </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" md="3">
                                        <v-text-field label="Codigo*" v-model="project.code" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="7">
                                        <v-text-field label="Investigador" v-model="project.advisor" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="2">
                                        <v-text-field label="Año" v-model="project.year" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12">
                                        <v-textarea outlined label="Descripción" v-model="project.description"
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

                <v-data-table
                    :headers="headers"
                    :items="projects"
                    class="elevation-1"
                >
                    <template v-slot:[`item.action`]="{ item }">
                        <v-btn x-small color="info" dark @click="edit(item)" >Editar</v-btn>
                        <v-btn x-small color="error" dark @click="remove(item)" >Eliminar</v-btn>
                    </template>
                </v-data-table>
               <!--  <v-row>
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
                </v-row> -->
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
                headers: [
                    {text: 'Codigo Proyecto', value: 'code', align: 'left', sortable: false},
                    {text: 'Investigador', value: 'advisor', align: 'left', sortable: false},
                    {text: 'Año', value: 'year', align: 'left', sortable: false},
                    {text: 'Descripción', value: 'description', align: 'left', sortable: false},
                    {text: '', value: 'action', align: 'left', sortable: false},
                ],
                project: {
                    id: '',
                    code: '',
                    advisor: '',
                    year: '',
                    description: ''
                },
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
                return this.editedIndex === -1 ? 'Nuevo Proyecto' : 'Editar Proyecto'
            },

            uppercase() {
                return this.project.code.toUpperCase();
            }
        },

        methods: {
            async list() {
                let config = { headers : { token : this.$store.state.token}}
                try {
                    let res = await this.axios.get('/project/list', config)
                    this.projects = res.data.result
                
                } catch (error) {
                    console.log(error)
                }
            },

            async register(){
                let config = { headers : { token : this.$store.state.token}}
                
                if(this.editedIndex == -1){  
                   try {
                       let res = await this.axios.post('/project/add', this.project, config)
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
                        let res = await this.axios.put(`/project/edit/${this.project.id}`, this.project, config)
                        
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
                let config = { headers : { token : this.$store.state.token}}
                confirm('Estás seguro de que quieres eliminar?') &&
                await this.axios.delete(`/project/delete/${item._id}`, config)
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

           /*  uppercase() {
                this.project.code = this.project.code.toUpperCase();
            } */

        }
        
    }
</script>

<style lang="scss" scoped>

</style>