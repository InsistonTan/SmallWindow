<template>
<div>
    <!-- 顶部导航栏 -->
    <div style="width:100%;">
        <HeadNav setInterval="true" @getInterval="headInterval=$event" father="home" @getInfo="getInfo($event)"></HeadNav>
    </div>

    <div v-if="uid!=null">
    <!-- 左边导航栏 -->
    <div id="home-left-div" style="width:30%;float:left;">
        <!-- 副导航栏 -->
        <LeftNav :uid="uid"></LeftNav>
        <p></p>
    </div>
     <!-- 中间的主体 -->
    <!-- 中间的主体 -->
    
    <div id="home-mid-div" >
        <!-- 发表帖子的输入框 -->
        <div id="home-input-div" style="">
            <textarea class="rounded input_area" v-model="input_content" cols="72" rows="5" placeholder="写下你的心情...">
            </textarea>
            <div style="overflow:hide;">
                <div class="home_icon_div">
                    <button class="home_upload_pic" @click="open_selectPic" title="选择图片" type="button"></button>
                    <button class="home_upload_video" @click="open_selectVideo" title="选择视频" type="button"></button>
                </div>
                <!-- 显示上传进度 -->
                <span class="text-info">{{uploadFile_statu}}</span>
                <!-- 选择视频input -->
                <input id="upload_video" type="file" @change="uploadFile('video')" style="display:none;" accept="video/mp4">
                <!-- 选择图片input -->
                <input id="upload_pic" type="file" multiple="multiple" @change="uploadFile('picture')" style="display:none;" accept="image/png,image/gif,image/jpeg">
                <!-- 预览上传的图片 -->
                <ShowPicture u_src="home" :urls="upload_pic_urls" @removeItem="removeUploadPic($event)"></ShowPicture>
            </div>
            <button type="button" class="btn_submit" style="width:60px;height:30px;font-size:14px;" 
                    v-on:click="submitMessage" title="点击发表">发表
            </button>
            <span style="color:red;font-size:14px;margin-left:10px;">{{submit_result}}</span>
        </div>
        <!-- 副导航栏 -->
        <div id="home-secondNav">
            <SecondNav :login_uid="'00000'" :select_item="select_item" @clear_select="clear_select" @getSelect="second_nav_select($event)"></SecondNav>
        </div>
        <div id="home-text-latestMsg" style="text-align:center;">最新动态</div>
        <hr id="home-hr" style="height:10px;margin-top:5px;">
        <!-- 展示帖子 -->
        <div id="MessageBody">
            <div v-if="messages==null" style="text-align:center;margin-top:10px;font-size:20px;"><b>{{change_text}}</b></div>
            <div v-else-if="messages.length==0" style="text-align:center;margin-top:10px;">暂无数据</div>
            <ShowMessages v-else v-bind:messages="messages" v-bind:uid="uid" @reload="getFollowMessages"></ShowMessages>
        </div>
    </div>
    <!-- 右边展示个人信息的div -->
    <div id="home-right-div" style="width:30%;float:left;">
        <div class="rounded infoShow shadow_div">
            <div style="text-align:center; padding-top:15px;">
                <router-link :to="{path:'/Visit/',query:{uid:uid}}">
                    <img v-if="headImg==null" src="../../assets/bigUser.png" alt="头像">
                    <img v-else style="width:60px;height:60px;border-radius:30px;" :src="headImg" alt="头像">
                </router-link>
            </div>
            <div style="text-align:center;">
                <router-link :to="{path:'/Visit/',query:{uid:uid}}" class="font_shadow" style="text-decoration:none;color:rgb(205,133,63);font-size:18px;">
                    {{username}}
                </router-link>
            </div>
            <hr>
            <div style="padding-top:5px;text-align:center;padding-bottom:15px;">
                <span class="infoText">关注</span>
                <span>
                    <!-- <b><a href="#" style="text-decoration:none;" class="font_shadow">{{follow_num}}</a></b> -->
                    <b>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyFollow'}}" style="text-decoration:none;" class="font_shadow">
                            {{follow_num}}
                        </router-link>
                    </b>
                </span>
                <span class="infoText">粉丝</span>
                <span>
                    <!-- <b><a href="#" style="text-decoration:none;" class="font_shadow">{{fan_num}}</a></b> -->
                    <b>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyFan'}}" style="text-decoration:none;" class="font_shadow">
                            {{fan_num}}
                        </router-link>
                    </b>
                </span>
                <span class="infoText">小窗</span>
                <span>
                    <!-- <b><a href="#" style="text-decoration:none;" class="font_shadow">{{message_num}}</a></b> -->
                    <b>
                        <router-link :to="{path:'/MultiPage/',query:{action:'seeMyMsg'}}" style="text-decoration:none;" class="font_shadow">
                            {{message_num}}
                        </router-link>
                    </b>
                </span>
            </div>
        </div>
    </div>
    </div>
    
    <!-- 消息框组件 -->
    <MyModal :show="show_modal" :title="title" @confirm="close_modal" @close="close_modal"></MyModal>
</div>
</template>

<script>
import HeadNav from "@/components/navigation/headNav";
import SecondNav from '@/components/navigation/secondNav';
import LeftNav from "@/components/navigation/leftNav";
import ShowMessages from "@/components/functions/showMessages";
import ShowPicture from "@/components/functions/showPicture";
import MyModal from "@/components/functions/myModal";
import axios from "axios";
import {
    show
} from "../../lib/js/functions.js";
export default {
    name: 'home',
    components: {
        HeadNav,
        SecondNav,
        LeftNav,
        ShowMessages,
        ShowPicture,
        MyModal
    },
    data() {
        return {
            user: null,
            uid: null,
            username: 'username',
            follow_num: 0,
            fan_num: 0,
            message_num: 0,
            messages: null,
            input_content: null,
            submit_result: null,
            show_modal: false,
            title: null,
            select_item:null,//副导航栏选择
            change_text:'',
            headImg:null,
            upload_pic_urls:[],
            upload_video:null,
            uploadFile_statu:null,
            //getMsg_ing:false
            headInterval:null,
        }
    },
    created() {
        //this.getInfo();
        //show();
    },
    mounted() {
        this.load_animation();
        this.getFollowMessages();
    },
    beforeRouteLeave (to, from, next) {
        if(this.headInterval!=null){
            console.log("home-stop headNav getUnread Interval...");
            clearInterval(this.headInterval);
        }
        if(to.name=="index"){
            this.$destroy();
            next();
        }
        else{
            next();
        }
    },
    methods: {
        //显示图片组件移除了一个图片
        removeUploadPic(data){
            //获取这个移除的图片的index
            var index=this.upload_pic_urls.indexOf(data);
            //在json数组中移除此对象
            this.upload_pic_urls.splice(index,1);
        },
        //上传文件
        uploadFile(type){
            //获取文件
            var select_file;
            //图片是同时多图片上传
            if(type=="picture")
                select_file=document.getElementById("upload_pic").files;
            else if(type=="video") 
                select_file=document.getElementById("upload_video").files[0];
            //没有选择文件就结束运行
            if(select_file==null||select_file=="undefined")
                return;
            //处理多图片上传
            if(type=="picture")
            {
                var length=select_file.length;
                for(var i=0;i<length;i++){
                    if(select_file[i]!=null&&select_file[i]!=undefined){
                        //获取文件信息
                        var file_name=select_file[i].name;
                        var file_size=select_file[i].size;
                        console.log("文件名:"+file_name+"大小:"+file_size);
                        //截取文件后缀
                        var strs=new Array();
                        strs=file_name.split(".");
                        var length=strs.length;
                        var file_type=strs[length-1];
                        //
                        if(file_size>=1024*1024*20){
                            this.uploadFile_statu="上传失败！文件大小不能超过10M";
                            return;
                        }
                        if(file_type!="jpg"&&file_type!="png"&&file_type!="bmp"&&file_type!="jpeg"&&file_type!="gif"&&file_type!="JPG"&&file_type!="PNG"&&file_type!="BMP"&&file_type!="GIF"){
                            this.uploadFile_statu="上传失败，文件"+file_name+"类型不支持";
                            return;
                        }
                    }
                }
            }
            //处理音频、视频文件
            else if(type=="audio"||type=="video"){
                //获取文件信息
                var file_name=select_file.name;
                var file_size=select_file.size;
                console.log("文件名:"+file_name+"大小:"+file_size);
                //截取文件后缀
                var strs=new Array();
                strs=file_name.split(".");
                var length=strs.length;
                var file_type=strs[length-1];
                if(type=="audio"){

                }
                else if(type=="video"){
                    if(file_type!="mp4"&&file_type!="MP4"&&file_type!="m4v"&&file_type!="M4V"){
                        this.uploadFile_statu="上传失败，视频文件"+file_name+"类型不支持！";
                        return;
                    }
                }
            }
            else{
                this.uploadFile_statu="未知错误";
                return;
            }
            
            //上传文件
            var formData=new FormData();
            formData.append("type",type);
            //多图片处理
            if(type=="picture"){
                var len=select_file.length;
                for(var i=0;i<len;i++)
                    formData.append("files",select_file[i]);
            }
            //单文件
            else
                formData.append("files",select_file);
            
            //上传
            axios 
                .post("/api/uploadMsgFile",formData,{
                    headers:{'Content-Type':'multipart/form-data'},
                    //上传进度
                    onUploadProgress: progressEvent => {
                        var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
                        this.uploadFile_statu = "文件正在上传："+complete;
                    }
                })
                .then(response =>{
                    console.log(response.data);
                    if(response.data.type=="success"){
                        //图片文件上传成功
                        if(response.data.file_type=="picture"){
                            this.uploadFile_statu=null;
                            var res=response.data.url;
                            var urls=new Array();
                            urls=res.split(";");
                            for(var i=0;i<urls.length;i++){
                                //将上传的图片的地址加入已上传的地址json数组
                                if(urls[i]!=""&&urls[i]!=null){
                                    var picObj={"url":urls[i]};
                                    this.upload_pic_urls.push(picObj);
                                }
                            } 
                        }
                        //视频上传成功
                        else if(response.data.file_type=="video"){
                            this.uploadFile_statu="视频"+select_file.name+"上传成功！";
                            this.upload_video=response.data.url;
                        }
                    }
                    else{
                        this.uploadFile_statu="上传失败,"+response.data.msg;
                    }
                })
                .catch(function(error){
                    console.log(error);
                })

        },
        //选择要上传的视频
        open_selectVideo(){
            $("#upload_video").click();
        },
        //选择要上传的图片
        open_selectPic(){
            $("#upload_pic").click();
        },
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
        //副导航栏选择事件处理
        second_nav_select(data){
            $("body,html").scrollTop(0);
            this.messages=null;
            this.change_text="";
            this.load_animation();
            //document.documentElement.scrollTop=190;//不需要加单位
            if(data=="最新"){
                this.getNewMessage();
            }
            else if(data=="热门"){
                this.getTopMsg();   
            }
            else if(data=="关注"){
                this.getFollowMessages();   
            }
            else if(data=="点赞"){
                this.getMyLikeMsg();  
            }
            else if(data=="评论"){
                this.getMyCommentMsg();
            }
            else if(data=="收藏"){
                this.getMyCollectMsg();  
            }
        },
        //获取登陆者评论过的帖子
        getMyCommentMsg(){
            axios   
                .post("/api/getMyCommentMsg")
                .then(response =>{
                    if(response.data!=null){
                        this.messages=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取登陆者的收藏的帖子
        getMyCollectMsg(){
            axios   
                .post("/api/getMyCollectMsg")
                .then(response =>{
                    if(response.data!=null){
                        this.messages=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取登陆者的点赞的帖子
        getMyLikeMsg(){
            axios   
                .post("/api/getMyLikeMsg")
                .then(response =>{
                    if(response.data!=null){
                        this.messages=response.data;
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
                        this.messages=response.data;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //获取最新发表的帖子
        getNewMessage:function(){
            axios
                .post("/api/getNewMessage")
                .then(response=>{
                    //console.log(response);
                    if(response.data!=null)
                        this.messages=response.data;
                })
                .catch(function(error){
                    console.log(error);
                });
        },
        //关闭消息框
        close_modal() {
            this.show_modal = false;
            if (this.uid == "" || this.uid == null)
                location.replace("/#/Login/");
        },
        //从导航栏获取返回的个人信息，检查是否已经登录
        getInfo: function (data) {
            console.log("home--receieve info");
            //this.user=data;
            if (data.UID == null || data.UID == "") {
                this.title = "你还未登陆,请先登陆";
                this.show_modal = true;
                //location.href = "/";
            } else {
                this.uid = data.UID;
                this.username = data.Username;
                this.follow_num = data.followNum;
                this.fan_num = data.fanNum;
                this.message_num = data.messageNum;
                if(data.headImg!=null)
                    this.headImg=data.headImg;
            }

            // axios
            //     .post("/api/getInfo")
            //     .then(response => {
            //         //console.log(response);
            //         if (response.data.UID != null && response.data.UID != "") {
            //             this.uid = response.data.UID;
            //             this.username = response.data.Username;
            //             this.follow_num = response.data.followNum;
            //             this.fan_num = response.data.fanNum;
            //             this.message_num = response.data.messageNum;
            //         } else {
            //             alert("你还未登陆");
            //             location.href = "/";
            //         }
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     });
        },
        //获取关注者的帖子和自己的帖子
        getFollowMessages: function () {
            axios
                .post("/api/getFollowMessage")
                .then(response => {
                    //console.log(response.data);
                    
                    this.messages = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //上传帖子
        submitMessage: function () {
            //alert(this.input_content);
            if (this.input_content == null || this.input_content == "") {
                this.title = "输入的内容为空，请检查";
                this.show_modal = true;
                return;
            }
            if (this.input_content.length > 10000) {
                this.submit_result = "输入内容太长了，应该小于10000个字";
                return;
            }
            //处理换行和回车
            var text_enter=this.input_content.replace(/\n/g,'<br>');
            var text_space=text_enter.replace(/\s/g,'&nbsp;');
            var format_data=text_space;
            //获取帖子图片的url
            var msg_img_url="";
            for(var i=0;i<this.upload_pic_urls.length;i++){
                msg_img_url+=this.upload_pic_urls[i].url+";";
            }
            
            //axios请求发帖
            axios
                .post("/api/insertMessage", {
                    "content": format_data,
                    "img":msg_img_url,
                    "video":this.upload_video
                })
                .then(response => {
                    //console.log(response.data);
                    if (response.data == "success") {
                        this.upload_pic_urls=[];
                        this.uploadFile_statu=null;
                        this.input_content = null;
                        this.submit_result = null;
                        this.title = "发表成功！";
                        this.show_modal = true;
                        this.select_item="关注";
                        this.getFollowMessages();
                    } else {
                        //this.submit_result="发表失败！";
                        this.title = "发表失败！";
                        this.show_modal = true;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        clear_select(){
            this.select_item=null;
        }
    }

}
</script>

<style>
@import url("../../lib/css/home.css");
@import url("../../lib/css/shadow.css");
@import url("../../lib/css/leftNav.css");
.home_upload_pic{
    border: none;
    width: 30px;
    height: 30px;
    background: url("../../assets/pic1.png");
    background-size: 30px 30px;
}
.home_upload_pic:hover,.home_upload_pic:focus{
    background: url("../../assets/pic2.png");
    background-size: 30px 30px;
    outline: none;
}
.home_upload_video{
    margin-left: 5px;
    border: none;
    width: 30px;
    height: 30px;
    background: url("../../assets/video1.png");
    background-size: 30px 30px;
}
.home_upload_video:hover,.home_upload_video:focus{
    background: url("../../assets/video2.png");
    background-size: 30px 30px;
    outline: none;
}
.home_icon_div{
    margin-top: -8px;
    display: flex;
    flex-direction: row;
}

.home_video_upload_div{
    margin-left: 5px;
    width: 32px;
}
/* .home_video_upload_div:hover{
    cursor: pointer;
}
.home_video_upload{
    margin-top: 0px;
    width: 32px;
    height: 32px;
}
.home_video_upload:hover{
    transform: translateY(-600px);
    filter: drop-shadow(#cd853f 0 600px);
}
.home_pic_upload{
    margin-top: 0px;
    width: 30px;
    height: 30px;
}
.home_pic_upload:hover{
    transform: translateY(-500px);
    filter: drop-shadow(#cd853f 0 500px);
}
.home_pic_upload_div{
    width: 30px;
}
.home_pic_upload_div:hover{
    cursor: pointer;
} */

.input_area {
    background-color: rgba(255, 255, 255, 1);
    width: 100%;
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
}

.input_area:hover {
    background-color: rgba(255, 255, 255, 14);
}

.infoShow {
    margin: 10%;
    margin-top: 20px;
    margin-left: 5.6%;
    background-color: rgba(255, 255, 255, 1);
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
}

.infoShow:hover {
    background-color: rgba(255, 255, 255, 1);
}

.btn_submit {
    margin-top: 10px;
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

body {
    background: rgb(245, 245, 245);
    /* background-image: linear-gradient(to bottom right, #F5DEB3, #FFFFF0);
    background-repeat: no-repeat;
    background-attachment: fixed;
    animation: my_animation 16s infinite linear;
    -webkit-animation: my_animation 32s infinite linear;    */
}

@keyframes my_animation {
    0% {
        background: #F5DEB3;
        /* background-image: linear-gradient(to bottom right, #BBFFFF, #FFFFF0); */
    }

    50% {
        background: #BBFFFF;
        /* background-image: linear-gradient(to bottom right, #7FFFD4, #FFFFF0); */
    }

    100% {
        background: #F5DEB3;
        /* background-image: linear-gradient(to bottom right, #F5DEB3, #FFFFF0); */
    }
}

#home-mid-div {
    width: 40%;
    float: left;
}
#home-input-div{
    margin-top:20px;
}
#home-secondNav{
    display: none;
} 

@media screen and (max-width: 500px) {
    #home-text-latestMsg{
        display: none;
    }
    #home-secondNav{
        z-index: 2;
        position: sticky;
        top:45px;
        width: 100%;
        display:block; 
    }
    #home-hr{
        display: none;
    }
    #home-input-div{
        margin-top: -10px;
    }
    #home-mid-div {
        width: 100%;
        padding: 10px;
    }
    #home-left-div {
        display: none;
    }
    #home-right-div {
        display: none;
    }
    body {
        background: rgb(245, 245, 245);
    }
}
</style>
