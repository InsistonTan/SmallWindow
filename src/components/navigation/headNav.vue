<template>
<div>
    <nav class="navbar navbar-expand-sm fixed-top headNav" style="height:60px;">
        <a href="#" class="logo" v-on:click="goHome">
            <img src="../../assets/logo2.png" alt="Logo" class="navbar-brand logo_img">
        </a>
        <!-- 搜索框 -->
        <input type="text" class="form-control search_input" v-model="input_search"
               @keydown.enter="search">
        <span style="margin-left: 10px;" v-on:click="search" class="search_img">
            <img class="head_img" src="../../assets/search.png" alt="search" style="width: 20px;height: 20px;">
        </span>
        
        <ul class="navbar-nav">
            <div class="nav_item_div" @click="goHome">
                <li class="nav-item active">
                    <img src="../../assets/home.png" alt="home" style="width: 20px;height: 20px;">
                    <span>首页</span>
                </li>
            </div>
            <div class="nav_item_div" @click="goHome" style="margin-left:10px;" v-if="uid==null||uid==''">
                <li class="nav-item active">
                    <img src="../../assets/user.png" alt="user" style="width: 20px;height: 20px;">
                    <span>登陆</span>
                </li>
            </div>
            <!-- <img src="../../assets/user.png" alt="account" class="user_img">
            <li class="nav-item" id="loginNav" v-if="uid==null||uid==''">
                <router-link to="/" class="nav-link font_shadow navText">登陆</router-link>
            </li> -->
            <li class="nav-item" style="margin-left:-25px;" v-if="uid==null||uid==''">
                <router-link to="/Register/" class="nav-link font_shadow navText" target="_BLANK">注册</router-link>
            </li>

            <li class="nav-item" v-if="uid!=null&&uid!=''" style="margin-left:10px;">
                <router-link :to="{path:'/Visit/',query:{uid:uid}}" class="nav-link font_shadow nav_user" style='color:rgb(205,133,63);'>
                    <img src="../../assets/user.png" alt="user" style="width: 20px;height: 20px;">
                    <span>
                        {{username}}
                    </span>
                </router-link>
            </li>
            <li class="nav-item" id="changeNav" v-if="uid!=null&&uid!=''">
                <a class="nav-link font_shadow navText" href="#" style='margin-left:20px;' v-on:click="safe_exit">
                    安全退出
                </a>
            </li>
        </ul>
    </nav>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'headNav',
    props: ['search_key'],
    //inject:['reload'],
    data() {
        return {
            uid:null,
            username:null,
            input_search:null
        }
    },
    created(){
        this.getInfo();
    },
    mounted(){
        this.input_search=this.search_key;
    },
    methods: {
        //获取个人信息，检查是否已经登录
        getInfo: function () {
            console.log("headNav-getInfo...");
            
            axios
                .post("/api/getInfo")
                .then(response => {
                    if(response.data.UID!=null&&response.data.UID!=""){
                        this.uid=response.data.UID;
                        this.username=response.data.Username;
                    }
                    this.$emit("getInfo",response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        search:function() {
            location.href="/#/Search/?key="+this.input_search;
            //alert(location.pathname);
            //ajax提交搜索的key
            // axios
            //     .post("/api/search?keyword="+this.input_search)
            //     .then(response=>{
            //         console.log(response.data);
            //         if(response.data=="success"){
            //             if(this.$route.name=="Search")
            //                 this.reload();
            //             else location.href="/#/Search/";
            //         }
            //         else alert("搜索失败");
            //     })
            //     .catch(function(error){
            //         console.log(error);
                    
            //     });
        },
        goHome:function() {
            if (this.uid == null || this.uid == "")
                location.href = "/";
            else
                location.href = "/#/Home/";
        },
        safe_exit:function() {
            axios
                .post("/api/clearInfo")
                .then(response => {
                    if(response.data=="clearInfo success")
                        location.href = "/";
                    else alert("退出失败");
                })
                .catch(function (error) {
                    console.log(error);
                });
            
        }
    }
}
</script>

<style>
@import url("../../lib/css/shadow.css");
.nav_item_div{
    width:80px;
    font-size: 14px;
    margin-top: 10px;
    margin-left: 300px;
    overflow: hidden;
}
.nav_item_div:hover{
    cursor: pointer;
    color: rgb(205,133,63);
}
.nav_item_div img{
    margin-top: -3px;
}
.nav_item_div:hover img,.nav_user:hover img{
    transform: translateY(-500px);
    filter: drop-shadow(#cd853f 0 500px);
}

.headNav {
    background-color: rgba(255, 255, 255, 0.6);
    transition: background-color 0.5s;
    overflow:hidden;
    box-shadow:0px 0px 5px rgb(220,220,220);
}

.headNav:hover {
    background-color: rgba(255, 255, 255, 1);
}

.navText {
    font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
    font-size: 14px;
    color: rgb(100, 100, 100);
    margin-top: 2px;
}

.logo {
    margin-left: 10%;
}

.logo_img {
    width: 60px;
    height: 40px;
}

.search_input {
    background: rgba(255, 255, 255, 0);
    width: 400px;
    height: 30px;
}

.user_img {
    width: 18px;
    height: 18px;
    margin-top: 12px;
    margin-left: 80px;
}
.search_img:hover{
    cursor: pointer;
}

.search_img:hover img{
    transform: translateY(-500px);
    filter: drop-shadow(#cd853f 0 500px);
}
</style>
