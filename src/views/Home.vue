<template>
  <div class="home">
    <!--筛选栏-->
    <div class="filterToolbar">
      <v-menu style="flex: 0 0  66%" v-model="FilterMenuDate" :close-on-content-click="false" transition="scale-transition" offset-y
              min-width="auto">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field prepend-inner-icon="mdi-calendar" style="width: 200px;" solo readonly hide-details
                        v-model="searchOption.datetime" v-bind="attrs" v-on="on"
          />
        </template>
        <v-date-picker first-day-of-week="1" range v-model="searchOption.datetime" clearable></v-date-picker>
      </v-menu>
      <v-select style="flex: 0 0 33%;margin-right: 0;" :menu-props="{ offsetY: true }" :items="types" solo
                v-model="searchOption.displayType" label="显示方式" hint="显示方式" hide-details
                @change="displayTypeChange"></v-select>
    </div>

    <!--   数据列表   -->
    <div class="calendar">
      <v-calendar ref="calendar" :displayType="searchOption.displayType" :start="searchOption.datetime[0]" :end="searchOption.datetime[1]" :weekdays="weekday"
                  :type="searchOption.displayType" :events="events" interval-minutes="120" interval-height="66px"
                  event-overlap-mode="stack" :event-overlap-threshold="60" @change="getCalendarEvents" @click:event="clickEvent"
                  first-interval="3" interval-count="9" interval-width="50">
        <template v-slot:event="{ event }">
          <div style="line-height: 1;height: 100%;">
            <div v-if="event['user_id']===userId" style="display: flex;width: 100%;height: 100%;justify-content: space-between;align-items: center">
              <span class="ml-2" v-if="event.subject_type===2"> 科二 </span>
              <span class="ml-2" v-if="event.subject_type===3"> 科三 </span>
              <span class="mr-2" v-if="searchOption.displayType==='day'">{{event.sessionText}}场</span>
            </div>
            <div v-else style="display: flex;width: 100%;height: 100%;justify-content: space-between;align-items: center">
              <span class="ml-2">其他学员</span>
              <span class="mr-2" v-if="searchOption.displayType==='day'">{{event.sessionText}}场</span>
            </div>
          </div>
        </template>
      </v-calendar>
    </div>

    <v-btn color="blue" block dark x-large @click="logout"> 退出登录 </v-btn>

    <v-btn class="addAppointment" @click="addAppointment" fab dark color="indigo"  elevation="2"><v-icon dark>mdi-plus</v-icon></v-btn>



    <v-overlay light :opacity="0.8" :value="addAppointmentOverlay" >
      <v-card light style="margin-bottom: 25vh;">
        <v-card-title>
          <span class="headline">新增预约</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form :disabled="loadingSubmit" v-model="formRules.formValid" :lazy-validation="true" ref="form">

              <!--预约时间-->
              <v-row>
                <v-col cols="12">
                  <v-menu v-model="FilterMenuDateForm" :close-on-content-click="false"
                          transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="form.datetimeDate" label="预约日期" hide-details v-bind="attrs" v-on="on"
                                    :rules="formRules.datetimeRules"
                                    clearable/>
                    </template>
                    <v-date-picker first-day-of-week="1" v-model="form.datetimeDate" clearable></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-select :menu-props="{ offsetY: true }" :items="sessionTimeMap"
                            v-model="form.datetimeTime" label="选择场次" hint="选择场次" hide-details :rules="formRules.datetimeRules"></v-select>
                </v-col>
              </v-row>

            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="addAppointmentOverlay=false" :disabled="loadingSubmit"> 取消 </v-btn>
          <v-btn color="blue darken-1" text @click="submitForm" :loading="loadingSubmit"> 确定 </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </div>
</template>

<script>
import {
  addSubject23AppointmentApi,
  subject23AppointmentListApi
} from "@/api";

import {logout} from "@/utils/auth";
import {TpSqlBuilder} from "@/utils/tp-sql";
export default {
  name: 'Home',
  data() {
    return {
      types: [{text: '每月', value: 'month'}, {text: '每周', value: 'week'}, {text: '每天',value: 'day'}],
      weekday: [1, 2, 3, 4, 5, 6, 0],
      sessionTimeMap: [{text:'上午场 (08:00-10:00)',value:'08:00'},{text:'上午场 (10:00-12:00)',value:'10:00'},{text:'下午场 (14:00-16:00)',value:'14:00'},{text:'下午场 (16:00-18:00)',value:'16:00'},{text:'晚上场 (20:00-22:00)',value:'20:00'}],
      events: [],
      loading:false,
      FilterMenuDate: false,
      FilterMenuDateForm: false,
      addAppointmentOverlay:false,
      searchOption: {
        subjectType:null,
        displayType: 'week',
        createTime: [],
        datetime: [],
      },
      searchSqlType: {
        equal: ['status', 'coach.id', 'subjectType'],/* 精确查询 */
        strLike: ['user.realname'],/* 模糊查询 */
        dateBetween: ['createTime'],/* 日期范围查询 */
        datetimeBetween: ['datetime'],/* 日期时间范围查询 */
      },
      formRules: {
        autoValid: true,
        formValid: true,
        datetimeRules: [v => this.formRules.autoValid || !!v || '请选择日期'],
      },
      form: {
        datetimeDate: '',
        datetimeTime: '',
        status: 1,
      },
      loadingSubmit:false
    }
  },
  created() {

  },
  mounted() {
    console.log(this.coachId)
    this.fetchData()
  },
  computed: {
    coachId(){
      return this.$store.getters.user && this.$store.getters.user.coach && this.$store.getters.user.coach.id
    },
    userId(){
      return this.$store.getters.user && this.$store.getters.user.id
    },
    subjectType(){
      return this.$store.getters.user && this.$store.getters.user.statusSubject
    }
  },
  watch: {

  },
  methods: {
    logout(){
      if(confirm('确定退出登录吗？')){
        logout()
        setTimeout(()=>{
          location.reload()
        },0)
      }
    },
    submitForm(){
      this.formRules.autoValid = false
      if (!this.$refs.form.validate()) return this.formRules.autoValid = true
      if(confirm('确定添加吗？')){

        let data = {userId:this.userId,...this.form}
        data.datetime = data['datetimeDate'] + ' ' + data['datetimeTime']
        if(this.subjectType <=2){
          data.subjectType=2
        }else if(this.subjectType===3){
          data.subjectType=3
        }else{
          alert('您已完成科三考试，无需预约')
          return
        }
        delete data['datetimeDate']
        delete data['datetimeTime']

        this.loadingSubmit = true;
        addSubject23AppointmentApi(data).then(res => {
          if(res.status===201){
            this.addAppointmentOverlay=false
            this.formRules.autoValid = true
            this.fetchData();
          }
          res.msg && alert(res.msg.toString())
          this.loadingSubmit = false;
        }).catch(err => {
          alert('添加失败：'+err.toString())
        })
      }else{
        this.formRules.autoValid = true
      }
    },
    addAppointment(){
      this.addAppointmentOverlay=true
    },
    clickEvent(e){
      console.log(e)
      if(this.searchOption.displayType==='month' || this.searchOption.displayType==='week'){
        this.searchOption.datetime=[e.day.date]
        this.searchOption.displayType='day'
      }
    },
    getCalendarEvents({start, end}) {
      this.searchOption.datetime[0] = start.date
      this.searchOption.datetime[1] = end.date
      this.fetchData();
    },
    displayTypeChange() {
      this.searchOption.datetime = []
    },
    async fetchData() {
      // 处理搜索筛选
      let searchList = new TpSqlBuilder(this.searchSqlType, {'coach.id':this.coachId,...this.searchOption})

      let data = {
        page: 1,
        limit: -1,
        searchList
      }
      data.searchList = data.searchList.filter(item => !(item[0] === 'displayType'))

      this.loading = true
      let res = await subject23AppointmentListApi(data).catch(err => err)
      this.loading = false
      if (res.status === 200) {
        let list = [...res.list]
        this.count = res.count
        this.list = list

        let sessionTimeMap = new Map([
          [8, ['8:00', '9:00', '10:00']],
          [10, ['10:00', '11:00', '12:00']],
          [14, ['14:00', '15:00', '16:00']],
          [16, ['16:00', '17:00', '18:00']],
          [20, ['20:00', '20:30', '21:00', '21:30', '22:00']],
        ])
        let getDatetime = (datetimeStr, index, type = 'Start') => {
          let datetime = new Date(datetimeStr)
          let endDatetimeStr = this.$formatDate(datetime, false, "YYYY-MM-DD") + ' ' + sessionTimeMap.get(datetime.getHours())[type === 'End' ? index + 1 : index]
          return new Date(endDatetimeStr)
        }

        let sessionTextMap = ['上午(8:00-10:00)','上午(10:00-12:00)','下午(14:00-16:00)','下午(16:00-18:00)','晚上(20:00-22:00)']
        let colorMap = [
          ['blue accent-4','blue accent-3'],
          ['blue accent-2','blue accent-1'],
          ['orange darken-4','orange darken-3'],
          ['orange darken-2','orange darken-1'],
          ['brown darken-4','brown darken-3','brown darken-2','brown darken-1'],
        ]

        let datetimeCount = new Map()
        this.events = list.map(item => {
          datetimeCount.set(item.datetime, datetimeCount.has(item.datetime) ? datetimeCount.get(item.datetime) + 1 : 0)
          let curIndex = datetimeCount.get(item.datetime)
          let datetimeH = new Date(item.datetime).getHours()

          let sessionValue = (()=>[8,10,14,16,20].indexOf(datetimeH))();
          let sessionText = sessionTextMap[sessionValue];
          return {
            name: item.user_realname,
            start: getDatetime(item.datetime, curIndex, 'Start'),
            end: getDatetime(item.datetime, curIndex, 'End'),
            color: item['user_id']===this.userId?colorMap[sessionValue][curIndex]:'grey',
            sessionValue,
            sessionText,
            timed: true,
            ...item
          }
        });
        datetimeCount = null //回收垃圾
        sessionTimeMap = null //回收垃圾
        colorMap = null //回收垃圾
      }
    },
  }
}
</script>

<style lang="scss">
.home {
  .filterToolbar{
    margin-top: 4px;
    display: flex;
  }
  .calendar{
    overflow-x: scroll;
    .v-calendar[displayType=week]{
      min-width: 800px;
    }
  }
  .addAppointment{
    position: fixed;
    bottom: 8vh;
    right: 7vw;
  }
}
</style>