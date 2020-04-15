<template>
<div>
    <!-- 顶部导航栏 -->
    <HeadNav @getInfo="getInfo_nav($event)"></HeadNav>
    <!-- 下方主体-->
    <div id="container" style="margin-top:50px;">
        <div id="topDiv" style="width:100%;text-align:center;">
            <div style="padding-top: 20px;">
                <img src="../../assets/bigUser.png" alt="头像">
            </div>
            <div id="username" style="padding-top:5px;font-size:17px;color:rgb(185,113,43);">
                <b>{{username}}</b>
            </div>
            <div v-if="uid!=login_uid">
                <div v-if="followed==false">
                    <button class='btn btn-outline-success btn-sm follow_btn' @click="follow">关注</button>
                </div>
                <div v-else-if="followed==true">
                    <button class='btn btn-outline-success btn-sm followed_btn' disabled>已关注</button>
                </div>
            </div>
            <div style="padding-top:8px;text-align:center;font-size:14px;">
                <span class="infoText" style="margin-left:-5px;"><b>关注</b></span>
                <span>
                    <b><a href="#" style="text-decoration:none;">{{follow_num}}</a></b>
                </span>
                <span class="infoText"><b>粉丝</b></span>
                <span>
                    <b><a href="#" style="text-decoration:none;">{{fan_num}}</a></b>
                </span>
                <span class="infoText"><b>帖子</b></span>
                <span>
                    <b><a href="#" style="text-decoration:none;">{{message_num}}</a></b>
                </span>
            </div>
            <div id="info" style="font-size:13px;padding-top:5px;">
                <span>性别：<span>{{sex}}</span></span>
                <span style="margin-left:20px;">年龄：<span>{{age}}</span></span>
            </div>
            <div style="padding-top:5px;font-size:12px;">
                <span id="introduce">{{introduce}}</span>
                <span style="text-decoration:none;" class="edit_link" v-if="login_uid==uid" @click="openEdit">{{edit_link}}</span>
            </div>
        </div>
        <!-- 编辑个人资料 -->
        <div class="edit_div" id="edit_div" v-show="show_edit==true">
            <hr>
            <form action="">
                <div class='form-group' style="margin-top:-10px;">
                    <label>性别：</label>
                    <label style="font-size:14px;"><input type='radio' v-model="sex" value='男'/>男</label>
                    <label style="margin-left:5px;font-size:14px;"><input type='radio' v-model="sex" value='女'/>女</label>
                </div>
                <div class="form-group" style="margin-top:-10px;">
                    <label for="age_input">年龄：</label>
                    <input type="number" v-model="age" style="width:60px;">
                </div>
                <div class="form-group" style="margin-top:-10px;">
                    <label >一句话自我介绍：</label>
                    <br>
                    <textarea id="introduce_input" cols="30" rows="3" v-model="introduce"></textarea>
                </div>
                <div style="margin-top:-10px;">
                    <button class="btn btn-primary btn-sm follow_btn" type="button" @click="updateInfo">确认</button>
                    <button class="btn btn-success btn-sm follow_btn" type="reset">重置</button>
                </div>
            </form>

        </div>
        <!-- 展示帖子div -->
        <div id="bottomDiv">
            <div id="leftContent" style="width:30%;float:left;">
                <p> </p>
            </div>
            <div id="midContent" style="width:40%;float:left;">
                <hr>
                <ShowMessages :messages="messages" :uid="login_uid" @reload="reload"></ShowMessages>
            </div>
            <div id="rightContent" style="width:30%;float:left;">
                <p> </p>
            </div>
        </div>
    </div>
    <MyModal :show="showModal" :title="title" @confirm="confirm" @close="close"></MyModal>
</div>
</template>

<script>
import HeadNav from "@/components/navigation/headNav";
import axios from "axios";
import MyModal from "@/components/functions/myModal";
import ShowMessages from "@/components/functions/showMessages";

export default {
    name: 'visit',
    components: {
        HeadNav,
        MyModal,
        ShowMessages
    },
    data() {
        return {
            uid: this.$route.query.uid,
            login_uid: null,
            username: 'Username',
            follow_num: 0,
            fan_num: 0,
            message_num: 0,
            sex: "未设置",
            age: "未设置",
            introduce: "这个人很懒，什么都没留下...",
            followed: false,
            messages: null,
            showModal: false,
            title: null,
            show_edit: false,
            edit_link: "编辑",
            update_result:null
        }
    },
    created() {
        //alert(this.$route.fullPath+new Date().toString());
        this.getInfo_server();
    },
    mounted(){
        this.getMessages();
    },
    methods: {
        //刷新messages
        reload(){
            this.getMessages();
        },
        //更新个人资料
        updateInfo(){
            axios 
                .post("/api/updateUser",{
                    "sex":this.sex,
                    "age":this.age,
                    "introduce":this.introduce
                })
                .then(response =>{
                    if(response.data=="success"){
                        this.title="修改成功";
                        this.showModal=true;
                    }
                    else{
                        this.title="修改失败";
                        this.showModal=true;
                        this.getInfo_server();
                    }
                })
                .catch(function(error){
                    console.log(error);
                    
                });
        },
        //打开编辑资料的div
        openEdit(){
            if(this.show_edit==false){
                this.show_edit=true;
                this.edit_link="收起";
            }  
            else {
                this.show_edit=false;
                this.edit_link="编辑";
            }
            
        },
        //消息框点击了确认
        confirm() {
            console.log("modal--confirm");
            this.showModal = false;
            if(this.login_uid==null||this.login_uid=="")
                location.href = "/";
        },
        //关闭消息框
        close() {
            console.log("modal--cancel");
            this.showModal = false;
        },
        //从状态栏获取信息
        getInfo_nav(data) {
            if (data.UID != null && data.UID != "") {
                this.login_uid = data.UID;
            }
        },
        //获取帖子
        getMessages() {
            axios
                .post("/api/getVisitMessage?visitUID="+this.uid)
                .then(response =>{
                    console.log(response);
                    
                    if(response.data!=null)
                        this.messages=response.data;
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //从服务器获取信息
        getInfo_server() {
            axios
                .post("/api/getVisitUserInfo?visitUID=" + this.uid)
                .then(response => {
                    if (response.data.UID != null && response.data.UID != "") {
                        var res = response.data;
                        this.username = res.Username;
                        this.follow_num = res.followNum;
                        this.fan_num = res.fanNum;
                        this.message_num = res.messageNum;
                        if (res.sex != null)
                            this.sex = res.sex;
                        if (res.age != null)
                            this.age = res.age;
                        if (res.introduce != null)
                            this.introduce = res.introduce;
                        if (res.isFollowed == 1)
                            this.followed = true;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //关注
        follow: function () {
            if (this.login_uid == null || this.login_uid == "") {
                //alert("你还未登录");
                this.title = "你还未登陆,请先登陆";
                this.showModal = true;
                //location.href="/";
                return;
            }
            //axios请求增加关注
            axios
                .post("/api/addFollow", {
                    "myUID": this.login_uid,
                    "targetUID": this.uid
                })
                .then(response => {
                    if (response.data == "success")
                        location.reload();
                    else alert("关注失败");
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}
</script>

<style>
    body {
        background: rgb(245,245,245);
        /* background-image: linear-gradient(to bottom right, #CDC9A5, #FFFFF0);
        background-repeat: no-repeat;
        background-attachment: fixed; */
    }
    .edit_link{
        color:dodgerblue;
    }
    .edit_link:hover{
        color:royalblue;
        cursor: pointer;
    }
    .edit_div {
        text-align: center;
        width: 40%;
        margin-left: 30%;
        font-size: 12px;
    }

    .infoText {
        font-size: 13px;
        margin-left: 20px;
    }

    .follow_btn {
        width: 40px;
        height: 26px;
        font-size: 11px;
        margin-top: 6px;
    }

    .followed_btn {
        width: 55px;
        height: 26px;
        font-size: 11px;
        margin-top: 6px;
    }
</style>
