require('./bootstrap');
window.Vue = require('vue');

window.globalRoutes = {
  "login" : "http://your_api_domain.com/api/v1/login",
  "corporates" : "http://your_api_domain.com/api/v1/corporates",
  "grades" : "http://your_api_domain.com/api/v1/grades",
  "courses" : "http://your_api_domain.com/api/v1/courses",
  "saveQuestion" : "http://your_api_domain.com/api/v1/questions/basic",
};

// Vue.component('example-component', require('./components/ExampleComponent.vue'));
Vue.component('stepOne', require('./components/cached-form/stepOne.vue'));
Vue.component('stepTwo', require('./components/cached-form/stepTwo.vue'));
Vue.component('stepLast', require('./components/cached-form/stepLast.vue'));
Vue.component('App', require('./components/cached-form/App.vue'));

const app = new Vue({
    el: '#app'
});
