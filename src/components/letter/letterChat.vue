<template>
<div>
    <!-- 顶部导航栏 -->
    <div style="width:100%;">
        <HeadNav @getInfo="getInfo($event)"></HeadNav>
    </div>
    <div v-show="show==true" id="lc-content">
        <div id="lc-c-title">
            <div class="text-muted" style="padding:10px 0 6px 0;"><h5>{{targetUser.Username}}</h5></div>
        </div>
        <div id="lc-c-content">
            <div v-for="item in data" style="width:100%;">
                <div class="cl-c-time">{{item.time}}</div>
                <!-- 左边好友发的信息 -->
                <div v-if="item.senderUid!=user.UID" class="left-letter">
                    <div class="lc-item-headImg-div" @click="go('/#/Visit/?uid='+item.senderUid)">
                        <span v-if="targetUser.headImg==null||targetUser.headImg=='null'">
                            <img class="lc-item-headImg" src="../../assets/bigUser.png" alt="头像">
                        </span>
                        <span v-else>
                            <img class="lc-item-headImg" :src="targetUser.headImg" alt="头像">
                        </span>
                    </div>
                    <div class="lc-item-content-div text-muted">
                        <div style="margin-left:8px;padding:6px;background:white;border-radius:4px;display:inline-block;">
                            {{item.content}}
                        </div>
                    </div>
                </div>
                <!-- 右边自己发的 -->
                <div v-else class="right-letter">
                    <div class="lc-item-headImg-div" @click="go('/#/Visit/?uid='+item.senderUid)" style="float:right;">
                        <span v-if="user.headImg==null||user.headImg=='null'">
                            <img class="lc-item-headImg" src="../../assets/bigUser.png" alt="头像">
                        </span>
                        <span v-else>
                            <img class="lc-item-headImg" :src="user.headImg" alt="头像">
                        </span>
                    </div>
                    <div class="lc-item-content-div text-muted" style="float:right;">
                        <div style="padding:6px;background:white;border-radius:4px;display:inline-block;float:right;">
                            {{item.content}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id=lc-c-bottom>
            <input id="lc-input" v-model="reply_input" type="text" class="form-control">
            <button id="lc-button" type="button"  @click="reply()" class="btn btn-sm btn-success">&Lambda;</button>
        </div>
    </div>   
</div>
</template>
<script>
import HeadNav from "@/components/navigation/headNav";
import axios from "axios";
import NProgress from "nprogress";
import 'nprogress/nprogress.css';
export default {
    name:'letterChat',
    components:{
        HeadNav,
    },
    data(){
        return{
            user:null,
            targetUser:{
                "Username":null
            },
            targetUID:this.$route.query.uid,
            data:[],
            show:false,
            reply_input:null,
        }
    },
    created(){
    },
    watch:{
        data:function(){
            if(this.data.length>0){
                this.$nextTick(function(){
                    this.moveScroll();
                });
            }
        }
    },
    methods:{
        //回复
        reply(){
            if(this.reply_input!=null&&this.reply_input!=""){
                axios 
                    .post("/api/addLetter",{
                        "receiverUid":this.targetUID,
                        "content":this.reply_input
                    })
                    .then(response=>{
                        var res=response.data;
                        console.log(res);
                        if(res.statu=="success"){
                            var sended={
                                "senderUid":this.user.UID,
                                "receiverUid":this.targetUID,
                                "content":this.reply_input
                            };
                            this.data.push(sended);
                            this.reply_input=null;
                        }
                        else{
                            alert("发送失败.");
                            console.log(res.msg);
                        }
                    })
                    .catch(function(error){
                        alert("发送失败.");
                        console.log(error);
                    })
            }
        },
        //跳转
        go(url){
            location.href=url;
        },
        //从状态栏获取用户登录信息
        getInfo(data){
            if(data.UID!=undefined&&data.UID!=null&&data.UID!="null"){
                this.user=data;
                if(this.targetUID!=null){
                    NProgress.start();
                    this.getFriUserInfo();
                    this.getFriendLetter();
                    this.show=true;
                    //将滑动条滑到底部
                    //setTimeout(this.moveScroll,0);
                }   
                else 
                    console.log("targetUID is null");
            }      
        },
        moveScroll(){
            //将滑动条滑到底部
            var div=document.getElementById("lc-c-content");
            var sh=div.scrollHeight;
            console.log("scrollHeight:"+sh);
            div.scrollTop = sh;
            NProgress.done();
        },
        //获取与该好友的聊天记录
        getFriendLetter(){
            axios
                .post("/api/getLetterRecord",{
                    "UID":this.targetUID
                })
                .then(response=>{
                    var res=response.data;
                    //console.log(res);
                    if(res.statu=="success"){
                        if(res.data.length>0)
                            this.data=res.data;
                    }
                    else{
                        console.log(res.msg);
                    }
                })
                .catch(function(error){
                    console.log(error);
                })
        },
        //获取对方的个人信息
        getFriUserInfo() {
            axios
                .post("/api/getVisitUserInfo?visitUID=" + this.targetUID)
                .then(response => {
                    //console.log(response.data);
                    if (response.data != null)
                        this.targetUser= response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    }
}
</script>
<style>
    .cl-c-time{
        width: 100%;
        float: left;
        font-size: 10px;
        text-align: center;
        padding:2px;
        margin-top: 8px;
        margin-bottom: -12px;
    }
    .right-letter{
        /* position: absolute;
        right: 0; */
        float: right;
        width: 70%;
        padding-top: 5px;
    }
    .left-letter{
        /* position: absolute;
        left: 0; */
        float: left;
        width: 70%;
        padding-top: 5px;
    }
    .lc-item-content-div{
        float: left;
        width: 86%;
        padding-top: 10px;
        word-break: break-all;
        /* background: green; */
    }
    .lc-item-headImg {
        width: 30px;
        height: 30px;
        border-radius: 15px;
    }
    .lc-item-headImg-div{
        float: left;
        width: 14%;
        padding: 8px;
        /* background: red; */
    }
    .lc-item-headImg-div:hover{
        cursor: pointer;
    }
    #lc-button{
        height: 30px;
        width: 15%;
        margin-left: 10px;
        margin-top: -2px;
    }
    #lc-input{
        display: inline-block;
        width: 80%;
        height: 30px;
    }
    #lc-c-bottom{
        position: absolute;
        bottom: 0;
        padding: 12px;
        width: 100%;
        height: 54px;
        background: white;
        /* padding-bottom: 54px; */
    }
    #lc-c-content{
        width: 100%;
        height: 85%;
        padding-bottom: 30px;
        overflow-y: auto;
        
    }
    /*滑动条外层轨道*/
    #lc-c-content::-webkit-scrollbar { 
        width:3px; 
        background:rgb(235,235,235); 
    }
    /*滑动条内层轨道*/
    #lc-c-content::-webkit-scrollbar-thumb{ 
        display:block; 
        /* width:3px;
        height:10px;  */
        background:#ccc; 
    }
    #lc-c-title{
        width: 100%;
        text-align: center;
        background: white;
        border-bottom: rgb(230,230,230) solid 1px;
    }
    #lc-content{
        position: relative;
        width: 32%;
        height:600px;
        margin-left: 34%;
        background: rgb(235,235,235);
    }
    body{
        background: rgb(245,245,245);
    }
    @media screen and (max-width: 500px){
        #lc-c-bottom{
            position: fixed;
            bottom: 0;
            padding: 12px;
            width: 100%;
            height: 54px;
            background: white;
            /* padding-bottom: 54px; */
        }
        #lc-content{
            position: relative;
            width: 100%;
            height:93vh;
            margin-top: -13px;
            margin-left: 0;
            background: rgb(245,245,245);
        }
        .right-letter{
            float: right;
            margin-right: 5px;
            width: 70%;
            padding-top: 5px;
        }
    }
</style>