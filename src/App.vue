<template>
  <v-app>
    <v-app-bar app color="primary" dark >
      <v-toolbar-title>{{pageTitle}}{{coachName&&`(${coachName})`}}{{realname&&` [ ${realname} ${subjectType} ]`}}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view class="router" style=""/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  computed:{
    pageTitle() {
      return this.$route.meta.title
    },
    coachName(){
      return this.$store.getters.user && this.$store.getters.user.coach && this.$store.getters.user.coach.name
    },
    realname(){
      return this.$store.getters.user && this.$store.getters.user.realname
    },
    subjectType(){
      let subjectType = this.$store.getters.user && this.$store.getters.user.statusSubject
      if(subjectType===2 || subjectType===1 || subjectType===0){
        return '科目二'
      }else if(subjectType===3){
        return '科目三'
      }else{
        return '已完成'
      }
    }
  },
};
</script>
