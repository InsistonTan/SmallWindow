<template>
<div :key="this.$route.fullPath">
    <!-- 顶部导航栏 -->
    <div>
        <HeadNav @getInfo="getInfoFromNav($event)"></HeadNav>
    </div>
    <!-- 左边发帖人信息div -->
    <div id="viewMsg-left-div" style="width:30%;float:left;">
        <div class="msgUserInfo shadow_div">
            <div style="padding-top: 20px;">
                <img src="../../assets/bigUser.png" alt="头像">
            </div>
            <div id="username" style="padding-top:5px;font-size:17px;color:rgb(185,113,43);">
                <router-link :to="{path:'/Visit/',query:{uid:message.uid}}" style="text-decoration:none;color:rgb(185,113,43);">
                    {{msg_user.Username}}
                </router-link>
                <!-- <b>{{msg_user.Username}}</b> -->
            </div>
            <div v-if="msg_user.UID!=login_uid">
                <div v-if="msg_user.followed==false">
                    <button class='btn btn-outline-success btn-sm follow_btn' @click="follow">关注</button>
                </div>
                <div v-else-if="msg_user.followed==true">
                    <button class='btn btn-outline-success btn-sm followed_btn' disabled>已关注</button>
                </div>
            </div>
            <div style="padding-top:8px;text-align:center;font-size:14px;">
                <span class="infoText" style="margin-left:-5px;"><b>关注</b></span>
                <span>
                    <b v-if="message.uid==login_uid">
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyFollow'}}" style="text-decoration:none;" class="font_shadow">
                            {{msg_user.followNum}}
                        </router-link>
                    </b>
                    <b v-else>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeVisitFollow',visit_uid:message.uid}}" style="text-decoration:none;" class="font_shadow">
                            {{msg_user.followNum}}
                        </router-link>
                    </b>
                </span>
                <span class="infoText"><b>粉丝</b></span>
                <span>
                    <b v-if="message.uid==login_uid">
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyFan'}}" style="text-decoration:none;" class="font_shadow">
                            {{msg_user.fanNum}}
                        </router-link>
                    </b>
                    <b v-else>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeVisitFan',visit_uid:message.uid}}" style="text-decoration:none;" class="font_shadow">
                            {{msg_user.fanNum}}
                        </router-link>
                    </b>
                </span>
                <span class="infoText"><b>帖子</b></span>
                <span>
                    <b v-if="message.uid==login_uid">
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyMsg'}}" style="text-decoration:none;" class="font_shadow">
                            {{msg_user.messageNum}}
                        </router-link>
                    </b>
                    <b v-else>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeVisitMsg',visit_uid:message.uid}}" style="text-decoration:none;" class="font_shadow">
                            {{msg_user.messageNum}}
                        </router-link>
                    </b>
                </span>
            </div>
            <div id="info" style="font-size:13px;padding-top:5px;">
                <span>性别：<span>{{msg_user.sex}}</span></span>
                <span style="margin-left:20px;">年龄：<span>{{msg_user.age}}</span></span>
            </div>
            <div style="padding-top:5px;font-size:12px;">
                <span id="introduce">{{msg_user.introduce}}</span>
            </div>
        </div>
    </div>
    <!-- 中间帖子详情div -->
    <div id="viewMsg-mid-div">
        <div class="viewMsg_content shadow_div rounded">
            <!-- 用户名div -->
            <div id='Username' style='font-size:18px;margin-left:10px;padding-top:6px;'>
                <router-link :to="{path:'/Visit/',query:{uid:message.uid}}">
                    <img v-if="message.headImg==null" src='../../assets/user2.png' alt='account' style='width: 30px;height: 30px;'>
                    <img v-else class="viewMsg_headImg" :src='message.headImg' alt='account'>
                </router-link>
                <router-link :to="{path:'/Visit/',query:{uid:message.uid}}" class='font_shadow' style='color:rgb(205,133,63);text-decoration:none;margin-left:2px;'>
                    {{message.user}}
                </router-link>
            </div>
            <!-- 帖子时间 浏览数 删除按钮 -->
            <div class="time_div">
                {{message.time}}
                <div class="view" title="浏览数">
                    <img src="../../assets/view.png" alt="view" class="time_icon" style="margin-left:10px;">
                    <span>{{message.view}}</span>
                </div>
                <div class="delete" v-if="login_uid==message.uid" @click="show_deleteModal(message.index)" title="点击删除">
                    <img src="../../assets/delete.png" alt="delete" class="time_icon" style="margin-top:-5px;">
                </div>
            </div>
            <!-- 帖子内容div -->
            <div class="rounded msg_content" >
                {{message.content}}
            </div>
            <div class="bigIcon_div">
                <div class="like" style="margin-left:20px;" @click="click_like(message);if(message.liked!=1){message.liked=1;message.like++;}else{message.liked=0;message.like--;}">
                    <img v-if="message.liked==1" src="../../assets/big_liked.png" alt="liked" style="width:25px;height:25px;margin-top:-4px;">
                    <img v-else src="../../assets/big_like.png" alt="like" style="width:25px;height:25px;margin-top:-4px;">
                    <span>{{message.like}}</span>
                </div>
                <div class="collect" style="margin-left:5%;" @click="click_collect(message);if(message.collected!=1){message.collected=1;message.collect++;}else{message.collected=0;message.collect--;}">
                    <img v-if="message.collected==1" src="../../assets/big_collected.png" alt="collected" style="width:25px;height:25px;margin-top:-4px;">
                    <img v-else src="../../assets/big_collect.png" alt="collect" style="width:25px;height:25px;margin-top:-4px;">
                    <span>{{message.collect}}</span>
                </div>
            </div>
        </div>
        <div class="viewMsg_commit shadow_div">
            <h6 style="text-align:center;">评论<span>({{message.comment}})</span></h6>
            <div v-if="message.comment==0" style="text-align:center;margin-top:20px;font-size:16px;">
                <p>暂无评论</p>
            </div>
            <div v-else>
                <ShowComment :comments="comment" :msg_uid="message.uid" :login_uid="login_uid" @reply="comment_reply($event)" @deleteComment="deleteComment"></ShowComment>
            </div>
        </div>
    </div>
    <!-- 右边回复div -->
    <div id="viewMsg-right-div" style="width:30%;float:left;position:fixed;margin-left:70%;">
        <div class="viewMsg_input rounded shadow_div">
            <div style="margin:8px;margin-top:0px;padding-bottom:10px;">
                <textarea id="viewMsg-mobile-input" cols="36" rows="5" class="rounded" style="margin-top:5px;width:99.5%;" placeholder="回复点啥..." v-model="input_comment">
                </textarea>
                <br>
                <button type="button" class="btn_submit" @click="addComment">回复</button>
            </div> 
        </div>
    </div>
    <!-- 移动端的回复框 -->
    <div class="fixed-bottom viewMsg-mobile-input" style="padding:5px;">
        <input id="viewMsg-mobile-input" type="text" class="form-control rounded" style="width:86%;" placeholder="回复点啥..." v-model="input_comment">
        <button type="button" class="btn btn-outline-success btn-sm" @click="addComment" style="margin-left:5px;">回复</button>
    </div>
    <!-- 消息框 -->
    <MyModal v-bind:show="show_modal" v-bind:title="title" @close="closeModal" @confirm="modalConfirm">
    </MyModal>
</div>
</template>

<script>
import MyModal from "@/components/functions/myModal";
import ShowComment from "@/components/functions/showComment";
import HeadNav from "@/components/navigation/headNav";
import axios from "axios";

export default {
    name: 'viewMsg',
    components: {
        HeadNav,
        MyModal,
        ShowComment
    },
    data() {
        return {
            login_uid: null,
            login_name:null,
            msg_index: this.$route.query.index,
            comment:null,
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
            msg_user: {
                'UID': '',
                'Username': 'Username',
                'sex': '男',
                'age': '0',
                'introduce': 'introduce',
                'isFollowed': null,
                'followNum': '0',
                'fanNum': '0',
                'messageNum': '0'
            },
            input_comment:null,
            show_modal:false,
            title:null
        }
    },
    created() {
        this.getMessageByIndex();
    },
    mounted(){
        var storage=window.sessionStorage;
        console.log("this.last_path:"+storage.getItem(this.$route.fullPath));
    },
    //保存上个页面的地址
    beforeRouteEnter (to, from, next) {
        //判断在sessionStorage中是否已存在上一个页面的地址
        var storage=window.sessionStorage;
        if(storage.getItem(to.fullPath)==null)
            storage.setItem(to.fullPath,from.fullPath);
        next();  
    },
    beforeRouteLeave (to, from, next) {
        var storage=window.sessionStorage;
        var last_path=storage.getItem(from.fullPath);//上一个页面的地址

        if(to.fullPath==last_path||to.name=="index"||to.name=="home"||to.name=="search"||to.name=="multiPage"||to.name=="login"||to.name=="register"){
            this.$destroy();
            storage.removeItem(from.fullPath);
            console.log("viewMsg--destroy");
        }
        else{
            console.log("viewMsg--not destroy");
        }
        next();
    },

    methods: {
        //评论组件删除了评论
        deleteComment(){
            this.message.comment--;
        },
        //获取帖子评论
        getComments(){
            if(this.message.index!=null){
                axios
                    .post("/api/getMsgComments",{
                        "msg_index":this.message.index
                    })
                    .then(response =>{
                        //console.log(response.data);
                        
                        if(response.data!=null){
                            this.comment=response.data;
                        }
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            }
        },
        //评论组件点击回复按钮
        comment_reply(reply_name){
            this.input_comment="@"+reply_name+" ";
            $("#viewMsg-mobile-input").focus();
        },
        //右侧回复评论
        addComment(){
            if(this.login_uid==null||this.login_uid==""){
                this.title="你还未登陆,请先登陆";
                this.show_modal=true;
                return;
            }
            if(this.input_comment==null||this.input_comment==""){
                this.title="输入内容为空,请检查";
                this.show_modal=true;
            }
            else{
                axios
                    .post("/api/addComment",{
                        "msg_index":this.message.index,
                        "content":this.input_comment
                    })
                    .then(response =>{
                        //console.log("viewMsg-addComment:"+response.data);
                        if(response.data=="success"){
                            this.input_comment="";
                            this.getComments();
                            this.message.comment++;
                        }
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            }          
        },
        //点击收藏按钮
        click_collect(data){
            //alert("click_collect");
            if(this.login_uid==null||this.login_uid==""){
                this.title="你还未登陆,请先登陆";
                this.show_modal=true;
                return;
            }
            else{
                //收藏
                if(data.collected!=1){
                    axios 
                    .post("/api/addCollect",{
                        "msg_index":data.index,
                        "uid":this.login_uid
                    })
                    .then(response=>{
                        //console.log("collect-server:"+response.data);
                        
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                }
                //取消收藏
                else{
                    axios 
                    .post("/api/cancelCollect",{
                        "msg_index":data.index
                    })
                    .then(response=>{
                        console.log("cancel_collect-server:"+response.data);
                        
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                }
                    
            }
        },

        //点击点赞按钮
        click_like(data){
            //alert("click_like");
            if(this.login_uid==null||this.login_uid==""){
                this.title="你还未登陆,请先登陆";
                this.show_modal=true;
                return;
            }
            else{
                //点赞
                if(data.liked!=1){
                    axios 
                    .post("/api/addLike",{
                        "msg_index":data.index,
                        "uid":this.login_uid
                    })
                    .then(response=>{
                        //console.log("like-server:"+response.data);
                        
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                }
                //取消点赞
                else{
                    axios 
                    .post("/api/cancelLike",{
                        "msg_index":data.index
                    })
                    .then(response=>{
                        console.log("cancelike-server:"+response.data);
                        
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                }        
            }
        },

        //获取该index的帖子信息
        getMessageByIndex() {
            //console.log("viewMsg--getMessage...");
            axios
                .post("/api/getOneMessage?index=" + this.msg_index)
                .then(response => {
                    if (response.data != null) {
                        //console.log(response.data);
                        this.message = response.data;
                        //获取发帖人的个人信息
                        if (response.data.uid != null && response.data.uid != ""){
                            this.getMsgUserInfo(response.data.uid);
                            this.getComments();
                        }
                            
                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        //获取发帖人信息
        getMsgUserInfo(uid) {
            //console.log("viewMsg--getMsgUserInfo...");
            axios
                .post("/api/getVisitUserInfo?visitUID=" + uid)
                .then(response => {
                    if (response.data != null)
                        this.msg_user = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        //从导航栏获取登录信息
        getInfoFromNav(user) {
            //console.log("viewMsg--receieveInfo_from_nav...");
            if (user.UID !== null && user.UID != ""){
                this.login_uid = user.UID;
                this.login_name=user.Username;
            }      
        },

        //弹出确认框
        show_deleteModal(index) {
            this.title = "确认删除该帖子?";
            this.show_modal = true;
            this.delete_index = index;
        },

        //确认
        modalConfirm(){
            if(this.title=="确认删除该帖子?")
                this.deleteMsg();
            else if(this.title=="删除成功！"||this.title=="正在删除...")
                this.closeModal();
            else if(this.title=="你还未登陆,请先登陆"){
                //alert("login");
                window.location.href="/#/Login/";
            }
            else if(this.title=="输入内容为空,请检查")
                this.closeModal();
        },

        //删除
        deleteMsg() {
            this.title = "正在删除...";
            axios
                .post("/api/deleteMessage", {
                    "index": this.delete_index
                })
                .then(response => {
                    if (response.data == "success") {
                        setTimeout(this.success, 1000);
                        this.$emit("reload");
                    } else this.title = "删除失败！";
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        success() {
            this.title = '删除成功！';
        },
        closeModal(){
            this.show_modal=false;
            if(this.title=="删除成功！"||this.title=="正在删除...")
                window.location.href="/#/Home/";
        }
    }

}
</script>

<style>
@import url("../../lib/css/home.css");
@import url("../../lib/css/shadow.css");

body {
    background: rgb(245, 245, 245);
    /* background-image: linear-gradient(to bottom right, #87CEEB, #FFFFF0);
        background-repeat: no-repeat;
        background-attachment: fixed; */
}
.viewMsg_headImg{
    width: 30px;
    height: 30px;
    border-radius: 15px;
}
.msg_content{
    margin:10px;
    font-size:18px;
    background: rgb(250,250,250);
    padding:20px;
    word-wrap: break-word;
    word-break: break-all;
}

.viewMsg_commit{
    margin-top: 5px;
    background: white;
    width: 100%;
    padding: 10px;
    padding-bottom: 30px;
}

.bigIcon_div{
    width: 100%;
    display: flex;
    flex-direction: row;
    overflow: hidden;
}
.bigIcon_div span{
    font-size: 16px;
}

.time_div{
    display: flex;
    flex-direction: row;
    font-size:12px;
    margin-left:10px;
    margin-top:5px;
    overflow: hidden;
}

.view:hover,
.like:hover,
.collect:hover,
.delete:hover {
    cursor: pointer;
    color: #CD853F;
}

.view:hover img,
.like:hover img,
.collect:hover img,
.delete:hover img {
    transform: translateY(-500px);
    filter: drop-shadow(#cd853f 0 500px);
}

.time_icon {
    width: 15px;
    height: 15px;
    margin-left: 10px;
}

.btn_submit {
    width:60px;
    height:30px;
    font-size:12px;
    border: none;
    border-radius: 2px;
    background: rgb(205, 133, 63);
    color: rgb(250, 250, 250);
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
}

.btn_submit:hover {

    background: rgb(162, 107, 53);
    color: rgb(250, 250, 250);
}

.viewMsg_input {
    margin-top: 5px;
    margin-left: 40px;
    margin-right: 40px;
    border-radius: 2px;
    background: rgb(255, 255, 255);
}

.viewMsg_content {
    margin-top: 5px;
    width: 100%;
    background: white;
    padding-bottom: 20px;
}

.msgUserInfo {
    border-radius: 4px;
    width: 80%;
    text-align: center;
    margin: 20px;
    background: rgba(255, 255, 255, 1);
    margin-left: 40px;
    margin-top: 5px;
    padding-bottom: 20px;
}

#viewMsg-mid-div{
    width:40%;
    float:left;
}
/* 移动端的评论的输入div */
.viewMsg-mobile-input{
    display: none;
}
@media screen and (max-width: 500px){
    .viewMsg_commit{
        margin-top: 3px;
        background: white;
        width: 100%;
        padding: 10px;
        padding-bottom: 40px;
    }
    .viewMsg-mobile-input{
        background: white;
        display:flex;
        flex-direction: row;
    }
    .viewMsg_content {
        margin-top: -10px;
        width: 100%;
        background: white;
        padding-bottom: 20px;
    }

    #viewMsg-mid-div{
        /* margin: 10px; */
        width:100%;
    }
    #viewMsg-left-div{
        display: none;
    }
    #viewMsg-right-div{
        display: none;
    }
}
</style>
