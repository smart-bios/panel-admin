<template>
    <div>
        <h1>Storage</h1>
        <hr class="mb-3">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <v-card class="px-3">
            <v-card-text>
                <v-form 
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-file-input
                                v-model="file"
                                label="Upload your file"
                                show-size
                                accept=".fna, .fasta, .faa, .fa, .faa, .fastq, .fq, .gz"
                                :rules="[v => !!v || 'File is required']"
                                required
                            >
                            </v-file-input>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="description"
                                label="Description"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-select
                                v-model="select"
                                label="Format file"
                                :items="items"
                                :rules="[v => !!v || 'Format file is required']"
                                item-text="text"
                                item-value="value"
                                required
                            >
                            </v-select>
                        </v-col>
                    </v-row>
                    <v-btn small :disabled="!valid" class="mr-4" @click="sendFile()"> Upload</v-btn>        
                </v-form>
            </v-card-text>

            <!-- <v-progress-linear :value="value"></v-progress-linear> -->
        </v-card>

        <hr class="my-5">

        <v-card>
            <v-card-text>
                <div>Uploaded</div>
                <v-row>
                    <v-col cols="12" md="2" sm="4" xs="6" v-for="item in store" :key= item._id>
                        <v-card
                            class="mx-auto"
                            max-width="230"
                            outlined
                        >
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <div class="overline mb-4">{{item.category}}</div>
                                    <v-list-item-title class="mb-1">{{item.filename}}</v-list-item-title>
                                    <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-card-actions>
                            <v-btn x-small color="success" dark @click="downloadFile(item._id, item.filename)" >Download</v-btn>
                            <v-btn x-small color="error" dark @click="deleteFile(item._id)">Delete</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                valid: true,
                file: [],
                description: '',
                value: 0,
                select: null,
                items: [
                    {value: 'fastq', text:'Sequencing read data (fastq)'},
                    {value: 'fasta', text:'A sequence record (fasta)'},
                    {value: 'other', text:'Other file format'},
                ],
                store: []
            }
        },
        created(){
            this.listFiles()
        },
        methods: {
            
            async sendFile(){
                const formData = new FormData;
                formData.append('file',this.file)
                formData.append("id", this.$store.state.user._id)
                formData.append("description",this.description)
                formData.append("category", this.select)
                //console.log(formData)
                try {
                    const response = await this.axios.post('/storage/upload', formData, {
                       onUploadProgress: ProgressEvent => { 
                           let progress  = Math.round((ProgressEvent.loaded / ProgressEvent.total)*100)
                           this.value = progress
                        }
                    })
                    this.listFiles()
                } catch (error) {
                    console.log(error)
                }
            },

            async listFiles(){
                try {
                    let res = await this.axios.get('/storage/list/'+ this.$store.state.user._id)
                    this.store = res.data.files
                } catch (error) {
                    console.log(error)
                }
            },

            async deleteFile(id){
                try {
                    confirm('Estás segura de que quieres eliminar este archivo?') &&
                    await this.axios.delete(`/storage/delete/${id}`)
                    this.listFiles()
                } catch (error) {
                    console.log(error)
                }
            },

            async downloadFile(id, filename){
                try {
                    await this.axios.get(`/storage/download/${id}`, {responseType: 'blob'})
                    .then(res => {
                        
                        if (!window.navigator.msSaveOrOpenBlob){
                            // BLOB NAVIGATOR
                            console.log(res.data)
                            const url = window.URL.createObjectURL(new Blob([res.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `${filename}`);
                            document.body.appendChild(link);
                            link.click();
                        }else{
                            // BLOB FOR EXPLORER 11
                            const url = window.navigator.msSaveOrOpenBlob(new Blob([res.data]),`${filename}`);
                        }
                    })
                } catch (error) {
                    console.log(error)
                }   
            },

            validate () {
                this.$refs.form.validate()
            },
            
            reset () {
                this.$refs.form.reset()
            },
        }
        
        
    }
</script>

<style lang="scss" scoped>

</style>