<template>
<div id="container">
    <!-- 顶部导航栏 -->
    <div style="width:100%;">
        <!-- <HeadNav v-bind:uid="uid" v-bind:username="username"></HeadNav> -->
        <HeadNav @getInfo="getInfo($event)"></HeadNav>
    </div>
    <!-- 左边导航栏 -->
    <div id="left_div" style="width:30%;float:left;">
        <p> </p>
        <LeftNav></LeftNav>
    </div>
    <!-- 中间的div   -->
    <div id="mid_div" style="width:40%;float:left;">
        <!-- 图片轮播 width: 80%;margin-left:10%;-->
        <div id="pic" class="carousel slide index_shadow_div" data-ride="carousel" 
            style="height: 300px;margin-top:20px;">
            <!-- 指示符 -->
            <ul class="carousel-indicators">
                <li data-target="#pic" data-slide-to="0" class="active"></li>
                <li data-target="#pic" data-slide-to="1"></li>
                <li data-target="#pic" data-slide-to="2"></li>
            </ul>
            <!-- 轮播图片 -->
            <div id="inner-pic" class="carousel-inner" style="height: 300px;width: 100%;">
                <div class="carousel-item active">
                    <img src="../assets/1.jpg" class="inner-pic-css rounded img-fluid">
                </div>
                <div class="carousel-item">
                    <img src="../assets/2.jpg" class="inner-pic-css rounded img-fluid">
                </div>
                <div class="carousel-item">
                    <img src="../assets/3.jpg" class="inner-pic-css rounded img-fluid">
                </div>
            </div>
            <!-- 左右切换按钮 -->
            <a class="carousel-control-prev" href="#pic" data-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </a>
            <a class="carousel-control-next" href="#pic" data-slide="next">
                <span class="carousel-control-next-icon"></span>
            </a>
        </div>
        <div style="text-align:center;margin-top:10px;margin-bottom:-10px;"><h6>最新发表</h6></div>
        <hr style="height:0px;">
        <!-- 展示最新的帖子 -->
        <div style="margin-top:2%;">
            <ShowMessages v-bind:messages="messaages" uid=""></ShowMessages>
        </div>
    </div>
    <!-- 右边登陆内容 -->
    <div id="right_div" style="width:30%;float:left;">

        <div style="margin-left:5.6%;height:340px;float: left;margin-top:20px;" class="rounded index_shadow_div">
            <div style="margin-left:10px;margin-right: 10px;margin-top:10px;float: left;">
                <h6 style="text-align:center;">账号登陆</h6>
                <!-- 用户名和密码的输入框 -->
                <input type="text" v-model="input_username" class="form-control username shadow_div" placeholder="用户名/UID">
                <input type="password" v-model="input_password" class="form-control password shadow_div" placeholder="密码">
                <!-- 验证码画布 -->
                <!-- <canvas id="codecanvas" class="codecanvas" height="40" width="80" v-on:click="creatCode"></canvas> -->
                <VerificationCode width="80" height="40" v-on:getCode="v_code = $event" v-if="showCode==true"></VerificationCode>

                <input type="text" v-model="input_code" class="form-control inputcode shadow_div" placeholder="验证码" @keydown.enter="login">
                <!-- 展示登陆结果 -->
                <p id="result" style="color: rgb(240,0,0);font-size:12px;margin-left:2px;">{{login_result}}</p>
                <button type="button" class="btn btn-primary btn-login" v-on:click="login">登陆</button>
                <p style="margin-top:8px;">还没有账号？
                    <router-link to="/Register/" style="color:rgb(255,160,0);text-decoration:none;" target="_BLANK" class="font_shadow">
                        现在注册
                    </router-link>
                </p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import HeadNav from '@/components/navigation/headNav';
import LeftNav from '@/components/navigation/leftNav';
import VerificationCode from '@/components/functions/verificationCode';
import ShowMessages from '@/components/functions/showMessages';
export default {
    name: 'index',
    components: {
        HeadNav,
        LeftNav,
        VerificationCode,
        ShowMessages
    },
    data() {
        return {
            showCode: true,
            user:null,
            // uid: '',
            // username: '',
            input_username: null,
            input_password: null,
            input_code: null,
            v_code: null,
            login_result: null,
            messaages: null,

        }
    },
    created(){
        //this.getInfo();
    },
    mounted() {
        this.getNewMessage();
    },
    methods: {
        //获取最新发表的帖子
        getNewMessage:function(){
            axios
                .post("/api/getNewMessage")
                .then(response=>{
                    //console.log(response);
                    if(response.data!=null)
                        this.messaages=response.data;
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取个人信息，检查是否已经登录
        getInfo:function(data){
            console.log("index--receieve user Info...");
            
            this.user=data;
            if(this.user.UID!=null&&this.user.UID!="")
                location.replace("/#/Home/");
            // axios
            //     .post("/api/getInfo")
            //     .then(response =>{
            //         //console.log(response);
            //         if(response.data.UID!=null&&response.data.UID!="")
            //             location.replace("/#/Home/");
            //     })
            //     .catch(function(error){
            //         console.log(error);
            //     });
        },
        //登陆
        login: function () {
            console.log("login...");
            //console.log(this.v_code);
            if (this.input_username == null || this.input_username == "" || this.input_password == null || this.input_password == "") {
                this.login_result = "用户名和密码不能为空";
                return;
            }
            if (this.input_code == null || this.input_code == "") {
                this.login_result = "验证码为空";
                return;
            }
            if (this.input_code != this.v_code) {
                this.login_result = "验证码错误";
                this.fleshCode();
                return;
            } else console.log("验证码正确");

            //ajax登陆
            axios
                .post("/api/login", {
                    "Username": this.input_username,
                    "Password": this.input_password
                })
                .then(response => {
                    //console.log(response);
                    if (response.data == "success")
                        location.href = "/#/Home/";
                    else if (response.data == "user not exist") {
                        this.login_result = "用户不存在";
                        this.fleshCode();
                    } else if (response.data == "password incorrect") {
                        this.login_result = "密码错误";
                        this.fleshCode();
                    } else this.login_result = "未知错误";

                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //刷新验证码
        fleshCode: function () {
            this.showCode = false;
            this.$nextTick(() => {
                this.showCode = true;
            });
        },

    }
}
</script>

<style>
@import url("../lib/css/index.css");

body {
    background-image: linear-gradient(to bottom right, #FFDAB9, #FFFFF0);
    background-repeat: no-repeat;
    background-attachment: fixed;   
    /* background-color: rgb(245,245,245); */
}
</style>
