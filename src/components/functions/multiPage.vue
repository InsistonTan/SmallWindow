<template>
    <div>
        <!-- 顶部导航栏 -->
        <div style="width:100%;">
            <HeadNav @getInfo="getInfo_nav($event)"></HeadNav>
        </div>
        <!-- 左导航栏 -->
        <div id="multi-left-div" style="width:30%;float:left;">
            <LeftNav :uid="login_uid"></LeftNav>
        </div>
        <!-- 中间的内容主体 -->
        <div id="multi-mid-div">
            <div id="multi-container">
                <!-- 标题 -->
                <div class="shadow_div" style="background:white;padding:5px;text-align:center;font-size:16px;">
                    <span v-if="action=='seeTopMsg'">热门小窗Top10</span>
                    <span v-else-if="action=='seeNewMsg'">最新小窗</span>

                    <span v-else-if="action=='seeMyMsg'">我的小窗({{login_user.messageNum}})</span>
                    <span v-else-if="action=='seeVisitMsg'"><span style="color:rgb(185,113,43);">{{visit_user.Username}}</span> 的小窗({{visit_user.messageNum}})</span>
                    
                    <span v-else-if="action=='seeMyFollow'">我的关注({{login_user.followNum}})</span>
                    <span v-else-if="action=='seeVisitFollow'"><span style="color:rgb(185,113,43);">{{visit_user.Username}}</span> 的关注({{visit_user.followNum}})</span>
                    
                    <span v-else-if="action=='seeMyFan'">我的粉丝({{login_user.fanNum}})</span>
                    <span v-else-if="action=='seeVisitFan'"><span style="color:rgb(185,113,43);">{{visit_user.Username}}</span> 的粉丝({{visit_user.fanNum}})</span>      

                    <span v-else-if="action=='seeMyLikeMsg'">我的点赞({{messages.length}})</span>
                    <span v-else-if="action=='seeMyCollectMsg'">我的收藏({{messages.length}})</span>
                    <span v-else-if="action=='seeMyCommentMsg'">我评论过的小窗({{messages.length}})</span>
                </div>
                <!-- 内容展示 -->
                <div style="background:rgb(245,245,245);padding:10px;margin-top:-10px;">
                    <div v-if="messages.length==0&&users==null" style="text-align:center;font-size:20px;"><b>{{change_text}}</b></div>
                    <ShowUsers :users="users" :uid="login_uid" @cancelFollow="cancelFollow" v-if="action=='seeMyFollow'||action=='seeMyFan'||action=='seeVisitFan'||action=='seeVisitFollow'"></ShowUsers>
                    <ShowMessages :messages="messages" :uid="login_uid" v-else></ShowMessages>
                </div>
            </div>
        </div>
        
        <!-- 弹出框组件 -->
        <MyModal :show="showModal" :title="title" @confirm="modal_confirm" @close="modal_close"></MyModal>
    </div>
</template>
<script>
import HeadNav from "@/components/navigation/headNav";
import LeftNav from "@/components/navigation/leftNav";
import ShowMessages from "@/components/functions/showMessages";
import ShowUsers from "@/components/functions/showUsers";
import MyModal from "@/components/functions/myModal";
import axios from "axios";
import NProgress from "nprogress";
import 'nprogress/nprogress.css';
export default {
    name: 'multiPage',
    components:{
        HeadNav,
        LeftNav,
        ShowMessages,
        ShowUsers,
        MyModal
    },
    data(){
        return{
            action:this.$route.query.action,
            visit_uid:this.$route.query.visit_uid,
            visit_user:{
                'UID': '',
                'Username': 'Username',
                'followNum': '0',
                'fanNum': '0',
                'messageNum': '0'
            },
            login_user:{
                'UID': '',
                'Username': 'Username',
                'followNum': '0',
                'fanNum': '0',
                'messageNum': '0'
            },
            messages: [],
            users:null,
            login_uid:null,
            showModal:false,
            title:null,
            change_text:""
        }
    },
    created(){

    },
    mounted(){

    },
    beforeRouteLeave (to, from, next) {
        if(to.name=="index"||to.name=="home"||to.name=="search"||to.name=="multiPage"){
            this.$destroy();
            next();
        }
        else{
            next();
        }
    },
    methods:{
        //从顶部导航栏获取登录信息
        getInfo_nav(user){
            if(user.UID!=null&&user.UID!=""){
                this.login_uid=user.UID;
                this.login_user=user;
            }
            this.load_animation();
            //return;
            NProgress.start();
            if(this.action=="seeTopMsg")
                this.getTopMsg();
            else if(this.action=="seeNewMsg")
                this.getNewMsg();
            //判断是否是浏览他人的
            else if(this.visit_uid!=null&&this.visit_uid!=""){
                this.getVisitorInfo();
                if(this.action=="seeVisitMsg")
                    this.getVisitMesssage();
                else if(this.action=="seeVisitFollow")
                    this.getVisitFollow();
                else if(this.action=="seeVisitFan")
                    this.getVisitFan();
            }
            else{
                //需要登陆后才能查看
                if(this.login_uid!=null&&this.login_uid!=""){
                    if(this.action=="seeMyMsg")
                        this.getMyMsg();
                    else if(this.action=="seeMyFollow")
                        this.getMyFollow();
                    else if(this.action=="seeMyFan")
                        this.getMyFan();
                    else if(this.action=="seeMyLikeMsg")
                        this.getMyLikeMsg();
                    else if(this.action=="seeMyCollectMsg")
                        this.getMyCollectMsg();
                    else if(this.action=="seeMyCommentMsg")
                        this.getMyCommentMsg();
                }   
                else{
                    this.title="你还未登陆，请先登陆";
                    this.showModal=true;
                }
            }
             NProgress.done();  
        },
        //...的动画效果
        load_animation(){
            setTimeout(this.change_pointer,300);
        },
        //动态的...
        change_pointer(){
            if(this.change_text==""){
                this.change_text=".";
                if(this.messages.length==0&&this.users==null){
                    setTimeout(this.change_pointer,300);
                }
            }
            else if(this.change_text=="."){
                this.change_text="..";
                if(this.messages.length==0&&this.users==null){
                    setTimeout(this.change_pointer,300);
                }
            }
            else if(this.change_text==".."){
                this.change_text="...";
                if(this.messages.length==0&&this.users==null){
                    setTimeout(this.change_pointer,300);
                }
            }
            else if(this.change_text=="..."){
                this.change_text="";
                if(this.messages.length==0&&this.users==null){
                    setTimeout(this.change_pointer,300);
                }
            }   
        },
        //获取最新的10个帖子
        getNewMsg(){
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
        //showusers组件取消了一个关注
        cancelFollow(){
            this.login_user.followNum--;
        },
        //获取他人的个人信息
        getVisitorInfo(){
            axios
                .post("/api/getVisitUserInfo?visitUID="+this.visit_uid)
                .then(response =>{
                    if(response.data!=null){
                        this.visit_user=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                })
        },
        //获取他人的所有关注
        getVisitFollow(){
            axios 
                .post("/api/getVisitFollow?visitUID="+this.visit_uid)
                .then(response =>{
                    if(response.data!=null){
                        this.users=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取他人的所有粉丝
        getVisitFan(){
            axios 
                .post("/api/getVisitFan?visitUID="+this.visit_uid)
                .then(response =>{
                    if(response.data!=null){
                        this.users=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取他人的所有帖子
        getVisitMesssage(){
            axios 
                .post("/api/getVisitMessage?visitUID="+this.visit_uid)
                .then(response =>{
                    if(response.data!=null){
                        this.messages=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取自己的所有粉丝
        getMyFan(){
            axios 
                .post("/api/getAllFan")
                .then(response =>{
                    if(response.data!=null){
                        this.users=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取自己的所有关注
        getMyFollow(){
            axios 
                .post("/api/getAllFollow")
                .then(response =>{
                    if(response.data!=null){
                        this.users=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取自己的所有帖子
        getMyMsg(){
            axios 
                .post("/api/getMyMessage")
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
        //弹出框确认
        modal_confirm(){
            if(this.title=="你还未登陆，请先登陆"){
                this.showModal=false;
                window.location.href="/";
            }
        },
        //弹出框取消
        modal_close(){
            this.showModal=false;
        }
    }
}
</script>
<style>
@import url("../../lib/css/shadow.css");
    body{
        background: rgb(245,245,245);
    }
    #multi-mid-div{
        width:50%;
        float:left;
    }
    #multi-container{
        margin-top: 20px;
    }
    @media screen and (max-width: 500px){
        #multi-container{
            margin-top: -10px;
        }
        #multi-mid-div{
            width:100%;
        }
        #multi-left-div{
            display: none;
        }
    }
</style>