<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <span>{{ someDate | moment("YYYY") }}</span>
    <span>{{ someDate | moment("ddd, hA") }}</span>
    {{today}}
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import * as moment from "moment/moment";
export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data(){
    return{
      today: moment.utc('2021-03-07T01:59:10.934+00:00').format('L')
    }
  }
}
</script>
