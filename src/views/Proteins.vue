<template>
    <div>
        <h1>Proteins</h1>
        <hr class="mb-3">
        <v-card>
            <v-card-title>
                <v-select 
                dense 
                v-model="protein.assembly" 
                :items="assemblys" 
                item-text="code" 
                item-value="_id" 
                label="Assembly" 
                @change="listproteins()" 
                hint="Seleccione un ensamble"
                persistent-hint
                 outlined></v-select>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" small elevation="3" dark v-on="on">ADD Protein</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{formTitle}}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-select dense v-model="protein.assembly" :items="assemblys" item-text="code" item-value="_id" label="Assembly *" outlined></v-select>
                                    </v-col>
                                    <v-col cols="12" md=6>
                                        <v-text-field dense label="Locus*" type="text" v-model="protein.locus" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md=4>
                                        <v-text-field dense label="Length*" type="text" v-model="protein.length" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md=4>
                                        <v-text-field dense label="Preferred Name*" type="text" v-model="protein.preferred_name" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md=4>
                                        <v-text-field dense label="COG" type="text" v-model="protein.cluster_orthologous_group" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea outlined label="Sequence *" v-model="protein.sequence"></v-textarea>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea outlined label="Description" v-model="protein.desc"></v-textarea>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea outlined label="Gene Ontology *" v-model="protein.gene_ontology"></v-textarea>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea outlined label="Kegg Ko *" v-model="protein.kegg_ko"></v-textarea>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea outlined label="Kegg Pathway *" v-model="protein.kegg_pathway"></v-textarea>
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

            </v-card-title>

            <v-card-text>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>

                 <v-data-table
                    :headers="headers"
                    :items="proteins"
                    :search="search"
                    :loading = "loading" 
                >
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
                loading: false,
                dialog: false,
                snackbar: false,
                timeout : 4000,
                headers: [
                    {text: 'Locus ID', value: 'locus', align: 'left', sortable: false},
                    {text: 'Description', value: 'desc', align: 'left', sortable: false},
                    {text: 'Preferred Name', value: 'preferred_name', align: 'left', sortable: false},
                    {text: 'Sequence', value: 'sequence', align: 'left', sortable: false},
                    {text: '', value: 'action', align: 'left', sortable: false},
                ],
                proteins: [],
                assemblys: [],
                protein: {
                    id: '',
                    locus: '',
                    assembly: '',
                    sequence: '',
                    length: '',
                    desc:'',
                    preferred_name: '',
                    cluster_orthologous_group: '',
                    gene_ontology: '',
                    kegg_ko: '',
                    kegg_pathway:''
                },
                editedIndex : -1,
                message: '',
                status: ''
            }
            
        },

        created(){
            this.listAssemblys()
        },

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New protein' : 'Edit protein'
            },
        },

        methods:{
            async listAssemblys(){
                try {
                    let res = await this.axios.get('/assembly/list')
                    this.assemblys = res.data.result
                } catch (error) {
                    console.log(error)
                }
            },

            async listproteins(){
                try {
                    this.loading = true
                    let res = await this.axios.get(`/protein/find/${this.protein.assembly}`)
                    if(res.data.status == 'success'){
                        this.proteins = res.data.result
                        this.loading = false
                       
                    }                
    
                } catch (error) {
                     console.log(error)
                      this.loading = false
                }             
            },

            async register(){
               let config = { headers : { token : this.$store.state.token}}
               if(this.editedIndex == -1){
                   try {
                       //let res = await this.axios.post('/user/add', this.user, config)
                       let res = await this.axios.post('/protein/add', this.protein, config)
                       this.message = res.data.msg
                       this.status = res.data.status
                       if(res.data.status == 'success'){
                            this.close()
                       }
                       this.snackbar= true
                   } catch (error) {
                       console.log(error)
                   }
               }else{
                   try {
                       //let res = await this.axios.put(`/user/update/${this._id}`, this.user, config)
                        let res = await this.axios.put(`/protein/edit/${this.protein.id}`, this.protein, config)
                        this.message = res.data.msg
                        this.status = res.data.status
                        
                        if(res.data.status == 'success'){
                            //this.search = '';
                            this.close()
                        }
                        this.snackbar= true
                   } catch (error) {
                       console.log(error)  
                   }
               }
            },

            edit(item){

                this.editedIndex = 1;
                this.protein.id = item._id
                this.protein.locus = item.locus
                this.protein.sequence = item.sequence
                this.protein.desc = item.desc
                this.protein.length = item.length
                this.protein.preferred_name = item.preferred_name
                this.protein.cluster_orthologous_group = item.cluster_orthologous_group
                this.protein.gene_ontology = item.gene_ontology
                this.protein.kegg_ko = item.kegg_ko
                this.protein.kegg_pathway = item.kegg_pathway
                this.dialog = true 
            },

            async remove(item){
                let config = { headers : { token : this.$store.state.token}}
                confirm('Estás segura de que quieres eliminar este gen?') &&
                await this.axios.delete(`/protein/delete/${item._id}`, config)
                .then(res => {
                    this.message = res.data.msg
                    this.status = res.data.status
                    this.snackbar = true
                }).catch(error => {
                    console.log(error)
                });
            },

            clear(){
                this.protein.locus = ''
                this.protein.sequence = ''
                this.protein.desc = ''
                this.protein.length = ''
                this.protein.preferred_name = ''
                this.protein.cluster_orthologous_group = ''
                this.protein.gene_ontology = ''
                this.protein.kegg_ko = ''
                this.protein.kegg_pathway = ''
            },
            
            close(){
                this.clear();
                this.dialog = false
                this.editedIndex=-1;
            
            },
        }
    }
</script>

<style scoped>

</style>