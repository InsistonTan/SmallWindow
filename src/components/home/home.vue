<template>
<div>
    <!-- 顶部导航栏 -->
    <div style="width:100%;">
        <HeadNav @getInfo="getInfo($event)"></HeadNav>
    </div>
    <!-- 左边导航栏 -->
    <div id="home-left-div" style="width:30%;float:left;">
        <!-- 副导航栏 -->
        <LeftNav :uid="uid"></LeftNav>
        <p></p>
    </div>
    <!-- 中间的主体 -->
    <div id="home-mid-div" >
        <!-- 发表帖子的输入框 -->
        <div id="home-input-div" style="">
            <textarea class="rounded input_area" v-model="input_content" cols="72" rows="5" placeholder="写下你的心情...">
            </textarea>
            <button type="button" class="btn_submit" style="width:60px;height:30px;font-size:14px;" 
                    v-on:click="submitMessage" title="点击发表">发表
            </button>
            <span style="color:red;font-size:14px;margin-left:10px;">{{submit_result}}</span>
        </div>
        <!-- 副导航栏 -->
        <div id="home-secondNav">
            <SecondNav :login_uid="'00000'" :select_item="select_item" @clear_select="clear_select" @getSelect="second_nav_select($event)"></SecondNav>
        </div>
        <hr id="home-hr" style="height:10px;">
        <!-- 展示帖子 -->
        <div id="MessageBody">
            <div v-if="messages==null||messages==[]" style="text-align:center;margin-top:10px;">加载数据中{{change_text}}</div>
            <div v-else-if="messages.length<1" style="text-align:center;margin-top:10px;">暂无数据</div>
            <ShowMessages v-else v-bind:messages="messages" v-bind:uid="uid" @reload="getFollowMessages"></ShowMessages>
        </div>
    </div>
    <!-- 右边展示个人信息的div -->
    <div id="home-right-div" style="width:30%;float:left;">
        <div class="rounded infoShow shadow_div">
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
                    <!-- <b><a href="#" style="text-decoration:none;" class="font_shadow">{{follow_num}}</a></b> -->
                    <b>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyFollow'}}" style="text-decoration:none;" class="font_shadow">
                            {{follow_num}}
                        </router-link>
                    </b>
                </span>
                <span class="infoText">粉丝</span>
                <span>
                    <!-- <b><a href="#" style="text-decoration:none;" class="font_shadow">{{fan_num}}</a></b> -->
                    <b>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyFan'}}" style="text-decoration:none;" class="font_shadow">
                            {{fan_num}}
                        </router-link>
                    </b>
                </span>
                <span class="infoText">帖子</span>
                <span>
                    <!-- <b><a href="#" style="text-decoration:none;" class="font_shadow">{{message_num}}</a></b> -->
                    <b>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyMsg'}}" style="text-decoration:none;" class="font_shadow">
                            {{message_num}}
                        </router-link>
                    </b>
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
import SecondNav from '@/components/navigation/secondNav';
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
        SecondNav,
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
            messages: [],
            input_content: null,
            submit_result: null,
            show_modal: false,
            title: null,
            select_item:null,//副导航栏选择
            change_text:'.'
        }
    },
    created() {
        //this.getInfo();
        //show();
    },
    mounted() {
        this.load_animation();
        this.getFollowMessages();
    },
    beforeRouteLeave (to, from, next) {
        if(to.name=="index"){
            this.$destroy();
            next();
        }
        else{
            next();
        }
    },
    methods: {
        //...的动画效果
        load_animation(){
            setTimeout(this.change_pointer,300);
        },
        //动态的...
        change_pointer(){
            if(this.change_text=="."){
                this.change_text="..";
                if(this.messages==null){
                    setTimeout(this.change_pointer,300);
                }
            }
            else if(this.change_text==".."){
                this.change_text="...";
                if(this.messages==null){
                    setTimeout(this.change_pointer,300);
                }
            }
            else if(this.change_text=="..."){
                this.change_text=".";
                if(this.messages==null){
                    setTimeout(this.change_pointer,300);
                }
            }   
        },
        //副导航栏选择事件处理
        second_nav_select(data){
            $("body,html").scrollTop(0);
            this.messages=null;
            this.load_animation();
            //document.documentElement.scrollTop=190;//不需要加单位
            if(data=="最新"){
                this.getNewMessage();
            }
            else if(data=="热门"){
                this.getTopMsg();   
            }
            else if(data=="关注"){
                this.getFollowMessages();   
            }
            else if(data=="点赞"){
                this.getMyLikeMsg();  
            }
            else if(data=="评论"){
                this.getMyCommentMsg();
            }
            else if(data=="收藏"){
                this.getMyCollectMsg();  
            }
        },
        //获取登陆者评论过的帖子
        getMyCommentMsg(){
            axios   
                .post("/api/getMyCommentMsg")
                .then(response =>{
                    if(response.data!=null){
                        this.messages=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取登陆者的收藏的帖子
        getMyCollectMsg(){
            axios   
                .post("/api/getMyCollectMsg")
                .then(response =>{
                    if(response.data!=null){
                        this.messages=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取登陆者的点赞的帖子
        getMyLikeMsg(){
            axios   
                .post("/api/getMyLikeMsg")
                .then(response =>{
                    if(response.data!=null){
                        this.messages=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取热门帖子
        getTopMsg(){
            axios
                .post("/api/getMsgTop10")
                .then(response =>{
                    if(response.data!=null){
                        this.messages=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取最新发表的帖子
        getNewMessage:function(){
            axios
                .post("/api/getNewMessage")
                .then(response=>{
                    //console.log(response);
                    if(response.data!=null)
                        this.messages=response.data;
                })
                .catch(function(error){
                    console.log(error);
                });
        },
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
        getFollowMessages: function () {
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
                        this.select_item="关注";
                        this.getFollowMessages();
                    } else {
                        //this.submit_result="发表失败！";
                        this.title = "发表失败！";
                        this.show_modal = true;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        clear_select(){
            this.select_item=null;
        }
    }

}
</script>

<style>
@import url("../../lib/css/home.css");
@import url("../../lib/css/shadow.css");
@import url("../../lib/css/leftNav.css");

.input_area {
    background-color: rgba(255, 255, 255, 1);
    width: 100%;
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
}

.input_area:hover {
    background-color: rgba(255, 255, 255, 14);
}

.infoShow {
    margin: 10%;
    margin-top: 20px;
    margin-left: 5.6%;
    background-color: rgba(255, 255, 255, 1);
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
}

.infoShow:hover {
    background-color: rgba(255, 255, 255, 1);
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
    background: rgb(245, 245, 245);
    /* background-image: linear-gradient(to bottom right, #F5DEB3, #FFFFF0);
    background-repeat: no-repeat;
    background-attachment: fixed;
    animation: my_animation 16s infinite linear;
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

#home-mid-div {
    width: 40%;
    float: left;
}
#home-input-div{
    margin-top:20px;
}
/* #home-secondNav{
    display: none;
} */
#home-secondNav{
        z-index: 2;
        position: sticky;
        top:45px;
        width: 100%;
        display:block; 
    }
@media screen and (max-width: 500px) {
    #home-secondNav{
        z-index: 2;
        position: sticky;
        top:45px;
        width: 100%;
        display:block; 
    }
    #home-hr{
        display: none;
    }
    #home-input-div{
        margin-top: -10px;
    }
    #home-mid-div {
        width: 100%;
        padding: 10px;
    }
    #home-left-div {
        display: none;
    }
    #home-right-div {
        display: none;
    }
    body {
        background: rgb(245, 245, 245);
    }
}
</style>
