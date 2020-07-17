<template>
<div id="main-div">
    <nav class="fixed-top headNav">
        <div class="logo div-float-left" v-on:click="goHome">
            <img src="../../assets/logo2.png" alt="Logo" class="navbar-brand logo_img">
        </div>
        <!-- 移动端的头像下拉框 -->
        <div class="user-drop drop div-float-left" style="margin-top:5px;padding-right:20px;padding-left:10px;">
            <div class="drop-title" @click="showDrop">
                <!-- <img src="../../assets/menu.svg" style="width:20px;height:20px;" alt="头像"> -->
                <span v-if="headImg==null||headImg=='null'" class="nav-user-text">
                    <img class="headNav_headImg" src="../../assets/bigUser.png" alt="头像">
                </span>
                <span v-else>
                    <img class="headNav_headImg" :src="headImg" alt="头像">
                </span>
            </div>
            <!-- 用户菜单内容 -->
            <transition name="userDrop">
                <div class="drop-content" v-if="showUserDrop==true">
                    <!-- 没登陆时的菜单 -->
                    <div v-if="uid==null||uid==''" style="text-align:center;">
                        <div style="padding:5px;">
                            <img style="width:60px;height:60px;border-radius:30px;border:white solid 4px;" src="../../assets/bigUser.png" alt="头像">
                        </div>
                        <hr style="margin-top:5px;margin-bottom:5px;">
                        <div class="drop-item">
                            <router-link to="/Login/">登陆-注册</router-link>
                        </div>
                    </div>
                    <!-- 登陆后的菜单 -->
                    <div v-else>
                        <!-- 用户头像及用户名 -->
                        <div @click="go('/#/Visit/?uid='+uid)" style="background:rgb(245,245,245);padding:15px 10px 20px 20px;">
                            <!-- 头像 -->
                            <img v-if="headImg==null||headImg=='null'" style="width:60px;height:60px;border-radius:30px;border:white solid 4px;" src="../../assets/bigUser.png" alt="头像">
                            <img v-else style="width:60px;height:60px;border-radius:30px;border:white solid 4px;" :src="headImg" alt="头像">
                            <div style="margin-top:5px;">
                                <b style="color:rgb(205,133,63);font-size:16px;padding-left:6px;">{{username}}</b>
                                <span class="text-muted" style="margin-left:5px;font-size:13px;">{{login_user.registerTime}}</span>
                            </div>
                        </div>
                        <div class="text-muted" style="width:100%;background:white;font-size:14px;">
                            <div @click="go('/#/MultiPage/?action=seeMyMsg')" class="block-item">
                                <div>{{login_user.messageNum}}</div>
                                <div>小窗</div>
                            </div>
                            <div @click="go('/#/MultiPage/?action=seeMyFollow')" class="block-item">
                                <div>{{login_user.followNum}}</div>
                                <div>关注</div>
                            </div>
                            <div @click="go('/#/MultiPage/?action=seeMyFan')" class="block-item">
                                <div>{{login_user.fanNum}}</div>
                                <div>粉丝</div>
                            </div>
                        </div>
                        <div class="drop-item" @click="showUserDrop=false;;goHome();">
                            <img src="../../assets/menu-home.svg" alt="home">
                            首页
                        </div>
                        <div class="drop-item" @click="go('/#/MultiPage/?action=seeMyCollectMsg')">
                            <img src="../../assets/menu-collect.svg" alt="home">
                            我的收藏
                        </div>
                        <div class="drop-item" @click="go('/#/MultiPage/?action=seeMyLikeMsg')">
                            <img src="../../assets/menu-like.svg" alt="home">
                            我的点赞
                        </div>
                        <div class="drop-item" @click="go('/#/MultiPage/?action=seeMyCommentMsg')">
                            <img src="../../assets/menu-comment.svg" alt="home">
                            我的评论
                        </div>
                        <div class="drop-item" @click="safe_exit()">
                            <img src="../../assets/menu-exit.svg" alt="home">
                            退出
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="over">
            <div class="drop-over" v-if="showUserDrop==true" @click="closeDrop"></div>
        </transition>

        <!-- 搜索框 -->
        <div class="div-float-left">
            <input type="text" class="form-control search_input" placeholder="搜索..." v-model="input_search" @keydown.enter="search">
        </div>
        <div class="search_img div-float-left" style="margin-left: 10px;" v-on:click="search">
            <img class="head_img" src="../../assets/search.png" alt="search" style="width: 20px;height: 20px;">
        </div>
        <!-- 注册登陆 -->
        <div class="div-float-right" id="nav-register" v-if="uid==null||uid==''">
            <router-link to="/Register/" style="margin-left:-25px;" class="nav-link font_shadow navText" target="_BLANK">注册</router-link>
        </div>
        <div class="div-float-right" v-if="uid==null||uid==''" style="margin-left:15px;">
            <router-link to="/Login/" class="nav-link font_shadow navText">
                <img src="../../assets/user.png" alt="user" class="nav-user-img" style="width: 20px;height: 20px;">
                <span>登陆</span>
            </router-link>
        </div>
        <!-- 退出 -->
        <div class="div-float-right head-exit" id="changeNav" v-if="uid!=null&&uid!=''" style="background:rgba(255,255,255,0);">
            <a class="nav-link font_shadow navText" :class="{'margin_top_5px':headImg!=null}" href="#" style='margin-left:-20px;' v-on:click="safe_exit">
                退出
            </a>
        </div>
        <!-- 用户名 -->
        <!-- <div class="div-float-right" v-if="uid!=null&&uid!=''" style="background:rgba(255,255,255,0);">
            <router-link :to="{path:'/Visit/',query:{uid:uid}}" class="nav-link font_shadow " style='color:rgb(205,133,63);'>
                <span v-if="headImg==null||headImg=='null'" class="nav-user-text">
                    <img class="headNav_headImg" src="../../assets/bigUser.png" alt="头像">
                </span>
                <span v-else>
                    <img class="headNav_headImg" :src="headImg" alt="头像">
                </span>
            </router-link>
        </div> -->
        <!-- 通知 -->
        <div v-if="uid!=null&&uid!=''" @click="go('/#/LetterCenter/');" class="nav-letter nav_item_div div-float-right">
            <img v-if="unread_num==0" src="../../assets/letter.svg" alt="letter" style="width: 24px;height: 24px;">
            <img v-else src="../../assets/letter-have.svg" alt="letter" style="width: 24px;height: 24px;">
            <!-- <img src="../../assets/redpoint.svg" alt="point" class="letter-redpoint" > -->
            <span>消息</span>
        </div>
        <!-- 首页 -->
        <div class="nav_item_div nav_home_span div-float-right" @click="goHome">
            <img src="../../assets/home.png" alt="home" class="nav-home-img" style="width: 20px;height: 20px;">
            <span>首页</span>
        </div>
        <!-- </ul> -->
    </nav>
</div>
</template>

<script>
import axios from 'axios';
import NProgress from "nprogress";
import 'nprogress/nprogress.css';

//先从ssesionStorage检查用户信息
var storge = window.sessionStorage;
export default {
    name: 'headNav',
    props: ['search_key'],
    //inject:['reload'],
    data() {
        return {
            uid: storge.getItem("uid"),
            username: storge.getItem("username"),
            headImg: storge.getItem("headImg"),
            login_user: {
                "followNum": null,
                "fanNum": null,
                "messageNum": null,
                "registerTime": null
            },
            input_search: null,
            unread_num: 0,
            showUserDrop: false,
        }
    },
    created() {
        NProgress.start();
        this.getInfo();
        NProgress.done();
    },
    mounted() {
        //alert(this.uid);
        this.input_search = this.search_key;
    },
    methods: {
        //访问某个页面
        go(url){
            this.showUserDrop=false;
            location.href=url;
            //location.href="/#/Visit/?uid="+this.uid;
        },
        //打开用户菜单
        showDrop() {
            this.showUserDrop = true;
            // $("#main-div").css("position","fixed");
            // $("#main-div").css("z-index","1");
        },
        //关闭用户菜单
        closeDrop() {
            this.showUserDrop = false;
            // $("#main-div").css("position","block");
        },
        //获取个人信息，检查是否已经登录
        getInfo: function () {
            //console.log("111headNav-getInfo...");
            axios
                .post("/api/getInfo")
                .then(response => {
                    if (response.data.UID != null && response.data.UID != "") {
                        this.login_user = response.data;
                        var user = response.data;
                        storge.setItem("uid", user.UID);
                        storge.setItem("username", user.Username);
                        storge.setItem("headImg", user.headImg);
                        //
                        this.uid = response.data.UID;
                        this.username = response.data.Username;
                        if (response.data.headImg != null)
                            this.headImg = response.data.headImg;
                        //获取未读通知数
                        this.getUnreadNum();
                    } else {
                        storge.clear();
                        this.uid=null;
                        this.username=null;
                        this.headImg=null;
                    }
                    this.$emit("getInfo", response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //获取未读通知数
        getUnreadNum() {
            axios
                .post("/api/getAllUnReadCount")
                .then(response => {
                    //console.log(response);
                    var res = response.data;
                    if (res.statu == "failed")
                        alert(res.msg);
                    else
                        this.unread_num = res.unread_sum;
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        //搜索
        search: function () {
            location.href = "/#/Search/?key=" + this.input_search;
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
        goHome: function () {
            if (this.uid == null || this.uid == "")
                location.href = "/";
            else
                location.href = "/#/Home/";
        },
        safe_exit: function () {
            storge.clear();
            axios
                .post("/api/clearInfo")
                .then(response => {
                    if (response.data == "clearInfo success")
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

.block-item {
    display: inline-block;
    width: 32%;
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: center;
}

.block-item:hover {
    background: rgb(220, 220, 220);
}

/* 从左边飞入动画 */
@keyframes left_right {
    0% {
        left: -70vw;
    }

    /* 50% {
        left: -20vw;;
    } */
    100% {
        left: 0;
    }
}

/* 过渡动画 */
.userDrop-enter-active {
    animation: left_right 0.5s;
}

.userDrop-leave-active {
    animation: left_right 0.2s reverse;
}

.user-drop {
    display: none;
}

/* .drop:hover .drop-content{
    display: inline;
} */
.drop-title:hover {
    cursor: pointer;
}

.drop-over {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
}

.drop-content {
    /* display: none; */
    position: fixed;
    top: 0;
    left: 0;
    width: 70vw;
    height: 100vh;
    overflow: auto;
    z-index: 100;
    border-radius: 5px;
    /* padding: 10px; */
    background: rgb(245, 245, 245);
    font-size: 16px;
}

.drop-item {
    margin-top: 3px;
    padding: 10px;
    padding-left: 20px;
    /* border-radius: 4px; */
}

.drop-item:hover {
    cursor: pointer;
    background: rgb(220, 220, 220);
    color: rgb(205, 133, 63);
}
.drop-item img{
    width: 25px;
    height: 25px;
    margin-right: 20px;
}

.headNav_headImg {
    width: 30px;
    height: 30px;
    border-radius: 15px;
}

.div-float-left {
    float: left;
}

.div-float-right {
    float: right;
}

.nav_item_div {
    width: 80px;
    font-size: 14px;
    padding-top: 12px;
    color: rgb(100, 100, 100);
    overflow: hidden;
    transition: all 0.3s;
}

.nav_item_div:hover {
    cursor: pointer;
    color: rgb(205, 133, 63);
}

.nav_item_div img {
    margin-top: -3px;
}

/* .nav_item_div:hover img,
.nav_user:hover img {
    transform: translateY(-500px);
    filter: drop-shadow(#cd853f 0 500px);
} */

.headNav {
    /* display: flex;
    flex-direction: row; */
    padding: 8px;
    background-color: rgba(255, 255, 255, 1);
    transition: background-color 0.5s;
    overflow: hidden;
    box-shadow: 0px 0px 5px rgb(220, 220, 220);
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
}

.headNav:hover {
    background-color: rgba(255, 255, 255, 1);
}

.navText {
    font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
    font-size: 14px;
    color: rgb(100, 100, 100);
    margin-top: 4px;
}

.logo {
    margin-left: 10%;
    cursor: pointer;
}

.logo_img {
    width: 60px;
    height: 40px;
}

.search_input {
    border-radius: 15px;
    margin-top: 5px;
    background: rgba(255, 255, 255, 0);
    width: 400px;
    height: 30px;
}

.user_img {
    width: 18px;
    height: 18px;
    margin-top: 12px;
    margin-left: 0px;
}

.search_img {
    margin-top: 6px;
}

.search_img:hover {
    cursor: pointer;
}

.search_img:hover img {
    transform: translateY(-500px);
    filter: drop-shadow(#cd853f 0 500px);
}

#changeNav {
    margin-right: 10%;
}

#nav-register {
    margin-right: 10%;
}

@media only screen and (max-width: 500px) {
    .nav-letter span {
        display: none;
    }

    .user-drop {
        display: inline;
    }

    .head-exit {
        display: none;
    }

    #nav-register {
        margin-right: 0;
    }

    #changeNav {
        margin-right: 0;
    }

    .search_img {
        display: none;
    }

    .nav_home_span {
        display: none;
    }

    .navText {
        font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
        font-size: 13px;
        color: rgb(100, 100, 100);
        margin-top: 2px;
    }

    .margin_top_5px {
        margin-top: 5px;
    }

    .nav-home-img {
        display: none;
    }

    .nav-user-text {
        font-size: 17px;
        margin-left: 0px;
    }

    .nav-user-img {
        display: none;
    }

    .headNav {
        /* display: flex;
        flex-direction: row; */
        padding-top: 3px;
        padding-bottom: 8px;
        background-color: rgba(255, 255, 255, 1);
        transition: background-color 0.5s;
        overflow: hidden;
        box-shadow: none;
        transition: all 0.3s;
        -webkit-transition: all 0.3s;
    }

    .search_input {
        border-radius: 15px;
        margin-top: 5px;
        background: rgba(255, 255, 255, 0);
        width: 120px;
        height: 30px;
    }

    .logo {
        display: none;
        margin-left: 0;
    }

    .nav_item_div {
        width: 30px;
        font-size: 13px;
        margin-top: 0px;
        margin-left: 15px;
        overflow: hidden;
    }

    .user_img {
        width: 18px;
        height: 18px;
        margin-top: 12px;
        margin-left: 8px;
    }
}
</style>
