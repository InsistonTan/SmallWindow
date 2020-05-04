<template>
<div>
    <!-- 顶部导航栏 -->
    <HeadNav @getInfo="getInfo_nav($event)"></HeadNav>
    <!-- 下方主体-->
    <div id="visit-container">
        <div id="topDiv" style="width:100%;text-align:center;">
            <!-- 头像 -->
            <div style="padding-top: 20px;">
                <img v-if="uid!=login_uid&&headImg==null" src="../../assets/bigUser.png" alt="头像">
                <img v-if="uid!=login_uid&&headImg!=null" style="width:60px;height:60px;border-radius:30px;" :src="headImg" alt="头像">
                <!-- 1 -->
                <img v-if="uid==login_uid&&headImg==null" class="change_headimg" src="../../assets/bigUser.png"  alt="头像">
                <img v-if="uid==login_uid&&headImg!=null" class="change_headimg" :src="headImg" alt="头像" >
                <input v-if="uid==login_uid" id="photoFile" @change="uploadPhoto" type="file" accept="image/png,image/gif,image/jpeg" style="display:none;">
            </div>
            <!-- 修改头像 -->
            <div class="text-info" style="font-size:13px;margin-top:4px;">{{update_headImg_statu}}</div>
            <div>
                <button v-if="uid==login_uid" class='btn btn-outline-success btn-sm update_headImg' @click="openFileSelect" title="点击修改头像">修改头像</button>
            </div>

            <!-- 用户信息 -->
            <div id="username" style="padding-top:5px;font-size:20px;color:rgb(185,113,43);">
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
            <div style="padding-top:8px;text-align:center;font-size:16px;">
                <span class="infoText" style="margin-left:-5px;"><b>关注</b></span>
                <span>
                    <b v-if="uid==login_uid">
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyFollow'}}" style="text-decoration:none;" class="font_shadow">
                            {{follow_num}}
                        </router-link>
                    </b>
                    <b v-else>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeVisitFollow',visit_uid:uid}}" style="text-decoration:none;" class="font_shadow">
                            {{follow_num}}
                        </router-link>
                    </b>
                </span>
                <span class="infoText"><b>粉丝</b></span>
                <span>
                    <b v-if="uid==login_uid">
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyFan'}}" style="text-decoration:none;" class="font_shadow">
                            {{fan_num}}
                        </router-link>
                    </b>
                    <b v-else>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeVisitFan',visit_uid:uid}}" style="text-decoration:none;" class="font_shadow">
                            {{fan_num}}
                        </router-link>
                    </b>
                </span>
                <span class="infoText"><b>帖子</b></span>
                <span>
                    <b v-if="uid==login_uid">
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyMsg'}}" style="text-decoration:none;" class="font_shadow">
                            {{message_num}}
                        </router-link>
                    </b>
                    <b v-else>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeVisitMsg',visit_uid:uid}}" style="text-decoration:none;" class="font_shadow">
                            {{message_num}}
                        </router-link>
                    </b>
                </span>
            </div>
            <div id="info" style="font-size:14px;padding-top:5px;">
                <span>性别：<span>{{sex}}</span></span>
                <span style="margin-left:20px;">年龄：<span>{{age}}</span></span>
            </div>
            <div style="padding-top:5px;font-size:14px;">
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
                    <textarea id="introduce_input" cols="24" rows="3" v-model="introduce"></textarea>
                </div>
                <div style="margin-top:-10px;">
                    <button class="btn btn-primary btn-sm follow_btn" type="button" @click="updateInfo">确认</button>
                    <button class="btn btn-success btn-sm follow_btn" type="reset">重置</button>
                </div>
            </form>

        </div>
        <!-- 展示帖子div -->
        <div id="bottomDiv">
            <div id="visit-leftContent" style="width:30%;float:left;">
                <p> </p>
            </div>
            <div id="visit-midContent">
                <hr>
                <div v-if="messages==null" style="text-align:center;margin-top:10px;font-size:20px;"><b>{{change_text}}</b></div>
                <div v-else-if="messages.length==0" style="text-align:center;margin-top:10px;">暂无数据</div>
                <ShowMessages v-else :messages="messages" :uid="login_uid" @reload="reload"></ShowMessages>
            </div>
            <div id="visit-rightContent" style="width:30%;float:left;">
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
            headImg:null,
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
            update_result:null,
            update_headImg_statu:null,
            change_text:'.'
        }
    },
    created() {
        //alert(this.$route.fullPath+new Date().toString());
        this.getInfo_server();
    },
    mounted(){
        this.load_animation();
        this.getMessages();
    },
    //保存上个页面的地址
    beforeRouteEnter (to, from, next) {
        var storage=window.sessionStorage;
        if(storage.getItem(to.fullPath)==null)
            storage.setItem(to.fullPath,from.fullPath);
        next();  
    },
    beforeRouteLeave (to, from, next) {
        var storage=window.sessionStorage;
        var last_path=storage.getItem(from.fullPath);
        if(to.fullPath==last_path||to.name=="index"||to.name=="home"||to.name=="search"||to.name=="multiPage"||to.name=="login"||to.name=="register"){
            this.$destroy();
            storage.removeItem(from.fullPath);
            console.log("visit--destroy");
        }
        else{
            console.log("visit--not destroy");
        }
        next();
    },
    methods: {
        //...的动画效果
        load_animation(){
            setTimeout(this.change_pointer,300);
        },
        //动态的...
        change_pointer(){
            if(this.change_text==""){
                this.change_text=".";
                if(this.messages==null){
                    setTimeout(this.change_pointer,300);
                }
            }
            else if(this.change_text=="."){
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
                this.change_text="";
                if(this.messages==null){
                    setTimeout(this.change_pointer,300);
                }
            }   
        },
        //打开文件选择器
        openFileSelect(){
            $("#photoFile").click();
        },
        //上传头像文件
        uploadPhoto(){
            this.update_headImg_statu="上传头像中...";
            //
            var select_file=document.getElementById("photoFile").files[0];
            console.log("文件名:"+select_file.name+"大小:"+select_file.size);
            var formData=new FormData();
            formData.append("headImg",select_file);
            formData.append("type","HeadImg");
            //
            axios 
                .post("/api/uploadHeadImg",formData,{
                    headers:{'Content-Type':'multipart/form-data'}
                })
                .then(response =>{
                    console.log(response.data);
                    if(response.data.type=="success"){
                        this.update_headImg_statu="上传成功！";
                        this.getInfo_server();
                        this.getMessages();
                    }
                    else{
                        this.update_headImg_statu="上传失败,"+response.data.msg;
                    }
                })
                .catch(function(error){
                    console.log(error);
                })

        },
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
            //console.log("modal--confirm");
            if(this.title == "你还未登陆,请先登陆"){
                this.showModal = false;
                location.href = "/";
            }
            else if(this.title == "关注失败"){
                this.showModal = false;
            }
        },
        //关闭消息框
        close() {
            //console.log("modal--cancel");
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
            this.messages=null;
            axios
                .post("/api/getVisitMessage?visitUID="+this.uid)
                .then(response =>{
                    //console.log(response);
                    
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
                        if(res.headImg!=null)
                            this.headImg=res.headImg;
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
                    else {
                        this.title = "关注失败";
                        this.showModal = true;
                    }
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
    #visit-container{
        margin-top:50px;
    }
    #introduce_input{
        margin-left: 0%;
    }
    .change_headimg{
        width:60px;
        height:60px;
        border-radius: 30px;
    }
    .change_headimg:hover{
        cursor: pointer;
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
        /* width: 40%;
        margin-left: 30%; */
        font-size: 14px;
    }

    .infoText {
        font-size: 16px;
        margin-left: 20px;
    }

    .follow_btn {
        width: 60px;
        height: 30px;
        font-size: 14px;
        margin-top: 6px;
    }
    .update_headImg{
        padding: 0px;
        width: 70px;
        height: 26px;
        font-size: 12px;
        margin-top: 6px;
    }
    .followed_btn {
        width: 55px;
        height: 26px;
        font-size: 11px;
        margin-top: 6px;
    }
    #visit-midContent{
        width:40%;
        float:left;
    }
    @media screen and (max-width: 500px){
        #visit-container{
            margin-top:-20px;
        }
        #visit-leftContent{
            display: none;
        }
        #visit-rightContent{
            display: none;
        }
        #visit-midContent{
            padding: 10px;
            width: 100%;
        }
    }
</style>
