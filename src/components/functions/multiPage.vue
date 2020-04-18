<template>
    <div>
        <!-- 顶部导航栏 -->
        <div style="width:100%;">
            <HeadNav @getInfo="getInfo_nav($event)"></HeadNav>
        </div>
        <!-- 左导航栏 -->
        <div style="width:30%;float:left;">
            <LeftNav :uid="login_uid"></LeftNav>
        </div>
        <!-- 中间的内容主体 -->
        <div style="width:50%;float:left;">
            <div style="margin-top:20px;">
                <!-- 标题 -->
                <div class="shadow_div" style="background:white;padding:5px;text-align:center;font-size:16px;">
                    <span v-if="action=='seeTopMsg'">热门帖子Top10</span>
                   
                    <span v-else-if="action=='seeMyMsg'">我的帖子({{login_user.messageNum}})</span>
                    <span v-else-if="action=='seeVisitMsg'"><span style="color:rgb(185,113,43);">{{visit_user.Username}}</span> 的帖子({{visit_user.messageNum}})</span>
                    
                    <span v-else-if="action=='seeMyFollow'">我的关注({{login_user.followNum}})</span>
                    <span v-else-if="action=='seeVisitFollow'"><span style="color:rgb(185,113,43);">{{visit_user.Username}}</span> 的关注({{visit_user.followNum}})</span>
                    
                    <span v-else-if="action=='seeMyFan'">我的粉丝({{login_user.fanNum}})</span>
                    <span v-else-if="action=='seeVisitFan'"><span style="color:rgb(185,113,43);">{{visit_user.Username}}</span> 的粉丝({{visit_user.fanNum}})</span>      
                </div>
                <!-- 内容展示 -->
                <div style="background:rgb(245,245,245);padding:10px;margin-top:-10px;">
                    <ShowUsers :users="users" :uid="login_uid" @cancelFollow="cancelFollow" v-if="action=='seeMyFollow'||action=='seeMyFan'||action=='seeVisitFan'||action=='seeVisitFollow'"></ShowUsers>
                    <ShowMessages :messages="message" :uid="login_uid" v-else></ShowMessages>
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
            message: null,
            users:null,
            login_uid:null,
            showModal:false,
            title:null
        }
    },
    created(){

    },
    mounted(){

    },
    methods:{
        //从顶部导航栏获取登录信息
        getInfo_nav(user){
            if(user.UID!=null&&user.UID!=""){
                this.login_uid=user.UID;
                this.login_user=user;
            }
            if(this.action=="seeTopMsg")
                this.getTopMsg();
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
                }   
                else{
                    this.title="你还未登陆，请先登陆";
                    this.showModal=true;
                }
            }
               
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
                        this.message=response.data;
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
                        this.message=response.data;
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
                        this.message=response.data;
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
</style>