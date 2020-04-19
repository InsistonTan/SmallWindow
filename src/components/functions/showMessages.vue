<template>
<div>
    <div class='rounded message_div shadow_div' v-for="data in messages" v-bind:key="data.index" >
        <div >
            <div id='Username' style='font-size:16px;margin-left:10px;padding-top:6px;'>
                <img src='../../assets/user2.png' alt='account' style='width: 18px;height: 18px;'>
                <router-link :to="{path:'/Visit/',query:{uid:data.uid}}" class='font_shadow' style='color:rgb(205,133,63);text-decoration:none;margin-left:2px;'>
                    {{data.user}}
                </router-link>
                <!-- <a href='#' class='font_shadow' style='color:rgb(205,133,63);text-decoration:none;margin-left:2px;'>
                    {{data.user}}
                </a> -->
                <!-- <button class='close' type='button' style='margin-right:4px;margin-top:-6px;' v-if="uid==data.uid" 
                @click="show_deleteModal(data.index)" title="点击删除">
                    <span v-html="">&times</span> 
                </button> -->
            </div>
            <div class="clickMsg_div" @click="seeMessage(data)" title="点击查看详情">
                <div id='time' style='font-size:10px;margin-left:10px;'>
                    {{data.time}}
                </div>
                <div id='content' style='margin:10px;font-size:14px;word-wrap: break-word;word-break: break-all;'>
                    {{data.content.substr(0,[200])}}
                    <span v-if="data.content.length>200">...</span>
                </div>
            </div>      
        </div>
        <hr style="height:0px;margin-bottom:6px;margin-top:10px;">
        <div id="footer" class="foot">
            <div class="view">
                <img src="../../assets/view.png" alt="view" class="foot_img" style="margin-left:10px;">
                <span>{{data.view}}</span>
            </div>
            <div class="like" title="点击点赞" @click="click_like(data);if(data.liked!=1){data.liked=1;data.like++;}else{data.liked=0;data.like--;}">
                <img v-if="data.liked==1" src="../../assets/liked.png" alt="liked" class="foot_img" style="margin-top:-2px;">
                <img v-else src="../../assets/like.png" alt="like" class="foot_img" style="margin-top:-2px;">
                <span>{{data.like}}</span>
            </div>
            <div class="comment">
                <img src="../../assets/comment.png" alt="comment" class="foot_img">
                <span>{{data.comment}}</span>
            </div>
            <div class="collect" title="点击收藏" @click="click_collect(data);if(data.collected!=1){data.collected=1;data.collect++;}else{data.collected=0;data.collect--;}">
                <img v-if="data.collected==1" src="../../assets/collected.png" alt="collected" class="foot_img" style="margin-top:-2px;">
                <img v-else src="../../assets/collect.png" alt="collect" class="foot_img" style="margin-top:-2px;">
                <span>{{data.collect}}</span>
            </div>
            <div class="delete" v-if="uid==data.uid" @click="show_deleteModal(data.index)" title="点击删除">
                <img src="../../assets/delete.png" alt="delete" class="foot_img" style="margin-top:-2px;">
            </div>
        </div>
    </div>

    <MyModal v-bind:show="show_modal" v-bind:title="title" @close="show_modal=false" @confirm="confirm">
    </MyModal>

</div>
</template>

<script>
import MyModal from "@/components/functions/myModal";
import axios from 'axios';
export default {
    name: 'showMessages',
    props: ['uid', 'messages'],
    components: {
        MyModal
    },
    data() {
        return {
            title: null,
            show_modal: false,
            delete_index: null
        }
    },
    mounted() {

    },
    methods: {
        //点击收藏按钮
        click_collect(data){
            //alert("click_collect");
            if(this.uid==null||this.uid==""){
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
                        "uid":this.uid
                    })
                    .then(response=>{
                        console.log("collect-server:"+response.data);
                        
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
            if(this.uid==null||this.uid==""){
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
                        "uid":this.uid
                    })
                    .then(response=>{
                        console.log("like-server:"+response.data);
                        
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

        //点击帖子，进去帖子详情
        seeMessage(data) {
            //alert("111");
            //if (data.uid != this.uid)
            this.addView(data.index);
            window.location.href="/#/ViewMsg/?index="+data.index;

        },
        //增加浏览数
        addView(index){
            var login_uid;
            if (this.uid == null || this.uid == "")
                login_uid = "visitor";
            else login_uid = this.uid;
            //增加浏览数
            axios
                .post("/api/addView", {
                    "uid": login_uid,
                    "msg_index": index
                })
                .then()
                .catch(function (error) {
                    console.log(error);
                });
        },

        //
        show_deleteModal(index) {
            this.title = "确认删除该帖子?";
            this.show_modal = true;
            this.delete_index = index;
        },
        //
        confirm(){
            if(this.title=="确认删除该帖子?")
                this.deleteMsg();
            else if(this.title=="正在删除..."||this.title=="删除成功！")
                this.show_modal=false;
            else if(this.title=="你还未登陆,请先登陆")
                window.location.href="/";
        },

        //
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
        // init_title(){
        //     this.title="确认删除该帖子?";
        // },
        success() {
            this.title = '删除成功！';
        }
    }
}
</script>

<style>
@import url("../../lib/css/shadow.css");

.view:hover,
.like:hover,
.comment:hover,
.collect:hover,
.delete:hover {
    cursor: pointer;
    color: #CD853F;
}

.view:hover img,
.like:hover img,
.comment:hover img,
.collect:hover img,
.delete:hover img {
    transform: translateY(-500px);
    filter: drop-shadow(#cd853f 0 500px);
}

.foot {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-bottom: 6px;
    font-size: 10px;
    overflow: hidden;
    /* display:inline-block;
        vertical-align:middle; */
}

.foot span {
    margin-left: 1px;
    padding-top: 2px;
}

.foot_img {
    width: 15px;
    height: 15px;
    margin-left: 20px;
}

.message_div {
    width: 100%;
    background-color: rgba(255, 255, 255, 1);
    margin-top: 10px;
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
}
.message_div:hover{
    background-color: rgba(255, 255, 255, 1);
}

.clickMsg_div:hover {
    cursor: pointer;
}
</style>
