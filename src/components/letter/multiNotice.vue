<template>
<div>
    <!-- 顶部导航栏 -->
    <div style="width:100%;">
        <HeadNav @getInfo="getInfo($event)"></HeadNav>
    </div>
    <div class="MN-content">
        <div id="MN-title">
            <h3 v-if="action=='replyMe'" class="text-muted">回复我的</h3>
            <h3 v-else-if="action=='@Me'" class="text-muted">@我</h3>
            <h3 v-else-if="action=='likeMe'" class="text-muted">收到的赞</h3>
        </div>
        <div id="MN-bottom-div">
            <div v-if="data.length<=0" style="text-align:center;padding-top:20px;" class="text-muted"><h6>暂无记录...</h6></div>
            <!-- 回复我的 -->
            <div v-if="action=='replyMe'">
                <div v-for="item in data" class="MN-bottom-item">
                    <div @click="go('/#/Visit/?uid='+item.uid)" class="MN-item-headImg-div">
                        <span v-if="item.headImg==null||item.headImg=='null'">
                            <img class="MN-headImg" src="../../assets/bigUser.png" alt="头像">
                        </span>
                        <span v-else>
                            <img class="MN-headImg" :src="item.headImg" alt="头像">
                        </span>
                    </div>
                    <div @click="go('/#/ViewMsg/?index='+item.msg_index)" class="MN-item-content-div">
                        <div class="text-muted"><b>{{item.username}}</b>&nbsp;
                            <span style="font-size:13px;">回复了我</span>
                        </div>
                        <div style="font-size:14px;padding:5px 0 5px 0;">{{item.content}}</div>
                        <div style="font-size:12px;" class="text-muted">{{item.time}}</div>
                    </div>
                </div>
            </div>
            <!-- 赞我的 -->
            <div v-else-if="action=='likeMe'">
                <div v-for="item in data" class="MN-bottom-item">
                    <div @click="go('/#/Visit/?uid='+item.uid)" class="MN-item-headImg-div">
                        <span v-if="item.headImg==null||item.headImg=='null'">
                            <img class="MN-headImg" src="../../assets/bigUser.png" alt="头像">
                        </span>
                        <span v-else>
                            <img class="MN-headImg" :src="item.headImg" alt="头像">
                        </span>
                    </div>
                    <div @click="go('/#/ViewMsg/?index='+item.msg_index)" class="MN-item-content-div">
                        <div class="text-muted"><b>{{item.username}}</b>&nbsp;
                            <span style="font-size:13px;">赞了我</span>
                        </div>
                        <div style="font-size:12px;" class="text-muted">{{item.time}}</div>
                    </div>
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
    name:'multiNotice',
    components:{
        HeadNav
    },
    data(){
        return{
            user:null,
            action:this.$route.query.action,
            data:[],
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
                if(this.action=="replyMe"){
                    this.getReplyRecord();
                }
                else if(this.action=="@Me"){

                }
                else if(this.action=="likeMe"){
                    this.getlikeRecord();
                }
                NProgress.done();
            }      
        },
        //获取回复记录
        getReplyRecord(){
            axios
                .post("/api/getCommentRecord")
                .then(response=>{
                    //console.log(response);
                    var res=response.data;
                    if(res.statu=="success"){
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
        //获取回复记录
        getcallRecord(){
            axios
                .post("")
                .then(response=>{
                    //console.log(response);
                    var res=response.data;
                    if(res.statu=="success"){
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
        //获取回复记录
        getlikeRecord(){
            axios
                .post("/api/getLikeRecord")
                .then(response=>{
                    //console.log(response);
                    var res=response.data;
                    if(res.statu=="success"){
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
    }
}
</script>
<style>
    .MN-item-content-div{
        float: left;
        width: 90%;
        padding: 8px;
        word-wrap: break-word;
        /* background: white; */
    }
    .MN-item-content-div:hover{
        cursor: pointer;
    }
    .MN-headImg {
        width: 30px;
        height: 30px;
        border-radius: 15px;
    }
    .MN-item-headImg-div{
        float: left;
        width: 10%;
        padding: 8px;
        /* background: white; */
    }
    .MN-item-headImg-div:hover{
        cursor: pointer;
    }

    .MN-bottom-item{
        float: left;
        width: 100%;
        background: white;
        border-bottom: rgb(230,230,230) solid 1px;
    }
    #MN-bottom-div{
        width: 100%;
        border-top: rgb(230,230,230) solid 1px;
        /* padding-left: 10px;
        padding-right: 10px; */
    }

    #MN-title{
        width: 100%;
        padding: 10px;
        text-align: center;
        background: white;
    }
    .MN-content{
        width:32%;
        margin-left: 34%;
        padding-bottom: 500px;
        background: rgb(235,235,235);
    }
    body {
        background: rgb(245, 245, 245);
    }
    @media screen and (max-width: 500px){
        .MN-content{
            width:100%;
            margin-top: -15px;
            margin-left: 0;
            padding-bottom: 0px;
            background: rgb(245,245,245);
        }
    }
</style>