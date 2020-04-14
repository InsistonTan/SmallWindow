<template>
<div>
    <!-- 顶部导航栏 -->
    <div style="width:100%;">
        <HeadNav @getInfo="getInfo($event)"></HeadNav>
    </div>
    <!-- 左边导航栏 -->
    <div style="width:30%;float:left;height:100%;">
        <!-- 副导航栏 -->
        <div class="leftNav_div">
            <nav class="rounded nav nav-pills fixed-top nav justify-content-center leftNav">
                <ul class="navbar-nav nav_item">
                    <div>
                        <li class="nav-item">
                            <a href="#">热门</a>
                        </li>
                    </div>
                    <div>
                        <li class="nav-item">
                            <a href="#">热门</a>
                        </li>
                    </div>
                    <div>
                        <li class="nav-item">
                            <a href="#">热门</a>
                        </li>
                    </div>
                    <div>
                        <li class="nav-item">
                            <a href="#">热门</a>
                        </li>
                    </div>
                    <div>
                        <li class="nav-item">
                            <a href="#">热门</a>
                        </li>
                    </div>
                    <div>
                        <li class="nav-item">
                            <a href="#">热门</a>
                        </li>
                    </div>
                </ul>
            </nav>
            <p></p>
        </div>
    </div>
    <!-- 中间的主体 -->
    <div style="width:40%;float:left;">
        <!-- 发表帖子的输入框 -->
        <div style="margin-top:20px;">
            <textarea class="rounded input_area" v-model="input_content" cols="72" rows="5" placeholder="写下你的心情...">
            </textarea>
            <button type="button" class="btn_submit" style="width:60px;height:30px;font-size:12px;" v-on:click="submitMessage" title="点击发表">发表
            </button>
            <span style="color:red;font-size:14px;margin-left:10px;">{{submit_result}}</span>
        </div>
        <hr style="height:10px;">
        <!-- 展示帖子 -->
        <div id="MessageBody">
            <ShowMessages v-bind:messages="messages" v-bind:uid="uid" @reload="getMessages"></ShowMessages>
        </div>
    </div>
    <!-- 右边展示个人信息的div -->
    <div style="width:30%;float:left;">
        <div class="rounded infoShow"> 
            <div style="text-align:center; padding-top:15px;">
                <a href="#"><img src="../../assets/bigUser.png" alt="账号图片"></a>
            </div>
            <div style="text-align:center;">
                <router-link :to="{path:'/Visit/',query:{uid:uid}}" class="font_shadow" style="text-decoration:none;color:rgb(205,133,63);">
                    {{username}}
                </router-link>
                <!-- <a id="username" class="font_shadow" href="#" style="text-decoration:none;color:rgb(205,133,63);">
                    {{username}}
                </a> -->
            </div>
            <hr>
            <div style="padding-top:5px;text-align:center;padding-bottom:15px;">
                <span class="infoText">关注</span>
                <span>
                    <b><a href="#" style="text-decoration:none;" class="font_shadow">{{follow_num}}</a></b>
                </span>
                <span class="infoText">粉丝</span>
                <span>
                    <b><a href="#" style="text-decoration:none;" class="font_shadow">{{fan_num}}</a></b>
                </span>
                <span class="infoText">帖子</span>
                <span>
                    <b><a href="#" style="text-decoration:none;" class="font_shadow">{{message_num}}</a></b>
                </span>
            </div>
        </div>
    </div>
    <!-- 消息框组件 -->
    <MyModal :show="show_modal" :title="title" @confirm="close_modal" @close="close_modal"></MyModal>
</div>
</template>

<script>
import HeadNav from "@/components/navigation/headNav";
import LeftNav from "@/components/navigation/leftNav";
import ShowMessages from "@/components/functions/showMessages";
import MyModal from "@/components/functions/myModal";
import axios from "axios";
import {
    show
} from "../../lib/js/functions.js";
export default {
    name: 'home',
    components: {
        HeadNav,
        LeftNav,
        ShowMessages,
        MyModal
    },
    data() {
        return {
            user: null,
            uid: '',
            username: 'username',
            follow_num: 0,
            fan_num: 0,
            message_num: 0,
            messages: null,
            input_content: null,
            submit_result: null,
            show_modal: false,
            title: null
        }
    },
    created() {
        //this.getInfo();
        //show();
    },
    mounted() {
        this.getMessages();
    },
    methods: {
        //关闭消息框
        close_modal() {
            this.show_modal = false;
            if (this.uid == "" || this.uid == null)
                location.replace("/");
        },
        //获取个人信息，检查是否已经登录
        getInfo: function (data) {
            console.log("home--receieve info");

            //this.user=data;
            if (data.UID == null || data.UID == "") {
                this.title = "你还未登陆,请先登陆";
                this.show_modal = true;
                //location.href = "/";
            } else {
                this.uid = data.UID;
                this.username = data.Username;
                this.follow_num = data.followNum;
                this.fan_num = data.fanNum;
                this.message_num = data.messageNum;
            }

            // axios
            //     .post("/api/getInfo")
            //     .then(response => {
            //         //console.log(response);
            //         if (response.data.UID != null && response.data.UID != "") {
            //             this.uid = response.data.UID;
            //             this.username = response.data.Username;
            //             this.follow_num = response.data.followNum;
            //             this.fan_num = response.data.fanNum;
            //             this.message_num = response.data.messageNum;
            //         } else {
            //             alert("你还未登陆");
            //             location.href = "/";
            //         }
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     });
        },
        //获取关注者的帖子和自己的帖子
        getMessages: function () {
            axios
                .post("/api/getFollowMessage")
                .then(response => {
                    this.messages = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        submitMessage: function () {
            //alert(this.input_content);
            if (this.input_content == null || this.input_content == "") {
                this.title = "输入的内容为空，请检查";
                this.show_modal = true;
                return;
            }
            if (this.input_content.length > 2000) {
                this.submit_result = "输入内容太长了，应该小于2000个字";
                return;
            }
            //axios请求发帖
            axios
                .post("/api/insertMessage", {
                    "content": this.input_content
                })
                .then(response => {
                    //console.log(response.data);
                    if (response.data == "success") {
                        this.input_content = null;
                        this.submit_result = null;
                        this.title = "发表成功！";
                        this.show_modal = true;
                        this.getMessages();
                    } else {
                        //this.submit_result="发表失败！";
                        this.title = "发表失败！";
                        this.show_modal = true;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}
</script>

<style>
@import url("../../lib/css/home.css");
@import url("../../lib/css/shadow.css");
@import url("../../lib/css/leftNav.css");
.input_area{
    background-color:rgba(255,255,255,0.5);
    width:100%;
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
}
.input_area:hover{
    background-color:rgba(255,255,255,0.9);
}
.infoShow{
    margin:10%;
    margin-top:20px;
    margin-left:5.6%;
    background-color:rgba(255,255,255,0.8);
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
}
.infoShow:hover{
    background-color:rgba(255,255,255,1);
}
.btn_submit {
    border: none;
    border-radius: 2px;
    background: rgb(205, 133, 63);
    color: rgb(250, 250, 250);
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
}

.btn_submit:hover {

    background: rgb(162, 107, 53);
    color: rgb(250, 250, 250);
}

body {
    /* background-color: rgb(245, 245, 245); */
    background-image: linear-gradient(to bottom right, #F5DEB3, #FFFFF0);
    background-repeat:no-repeat;
    background-attachment: fixed;
    /* animation: my_animation 16s infinite linear;
    -webkit-animation: my_animation 32s infinite linear;    */
}

@keyframes my_animation {
    0% {
        background: #F5DEB3;
        /* background-image: linear-gradient(to bottom right, #BBFFFF, #FFFFF0); */
    }

    50% {
        background: #BBFFFF;
        /* background-image: linear-gradient(to bottom right, #7FFFD4, #FFFFF0); */
    }

    100% {
        background: #F5DEB3;
        /* background-image: linear-gradient(to bottom right, #F5DEB3, #FFFFF0); */
    }
}
</style>
