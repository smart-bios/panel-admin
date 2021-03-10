<template>
    <div>
        <h1>Genes</h1>
        <hr class="mb-3">
        <v-card>
            <v-card-title>
                <v-select v-model="gene.assembly" :items="assemblys" item-text="code" item-value="_id" label="Assembly" @change="listgenes()" outlined></v-select>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" small elevation="3" dark v-on="on">ADD GENE</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{formTitle}}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-select v-model="gene.assembly" :items="assemblys" item-text="code" item-value="_id" label="Assembly *" outlined></v-select>
                                    </v-col>
                                    <v-col cols="12" md=6>
                                        <v-text-field label="Locus*" type="text" v-model="gene.locus" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea outlined label="Sequence *" v-model="gene.sequence"></v-textarea>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea outlined label="Description" v-model="gene.desc"></v-textarea>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-select :items= product label="Product" v-model="gene.product"></v-select>
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
                 <v-data-table
                    :headers="headers"
                    :items="genes"
                    :search="search"
                    dense
                >
                    <template v-slot:[`item.action`]="{ item }">
                        <v-btn x-small color="info" dark @click="edit(item)" >Edit</v-btn>
                        <v-btn x-small color="error" dark @click="remove(item)" >Delete</v-btn>
                    </template>
                </v-data-table>
            </v-card-text>

        </v-card>
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
                    {text: 'Locus ID', value: 'locus', align: 'left', sortable: false},
                    {text: 'Description', value: 'desc', align: 'left', sortable: false},
                    {text: 'Product', value: 'product', align: 'left', sortable: false},
                    {text: '', value: 'action', align: 'left', sortable: false},
                ],
                product: ['mRNA','tRNA', 'rRNA', 'smallRNA', 'tmRNA'],
                genes: [],
                assemblys: [],
                gene: {
                    id: '',
                    locus: '',
                    assembly: '',
                    sequence: '',
                    length: '',
                    product: '',
                    desc:''
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
                return this.editedIndex === -1 ? 'New gene' : 'Edit gene'
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

            async listgenes(){
                try {
                    //let config = { headers : { token : this.$store.state.token}}
                    //let res = await this.axios.get('/user/list', config)
                    let res = await this.axios.get(`/gene/list/${this.gene.assembly}`)
                    console.log(res.data.result);
                    this.genes = res.data.result
                } catch (error) {
                     console.log(error)
                }             
            },

            async register(){
               //let config = { headers : { token : this.$store.state.token}}
               if(this.editedIndex == -1){
                   try {
                       //let res = await this.axios.post('/user/add', this.user, config)
                       let res = await this.axios.post('/gene/add', this.user)
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
                        let res = await this.axios.put(`/gene/edit/${this.gene.id}`, this.gene)
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

                console.log(item._id)
                this.editedIndex = 1;
                this.gene.id = item._id
                this.gene.locus = item.locus
                this.gene.sequence = item.sequence
                this.gene.desc = item.desc
                this.gene.product = item.product
                this.dialog = true 
            },

            async remove(item){
                //let config = { headers : { token : this.$store.state.token}}
                confirm('Estás segura de que quieres eliminar este gen?') &&
                await this.axios.delete(`/gene/delete/${item._id}`)
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
                this.gene.locus = ''
                this.gene.sequence = ''
                this.gene.product = ''
                this.gene.desc
            },
            
            close(){
                this.clear();
                this.dialog = false
                this.editedIndex=-1;
            
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>