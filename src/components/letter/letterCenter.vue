<template>
<div>
    <!-- 顶部导航栏 -->
    <div style="width:100%;">
        <HeadNav @getInfo="getInfo($event)"></HeadNav>
    </div>
    <div class="LC-content">
        <div id="LC-title">
            <h3 class="text-muted">消息中心</h3>
        </div>
        <div id="top-div">
            <div class="top-div-item" @click="go('/#/MultiNotice/?action=replyMe')">
                <img src="../../assets/letter-comment.svg" alt="comment">
                <!-- 新消息小红点 -->
                <div v-if="unread_comment!=0" class="red-point">{{unread_comment}}</div>
                <div>回复我的</div>
            </div>
            <div class="top-div-item" @click="go('/#/MultiNotice/?action=@Me')">
                <img src="../../assets/letter-@.svg" alt="@">
                <!-- 新消息小红点 -->
                <div v-if="unread_call!=0" class="red-point">{{unread_call}}</div>
                <div>@我</div>
            </div>
            <div class="top-div-item" @click="go('/#/MultiNotice/?action=likeMe')">
                <img src="../../assets/letter-like.svg" alt="like">
                <!-- 新消息小红点 -->
                <div v-if="unread_like!=0" class="red-point">{{unread_like}}</div>
                <div>收到的赞</div>
            </div>
            <div class="top-div-item">
                <img src="../../assets/letter-book.svg" alt="book">
                <div>通讯录</div>
            </div>
        </div>
        <div class="bottom-div">
            <div v-if="unread_letter.length<=0" class="text-muted" style="text-align:center;padding-top:20px;">
                没有聊天记录...
            </div>
            <!-- 聊天列表 -->
            <div v-else>
                <div v-for="item in unread_letter" @click="go('/#/LetterChat/?uid='+item.userInfo.UID)" class="letter-item">
                    <span v-if="item.userInfo.headImg==null||item.userInfo.headImg=='null'" class="nav-user-text">
                        <img class="LC-headImg" src="../../assets/bigUser.png" alt="头像">
                    </span>
                    <span v-else>
                        <img class="LC-headImg" :src="item.userInfo.headImg" alt="头像">
                    </span>
                    <b class="text-muted" style="font-size:18px;">{{item.userInfo.username}}</b>
                    <div v-if="item.unread_num>0" class="letter-redpoint">{{item.unread_num}}</div>
                </div>
            </div> 
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
    name:"letterCenter",
    components:{
        HeadNav,
    },
    data(){
        return{
            user:null,
            unread_comment:0,
            unread_like:0,
            unread_call:0,
            unread_letter:[],
        }
    },
    created(){

    },
    methods:{
        //跳转
        go(url){
            location.href=url;
        },
        //从状态栏获取用户登录信息
        getInfo(data){
            if(data.UID!=undefined&&data.UID!=null&&data.UID!="null"){
                this.user=data;
                NProgress.start();
                this.getUnreadLetterDetail();
                NProgress.done();
            }      
        },
        //获取未读通知详情
        getUnreadLetterDetail(){
            axios 
                .post("/api/getUnReadCountDetail")
                .then(response=>{
                    //console.log(response);
                    var res=response.data;
                    if(res.statu=="success"){
                        this.unread_comment=res.unread_comment;
                        this.unread_like=res.unread_like;
                        this.unread_letter=res.unread_letter;
                    }else{
                        console.log(res.msg);
                    }
                })
                .catch(function(error){
                    console.log(error);
                })
        },
    }
}
</script>
<style>
    .LC-headImg {
        width: 30px;
        height: 30px;
        border-radius: 15px;
    }
    .letter-redpoint{
        /* position: relative; */
        display: inline-block;
        padding-left: 6px;
        padding-right: 6px;
        padding-top: 1px;
        float: right;
        margin-top:6px;
        margin-right: 50px;
        text-align: center;
        font-size: 10px;
        height: 18px;
        border-radius: 9px;
        top: 0;
        left: 60%;
        background: rgb(228, 48, 48);
        color: white;
    }
    .letter-item{
        width: 100%;
        margin-top: 5px;
        padding: 10px 0px 10px 20px;
        background: white;
        word-wrap: break-word;
    }
    .letter-item:hover{
        cursor: pointer;
        background: rgb(250,250,250);
    }
    .red-point{
        padding-left: 6px;
        padding-right: 6px;
        padding-top: 1px;
        text-align: center;
        font-size: 10px;
        height: 18px;
        border-radius: 9px;
        position: absolute;
        top: 0;
        left: 60%;
        background: rgb(228, 48, 48);
        color: white;
    }
    .top-div-item{
        display: inline-block;
        position: relative;
        width: 24%;
        /* height: 60px; */
        padding-top: 8px;
        padding-bottom: 8px;
        text-align: center;
        font-size: 14px;
    }
    .top-div-item:hover{
        cursor: pointer;
        background: rgb(230,230,230);
    }
    .top-div-item img{
        width: 30px;
        height: 30px;
    }
    #top-div{
        width: 100%;
        /* height: 60px; */
        background: white;
    }
    #LC-title{
        width: 100%;
        /* margin-left: 34%; */
        padding: 10px;
        text-align: center;
        background: white;
    }
    .LC-content{
        width:32%;
        margin-left: 34%;
        padding-bottom: 500px;
        background: rgb(235,235,235);
    }
    
    body {
        background: rgb(245, 245, 245);
    }
    @media screen and (max-width: 500px){
        .LC-content{
            width:100%;
            margin-left: 0;
            margin-top: -10px;
            background: none;
        }
        
    }
</style>