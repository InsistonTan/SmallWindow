<template>
<div>
    <div class="login-title-div">
        <h2>登陆小窗户</h2>
    </div>

    <div id="login-mid-div" class="index_shadow_div">
        <h6 style="text-align:center;">账号登陆</h6>
        <!-- 用户名和密码的输入框 -->
        <input type="text" v-model="input_username" class="form-control username " placeholder="用户名/UID">
        <input type="password" v-model="input_password" class="form-control password " placeholder="密码">
        <!-- 验证码画布 -->
        <!-- <canvas id="codecanvas" class="codecanvas" height="40" width="80" v-on:click="creatCode"></canvas> -->
        <VerificationCode width="80" height="40" v-on:getCode="v_code = $event" v-if="showCode==true"></VerificationCode>

        <input type="text" v-model="input_code" class="form-control inputcode" placeholder="验证码" @keydown.enter="login">
        <!-- 展示登陆结果 -->
        <p id="result" style="color: rgb(240,0,0);font-size:12px;margin-left:2px;">{{login_result}}</p>
        <button type="button" class="btn  btn-login" v-on:click="login">登陆</button>
        <p style="margin-top:8px;">还没有账号？
            <router-link to="/Register/" style="color:rgb(255,160,0);text-decoration:none;" target="_BLANK" class="font_shadow">
                现在注册
            </router-link>
        </p>
    </div>
</div>
</template>

<script>
import VerificationCode from '@/components/functions/verificationCode';
import axios from "axios";

var last_path=null;//上一个页面的地址，即从什么页面进入登陆页面
export default {
    name: 'login',
    components: {
        VerificationCode
    },
    data() {
        return {
            v_code: null,
            showCode: true,
            input_username: null,
            input_password: null,
            input_code: null,
            login_result: null,
        }
    },
    created(){
        this.getInfo();
    },
    mounted(){
        //console.log("last_path:"+last_path);
    },
    beforeRouteEnter (to, from, next) {
        if(last_path==null)
            last_path=from.path;
        next();
    },
    methods: {
        //获取个人信息，检查是否已经登录
        getInfo: function () {
            axios
                .post("/api/getInfo")
                .then(response => {
                    if (response.data.UID != null && response.data.UID != "") {
                        window.location.replace("/#/Home/");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
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
                    if (response.data == "success"){
                        if(last_path=="/"){
                            window.location.replace("/#/Home/");
                        }
                        //否则返回上一页
                        else{
                            history.back(-1);
                        }
                    }   
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
    background: rgb(245, 245, 245);
}

#login-mid-div {
    border-radius: 4px;
    padding: 10px;
    width: 20%;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 1);
    margin-top: 20px;
}

.login-title-div {
    margin-top: 0px;
    color:rgb(205,133,63);
    text-align: center;
    width: 100%;
}

@media screen and (max-width: 500px) {
    .login-title-div {
        margin-top: -40px;
        color:rgb(205,133,63);
        text-align: center;
        width: 100%;
    }
    body {
        background: rgb(245, 245, 245);
    }

    #login-mid-div {
        margin: 10px;
        padding: 10px;
        width: 90%;
        position: fixed;
        top: 40%;
        left: 47%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        background-color: rgba(255, 255, 255, 1);
        margin-top: 20px;
    }
}
</style>
