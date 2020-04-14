<template>
<div>
    <div class='rounded shadow_div main_div' v-for="user in users" v-bind:key="user.UID">
        <img src='../../assets/user2.png' alt='user' style='margin:4px;'>
        <!-- <b><a href='#' style='text-decoration: none;'>{{user.Username}}</a></b> -->
        <b><router-link :to="{path:'/Visit/',query:{uid:user.UID}}" style="text-decoration:none;">
            {{user.Username}}
        </router-link></b>
        <button type='button' class='btn btn-outline-success btn-sm follow_btn1' v-if="user.isFollowed==0&&user.UID!=uid" 
                v-on:click='follow(user.UID)'>
            关注
        </button>
        <button type='button' class='btn btn-outline-success btn-sm follow_btn2' v-else disabled>
            已关注
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
                    if(response.data=="success")
                        location.reload();
                    else alert("关注失败");
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
        width:60px;
        height:26px;
        font-size:11px;
        float:right;
        margin:6px;
    }
</style>
