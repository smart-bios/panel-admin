<template>
    <div>
        <h1>Ensambles</h1>
        <hr class="mb-3">
        <v-card class="px-3 mt-3">
            
            <v-card-title>
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark elevation="2" small v-bind="attrs" v-on="on"> Add Assembly</v-btn>
                    </template>

                    <v-card>
                        <v-card-title> {{formTitle}} </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6">
                                         <v-select v-model="assembly.project" :items="projects" item-text="code" item-value="_id" label="Project" required></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Code*"  @keyup="uppercase" v-model="assembly.code" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-select v-model="assembly.specie" :items="species" item-text="scientific_name" item-value="_id" label="Specie"></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Pathovar/Cultivar" v-model="assembly.variety" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12">
                                        <v-textarea outlined label="Methods" v-model="assembly.methods"></v-textarea>
                                    </v-col>
                                    <v-col cols="12" md="3" sm="4">
                                        <v-text-field label="Version" v-model="assembly.version" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3" sm="4">
                                        <v-select v-model="assembly.level" :items=level label="Level"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="3" sm="4">
                                        <v-text-field label="# contigs" v-model="assembly.contig"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3" sm="4">
                                        <v-text-field label="Size(mb)" v-model="assembly.size"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3" sm="4">
                                        <v-text-field label="#Genes" v-model="assembly.genes"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3" sm="4">
                                        <v-text-field label="#mRNA" v-model="assembly.cds"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3" sm="4">
                                        <v-text-field label="#rRNA" v-model="assembly.rRNA"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3" sm="4">
                                        <v-text-field label="#tRNA" v-model="assembly.tRNA"></v-text-field>
                                    </v-col>                                  
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" dark small elevation="3" @click="close">Close</v-btn>
                            <v-btn color="primary" dark small elevation="3" type="submit" @click="register">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col col="12" xs= "12" sm= "12" md="6" lg="4" v-for="item in assemblys" :key= item._id>
                        <v-card elevation="12">
                            <v-card-title>{{item.code}} {{item.version}}</v-card-title>
                            <v-card-subtitle> 
                                {{item.project.code}} 
                                <br>
                                <i>{{item.specie.scientific_name}} {{item.variety}}</i>
                            </v-card-subtitle>
                            <v-card-text>
                                
                                {{item.methods}}

                                <v-simple-table dense>
                                    <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">Level</th>
                                            <th class="text-left">#Contig</th>
                                            <th class="text-left">Size</th>
                                            <th class="text-left">#Genes</th>
                                            <th class="text-left">#mRNA</th>
                                            <th class="text-left">#rRNA</th>
                                            <th class="text-left">#tRNA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{{ item.level}}</td>
                                            <td>{{ item.contig}}</td>
                                            <td>{{ item.size}}</td>
                                            <td>{{ item.genes}}</td>
                                            <td>{{ item.cds}}</td>
                                            <td>{{ item.rRNA}}</td>
                                            <td>{{ item.tRNA}}</td>
                                        </tr>
                                    </tbody>
                                    </template>
                                </v-simple-table> 
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
                species: [],
                assemblys:[],
                assembly: {
                    id: '',
                    project: '',
                    code: '',
                    specie: '',
                    variety: '',
                    methods: '',
                    version: 'v0.1',
                    level: 'contig',
                    contig: '',
                    size: '',
                    cds: '',
                    genes: '',
                    rRNA: '',
                    tRNA: ''
                },
                level: ['contig','scaffold','complete'],
                editedIndex : -1,
                message: '',
                status: ''
            }
        },
        created(){
            this.listProjects();
            this.listSpecies();
            this.list()
        },

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New assembly' : 'Edit assembly'
            },
        },

        methods: {
            async listProjects(){
                try {
                    let res = await this.axios.get('/project/list')
                    this.projects = res.data.result
                } catch (error) {
                    console.log(error)
                }
            },

            async listSpecies(){
                try {
                    let res = await this.axios.get('/specie/list')
                    this.species = res.data.result
                } catch (error) {
                    console.log(error)
                }
            },

            async list() {
                try {
                    let res = await this.axios.get('/assembly/list')
                    this.assemblys = res.data.result
                
                } catch (error) {
                    console.log(error)
                }
            },

            async register(){

               if(this.editedIndex == -1){
                   try {
                       //let res = await this.axios.post('/user/add', this.user, config)
                       let res = await this.axios.post('/assembly/add', this.assembly)
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
                        let res = await this.axios.put(`/assembly/edit/${this.assembly.id}`, this.assembly)
                        
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
                await this.axios.delete(`/assembly/delete/${item._id}`)
                .then(res => {
                    console.log(res.data)
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
                this.assembly.id = item._id;
                this.assembly.project = item.project;
                this.assembly.code = item.code;
                this.assembly.specie = item.specie;
                this.assembly.variety = item.variety;
                this.assembly.methods = item.methods;
                this.assembly.version = item.version;
                this.assembly.level = item.level;
                this.assembly.contig = item.contig;
                this.assembly.size = item.size;
                this.assembly.cds = item.cds;
                this.assembly.genes = item.genes;
                this.assembly.rRNA = item.rRNA;
                this.assembly.tRNA = item.tRNA;
                this.dialog = true;
            },

            clear(){
                this.assembly.project = '';
                this.assembly.code = '';
                this.assembly.specie = '';
                this.assembly.variety ='';
                this.assembly.methods ='';
                this.assembly.contig = '';
                this.assembly.size = '';
                this.assembly.cds = '';
                this.assembly.genes = '';
                this.assembly.rRNA = '';
                this.assembly.tRNA = '';
            },

            close(){
                this.clear()
                this.dialog = false
                this.editedIndex=-1;
            },

            uppercase() {
                this.assembly.code = this.assembly.code.toUpperCase();
            }
        }
    }
</script>
