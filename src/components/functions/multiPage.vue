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
            <!-- 查看热门帖子 -->
            <div v-if="action=='seeTopMsg'" style="margin-top:20px;">
                <!-- 标题 -->
                <div class="shadow_div" style="background:white;padding:5px;text-align:center;font-size:16px;">热门帖子Top10</div>
                <!-- 热门帖子展示 -->
                <div style="background:rgb(245,245,245);padding:10px;margin-top:-10px;">
                    <ShowMessages :messages="message" :uid="login_uid"></ShowMessages>
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
            message: {
                'index': null,
                'uid': null,
                'user': 'Username',
                'content': 'content',
                'time': null,
                'view': 0,
                'like': 0,
                'collect': 0,
                'liked': null,
                'collected': null,
                'comment': 0
            },
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
            }
            this.getTopMsg();
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