<template>
    <div>
        <h1>Especies</h1>
        <hr class="mb-3">
        <v-card class="px-3 mt-3">
            <v-card-title>
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark small elevation="3" v-bind="attrs" v-on="on"> Add Specie</v-btn>
                    </template>

                    <v-card>
                        <v-card-title class="indigo lighten-3"> {{formTitle}} </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-select :items= kingdom label="Kingdom*" v-model="specie.kingdom" required></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Name*" v-model="specie.name" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Scientific name*" v-model="specie.scientific_name" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Short name" v-model="specie.short_name" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Alias" v-model="specie.alias" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12">
                                        <v-textarea outlined label="Description" v-model="specie.description"
                                        ></v-textarea>
                                    </v-col>
                                    <v-col cols="12" sm="12">
                                        <v-text-field label="URL img" v-model="specie.img" required></v-text-field>
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
                    <v-col cols="12" md="6" lg="4" v-for="item in species" :key= item._id>
                        <v-card class="mx-auto" elevation="12">
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <div class="overline mb-4">
                                        {{item.kingdom}}
                                    </div>
                                    <v-list-item-title class="headline mb-1">
                                        <i>{{item.scientific_name}}</i>
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{item.name}} {{item.description}}
                                    </v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-avatar
                                    tile
                                    size="80"
                                    color="grey"
                                >  <v-img :src="item.img"></v-img> </v-list-item-avatar>
                            </v-list-item>

                            <v-card-actions>
                                <v-btn x-small color="info" dark @click="edit(item)" >Edit</v-btn>
                                <v-btn x-small color="error" dark @click="remove(item)" >Delete</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>                  
                </v-row>
            </v-card-text>
            <v-snackbar v-model="snackbar" :timeout= "timeout" :color="status">
                {{message}}
            </v-snackbar>
        </v-card>
        

    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                snackbar: false,
                timeout : 4000,
                species: [],
                specie: {
                    id: '',
                    name: '',
                    scientific_name: '',
                    short_name: '',
                    alias: '',
                    kingdom: '',
                    description: "",
                    img: ''
                },
                kingdom: ["Bacteria", "Fungi", "Plantae", "Virus", "Animalia"],
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
                return this.editedIndex === -1 ? 'New specie' : 'Edit specie'
            },
        },

        methods:{
            async list() {
                try {
                    let res = await this.axios.get('/specie/list')
                    this.species = res.data.result
                
                } catch (error) {
                    console.log(error)
                }
            },

            async register(){

               if(this.editedIndex == -1){
                   try {
                       //let res = await this.axios.post('/user/add', this.user, config)
                       let res = await this.axios.post('/specie/add', this.specie)
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
                        let res = await this.axios.put(`/specie/edit/${this.specie.id}`, this.specie)
                        
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

            edit(item){
                this.editedIndex = 1;
                this.specie.id = item._id
                this.specie.kingdom = item.kingdom
                this.specie.name = item.name
                this.specie.scientific_name = item.scientific_name
                this.specie.short_name = item.short_name
                this.specie.alias = item.alias
                this.specie.description = item.description
                this.specie.img = item.img
                
                
                this.dialog = true 
            },

            async remove(item){
                //let config = { headers : { token : this.$store.state.token}}
                confirm('Estás seguro de que quieres eliminar?') &&
                await this.axios.delete(`/specie/delete/${item._id}`)
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
                this.specie.name = ''
                this.specie.scientific_name = ''
                this.specie.short_name = ''
                this.specie.alias = ''
                this.specie.description = ''
                this.specie.img = ''
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