<template>
    <div>
        <h1>Files</h1>
        <hr class="mb-3">
        <v-card>
            <v-card-text>
                <v-data-table :headers="headers" :items="files">
                    <template v-slot:[`item.action`]="{ item }">
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
                snackbar: false,
                timeout : 4000,
                files : [],
                headers: [
                    { text: 'File name', value: 'filename'},
                    { text: 'Description', value: 'description'},
                    { text: 'Type', value: 'type'},
                    { text: 'User', value: 'user.username'},
                    { text: 'Date', value: 'createdAt'},
                    {text: '', value: 'action'},
                ],
                status: '',
                message:''
            }
        },
        created(){
            this.list()
        },
        computed: {

        },

        methods:{
            async list(){
                let config = { headers : { token : this.$store.state.token}}
                try {
                    let res = await this.axios.get('/storage/list', config)
                    this.files = res.data.result
                } catch (error) {
                    console.log(error)
                }
            },

            async remove(item){
                try {
                    //let res = await this.axios.delete(`/storage/delete/${item._id}`)
                    let config = { headers : { token : this.$store.state.token}}

                    confirm('Estás segura de que quieres eliminar este archivo?') &&
                    await this.axios.delete(`/storage/delete/${item._id}`, config)
                    .then(res => {
                        this.message = res.data.msg
                        this.status = res.data.status
                        this.list();
                        this.snackbar = true
                    }).catch(error => {
                        console.log(error)
                    });
                } catch (error) {
                    
                }
            }

        }
    }
</script>

<style lang="scss" scoped>

</style>