<template>
<div>
    <div>
        <!-- 标题 -->
        <div class="register-title">
            <h2><span class="my_tilte">小窗户-分享你的生活</span></h2>
        </div>
        <!-- 中间的主体-->
        <div class="rounded shadow_div register_mid_div">
            <!-- <form> -->
                <h5 style="text-align: center;margin: 10px;">注册账号</h5>
                <input class="form-control r_username" v-model="input_username" type="text" placeholder="请输入用户名" style="text-indent:16px;" required>
                <input class="form-control r_password" v-model="input_password1" type="password" placeholder="请输入密码" style="text-indent:16px;" required>
                <input class="form-control r_password" v-model="input_password2" type="password" placeholder="确认密码" style="text-indent:16px;" required>
                <VerificationCode height="40" width="80" v-on:getCode="v_code=$event" v-if="showCode==true"></VerificationCode>
                <input type="text" class="form-control" placeholder="验证码" v-model="input_code" style="width:80px;margin-top:10px;">
                <p style="color: rgb(240,0,0);font-size:12px;margin-left:2px;margin-top:4px;">
                    {{input_result}}
                </p>
                <button v-on:click="register" style="width: 80px;" class="btn btn-primary">注册</button>
            <!-- </form> -->
        </div>
        <!-- 1 -->

        <!-- 模态框 -->
        <div class="modal fade" id="myModal" style="margin-top:10%;">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" style="color:#8B5A2B;">注册结果</h5>
                        <button class="close" type="button" data-dismiss="modal"><span v-html="">&times</span></button>
                    </div>
                    <div class="modal-body" id="modalBody" style="text-align: center;">
                        <p class="text-info">{{modal_result}}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" type="button" data-dismiss="modal">好的</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import VerificationCode from '@/components/functions/verificationCode';
import axios from 'axios';
export default {
    name: 'register',
    components: {
        VerificationCode
    },
    data() {
        return {
            v_code: null,
            showCode: true,
            input_username: null,
            input_password1: null,
            input_password2: null,
            input_code: null,
            showModal: false,
            modal_result: "正在等待结果，请稍候...",
            input_result: null
        }
    },
    methods: {
        //注册帐号
        register: function () {
            //this.showModal = true;
            if (this.input_username == null || this.input_username == "" || this.input_password1 == null || this.input_password1 == "" || this.input_password2 == null || this.input_password2 == "") {
                this.input_result = "每一项都不能留空";
                return;
            } else {
                if (this.input_username.length <2) {
                    this.input_result = "用户名太短了，应该至少2个字";
                    return;
                }
                if (this.input_username.length > 14) {
                    this.input_result = "用户名太长了，应该小于15个字";
                    return;
                }
                if (this.input_password1 != this.input_password2) {
                    this.input_result = "两次密码输入不匹配";
                    return;
                } else if (this.input_password1.length <= 5) {
                    this.input_result = "密码太短了，应该大于5个字符";
                    return;
                }
                if (this.input_code != this.v_code) {
                    this.input_result = "验证码错误";
                    this.flesh_code();
                    return;
                }
            }
            //开启模态框
            $("#myModal").modal("show");

            //ajax请求注册
            axios
                .post("/api/register", {
                    "Username": this.input_username,
                    "Password": this.input_password1
                })
                .then(response => {
                    console.log(response.data);
                    if (response.data == "success") {
                        this.modal_result = "注册成功！";
                        this.input_username="";
                        this.input_password1="";
                        this.input_password2="";
                        this.input_code="";
                        this.input_result="";
                        this.flesh_code();
                    } else if (response.data == "user exist") {
                        this.modal_result = "用户已存在！";
                        this.input_code="";
                        this.input_result="";
                        this.flesh_code();
                    } else if (response.data == "success") {
                        this.modal_result = "注册失败！";
                        this.input_code="";
                        this.input_result="";
                        this.flesh_code();
                    }
                })
                .catch(function(error){
                    console.log(error); 
                });

        },
        //刷新验证码
        flesh_code: function () {
            this.showCode = false;
            this.$nextTick(() => {
                this.showCode = true;
            });
        }
    }
}
</script>

<style>
@import url("../lib/css/shadow.css");
.r_username{
	border-radius: 4px;
	margin-top:10px;
	width:99.5%;
	height: 40px;
	/* border: 1px solid ;  */
	background:url('../assets/account.png') 8px 10px no-repeat;
	padding-left: 32px; 
}
.r_password{
	margin-top:10px;
	width:99.5%;
	height: 40px;
	border-radius: 4px;
	/* border-radius:4px; */
	/* border: 1px solid ;  */
	background:url('../assets/password.png') 8px 10px no-repeat;
	padding-left: 32px; 
}

body {
    background: rgb(245,245,245);
    /* background-image: linear-gradient(to bottom right, #FFDAB9, #FFFFF0);
    background-repeat: no-repeat;
    background-attachment: fixed; */
}

.register_mid_div {
    position: fixed;
    top: 10%;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 300px;
    padding: 20px;
    padding-top: 5px;
    /* height: 400px; */
    /* transform: translate(-50%, -50%); */
    background-color: rgba(255, 255, 255, 1);
}
.register-title{
        text-align: center;
        margin-top:-50px;
        color:rgb(205,133,63);
}
@media screen and (max-width: 500px){
    .register-title{
        margin-top: -50px;
        color:rgb(205,133,63);
        text-align: center;
        width: 100%;
    }
    body {
        background: rgb(245,245,245);
        /* background-image: linear-gradient(to bottom right, #FFDAB9, #FFFFF0);
        background-repeat: no-repeat;
        background-attachment: fixed; */
        
    }
    .register_mid_div {
        width: 80%;
        position: fixed;
        top:10%;
        left: 0;
        right: 0;
        margin: 0 auto;
        background-color: rgba(255, 255, 255, 1);
    }

}
</style>
