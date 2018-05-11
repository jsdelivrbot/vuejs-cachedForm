<template>
    <div>
        <h6>{{ title }}<small> ({{ subTitle }})</small></h6>
        <div class="form-group">
            <label for="corp_id">Corporate</label>
            <select name="corp_id" id="corp_id" v-model="datas.corp_id" class="form-control" @change="controlMethod">
                <option value="0">Choose</option>
                <option v-for="corp in corporates" :value="corp.id">{{ corp.name }}</option>
            </select>
        </div>
        <div class="form-group">
            <label for="corp_id">Grades</label>
            <select name="grade_id" id="grade_id" v-model="datas.grade_id" class="form-control" @change="controlMethod">
                <option value="0">Choose</option>
                <option v-for="grd in grades" :value="grd.id">{{ grd.name }}</option>
            </select>
        </div>

        <div class="form-group">
            <label for="corp_id">Courses</label>
            <select name="course_id" id="course_id" v-model="datas.course_id" class="form-control" @change="controlMethod">
                <option value="0">Choose</option>
                <option v-for="crs in courses" :value="crs.id">{{ crs.name }}</option>
            </select>
        </div>

        <div class="form-group">
            <label for="corp_id">Difficult Score</label>
            <select name="dfc_score" id="dfc_score" v-model="datas.dfc_score" class="form-control" @change="controlMethod">
                <option value="0">Choose</option>
                <option v-for="scr in score" :value="scr.id">{{ scr.name }}</option>
            </select>
        </div>

        <div class="form-group">
          <label for="">Tags</label>
          <input type="text" name="tags" class="form-control" value="" @change="controlMethod">
        </div>

    </div>
</template>

<script>
import swal from 'sweetalert';
    export default {
        name: 'stepOne',
        data(){
            return  {
                corporates : [{  "id" : 1, "name" : "dummy data" }],
                grades : [{"id" : 1, "name" : "dummy data"}],
                courses : [
                    {"id" : 1, "name" : "Matematik"},
                    {"id" : 2, "name" : "Fizik"},
                    {"id" : 3, "name" : "Biyoloji"},
                ],
                score : [
                    {"id" : 1, "name" : "Beginner"},
                    {"id" : 2, "name" : "Easy"},
                    {"id" : 3, "name" : "Normal"},
                    {"id" : 4, "name" : "Hard"},
                    {"id" : 5, "name" : "Very Hard"},
                ],
                error: {},
                token : "",
                method: "Create",
                baseURL : "http://your_api_domain.com/api/v1/",
                CacheStatus: false,
                CachedId: 0,
                datas : {
                  corp_id : 0,
                  grade_id : 0,
                  course_id : 0,
                  dfc_score : 0,
                  type : "Task Data Type",
                  text : "Task Data Text",
                  answer : "Task Data Answer",
                  task: 1
                }
            }
        },
        mounted(){
          this.takeToken();
          this.loader();
        },
        props:{
            title : {
                type: String,
                default: "Question Settings"
            },
            subTitle: {
                type: String,
                default: "global question settings"
            },

            auth : {
              type: Object,
              default: () => ({
                client_id : {
                  type: String,
                  default : ""
                },
                client_secret : {
                  type: String,
                  default: ""
                },
                email : {
                  type: String,
                  default: ""
                },
                password : {
                  type: String,
                  default: ""
                }
              })
            }
        },
        methods: {
            takeToken(){
              if ( this.token === "" &&
                    ( !window.localStorage.getItem("_token") ||
                      window.localStorage.getItem("_token") === undefined )){
                      axios.post(
                            globalRoutes.login,
                            {
                            	"grant_type" : "password",
                            	"client_id" : auth.client_id,
                            	"client_secret" : auth.client_secret,
                              "email" : auth.email,
                            	"password" : auth.password,
                            	"scope" : "*"
                            }
                          )
                        .then(response => {
                          this.token = response.data.data["_token"];
                          window.localStorage.setItem("_token", response.data.data["_token"]);
                        })
                        .catch(error => {this.error = error});
              }else{
                this.token = window.localStorage.getItem("_token");
              }
            },
            loader(){
              this.LoadCorporates();
              this.LoadGrades();
              this.ControlCache();
            },
            LoadCorporates(){
              axios.get(globalRoutes["corporates"], {headers: {'Authorization': "Bearer " + this.token}})
                  .then(response => {
                    this.corporates = response.data.data;
                  })
                  .catch(error => {this.error = error});
            },
            LoadGrades(){
              axios.get(globalRoutes["grades"], {headers: {'Authorization': "Bearer " + this.token}})
                  .then(response => {
                    this.grades = response.data.data;
                  })
                  .catch(error => {this.error = error});
            },
            // LoadCourses(){
            //   axios.get(globalRoutes["courses"], {headers: {'Authorization': "Bearer " + this.token}})
            //       .then(response => {
            //         this.courses = response.data.data;
            //       })
            //       .catch(error => {this.error = error});
            // }
            ControlCache(){
              if( localStorage.getItem("cache") )
              {
                this.CacheStatus = true;
                this.CachedId = localStorage.getItem("cache");
                swal({
                  title: "Taslak soru bulundu",
                  text: "Tasklağa devam etmek istiyormusunuz?",
                  icon: "info",
                  buttons: {
                      cancel: true,
                      warning: {
                        text: "Hayır, Sil!",
                        value: "defeat",
                        class: "warning"
                      },
                      load: {
                        text: "Evet, Kalsın!",
                        value: "load",
                      }
                  },
                  dangerMode: false
                })
                .then((value) => {
                  switch (value) {
                     case "defeat":
                        this.removeCacheData();
                     case "load":
                        this.loadCache();
                       break;
                     default:

                   }
                });

              }
            },
            controlMethod(){
                if ( this.method == "Create" ) {
                  this.method = "Update";
                  this.CacheStatus = true;
                  this.CreateFormData();
                }else{
                  this.UpdateFormData()
                };
            },
            CreateFormData(){
              axios.post(window.globalRoutes["saveQuestion"], this.datas,  {headers: {'Authorization': "Bearer " + this.token}})
                .then(response => {
                  this.CachedId = response.data.data.id;
                  window.localStorage.setItem("cache", response.data.data.id);
                })
                .catch(error => {

                })
            },
            UpdateFormData(){
              axios.put(this.baseURL + "questions/basic/"+this.CachedId, this.datas,  {headers: {'Authorization': "Bearer " + this.token}})
                .then(response => {
                  this.CachedId = response.data.data.id;
                  window.localStorage.setItem("cache", response.data.data.id);
                })
                .catch(error => {
                  console.log(error);
                })
            },
            loadCache(){
              axios.get(this.baseURL + "questions/basic/"+this.CachedId,  {headers: {'Authorization': "Bearer " + this.token}})
                .then(response => {
                  this.datas.corp_id = response.data.data.corp_id;
                  this.datas.grade_id = response.data.data.grade_id;
                  this.datas.course_id = response.data.data.course_id;
                  this.datas.dfc_score = response.data.data.dfc_score;
                  this.method = "Update";
                  this.CacheStatus = true;
                  this.CachedId = response.data.data.id;
                })
                .catch(error => {
                  console.log(error);
                })
            },
            removeCacheData(){
              window.localStorage.removeItem("cache");
            }
        }
    }
</script>

<style scoped>
</style>
