<template>
<div>
    <div class='rounded shadow_div main_div' v-for="user in users" v-bind:key="user.UID" v-if="user.UID!=null">
        <img src='../../assets/user2.png' alt='user' style='margin:4px;'>
        <!-- <b><a href='#' style='text-decoration: none;'>{{user.Username}}</a></b> -->
        <b><router-link id="showUser-name" :to="{path:'/Visit/',query:{uid:user.UID}}" style="text-decoration:none;">
            {{user.Username}}
        </router-link></b>
        <button type='button' class='btn btn-outline-success btn-sm follow_btn1' v-if="user.isFollowed==0&&user.UID!=uid" 
                v-on:click='follow(user.UID);user.isFollowed=1;'>
            关注
        </button>
        <button type='button' class='btn btn-outline-success btn-sm follow_btn2' @click="cancelFollow(user.UID);user.UID=null;" v-if="user.UID!=uid&&user.isFollowed==1">
            取消关注
        </button>
    </div>
    <MyModal :show="show_modal" :title="title" @confirm="confirm" @close="close"></MyModal>
</div>
</template>

<script>
import axios from "axios";
import MyModal from "@/components/functions/myModal";
export default {
    name: 'showUsers',
    props:['uid','users'],
    components:{
        MyModal
    },
    data() {
        return {
            show_modal:false,
            title:null
        }
    },
    methods:{
        //取消关注
        cancelFollow(targetUID){
            axios
                .post("/api/cancelFollow",{
                    "targetUID":targetUID
                })
                .then(response =>{
                    console.log("showUser--cancelFollow:"+response.data);
                    if(response.data=="success"){
                        this.$emit("cancelFollow");
                    }    
                    else alert("取消关注失败");
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //消息框确认
        confirm(){
            this.show_modal=false;
            window.location.href="/";
        },
        //消息框关闭
        close(){
            this.show_modal=false;
        },
        //关注
        follow:function(targetUID){
            if(this.uid==null||this.uid==""){
                this.title="你还没登陆，请先登陆";
                this.show_modal=true;
                return;
            }
            //axios请求增加关注
            axios
                .post("/api/addFollow",{
                    "myUID":this.uid,
                    "targetUID":targetUID
                })
                .then(response =>{
                    console.log("showUser--follow:"+response.data);
                    if(response.data!="success")
                        alert("关注失败");
                })
                .catch(function(error){
                    console.log(error);
                });
        }
    }
}
</script>

<style>
    @import url("../../lib/css/shadow.css");
    .main_div{
        padding: 10px;
        margin-top:10px;
        background-color: rgba(255,255,255,0.8);
    }
    .follow_btn1{
        width:50px;
        height:26px;
        font-size:11px;
        float:right;
        margin:6px;
    }
    .follow_btn2{
        width:70px;
        height:26px;
        font-size:11px;
        float:right;
        margin:6px;
    }

@media screen and (max-width: 500px){
    #showUser-name{
        font-size: 18px;
    }
    .follow_btn1{
        width:50px;
        height:35px;
        font-size:12px;
        float:right;
        margin:6px;
        margin-top: 0px;
    }
    .follow_btn2{
        width:70px;
        height:35px;
        font-size:12px;
        float:right;
        margin:6px;
        margin-top: 0px;
    }
}
</style>
