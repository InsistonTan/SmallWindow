<template>
    <div>
        <div v-for="data in comments" :key="data.id" class="comment_div" v-if="data.id!=null">
            <div id="name">
                <router-link :to="{path:'/Visit/',query:{uid:data.uid}}">
                    <img v-if="data.headImg==null" src="../../assets/user2.png" alt="user" style="width:26px;height:26px;">
                    <img v-else class="showComm_headImg" :src="data.headImg" alt="头像">
                </router-link>
                <router-link v-if="msg_uid==data.uid" :to="{path:'/Visit/',query:{uid:data.uid}}"
                    style='color:rgb(205,133,63);text-decoration:none;'>
                    {{data.username}}
                </router-link>
                <router-link v-else :to="{path:'/Visit/',query:{uid:data.uid}}" style='text-decoration:none;'>
                    {{data.username}}
                </router-link>
            </div>
            <div id="time" style="font-size:10px;">
                {{data.time}}
            </div>
            <div v-html="data.content" class="com_content">
        
            </div>
            <div>
                <span class="sc_reply" @click="reply(data.username)">回复</span>
                <span class="sc_reply" @click="deleteComment(data);data.id=null;" 
                        v-if="login_uid==data.uid||msg_uid==login_uid">删除</span>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
export default {
    name: 'showComment',
    props:['comments','msg_uid','login_uid'],
    data(){
        return{
            //1
        }
    },
    methods:{
        reply(name){
            this.$emit("reply",name);
        },
        deleteComment(comment){
            if(comment.id!=null&&comment.id!=""){
                axios 
                    .post("/api/deleteComment",{
                        "id":comment.id,
                        "msg_index":comment.msg_index
                    })
                    .then(response =>{
                        console.log("deleteComment:"+response.data);
                        if(response.data=="success"){
                            this.$emit("deleteComment");
                        }
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            }
        }
    }
}
</script>
<style>
    .showComm_headImg{
        width: 26px;
        height: 26px;
        border-radius: 13px;
    }
    .com_content{
        margin:5px;
        padding-bottom:0px;
        word-wrap: break-word;
        word-break: break-all;
    }
    .comment_div{
        margin-top: 5px;
        background: rgb(250,250,250);
        padding: 5px;
        /* font-size: 14px; */
    }
    .sc_reply{
        font-size: 12px;
        color: rgb(205,133,63);
        transition: all 0.3s;
        -webkit-transition: all 0.3s;
    }
    .sc_reply:hover{
        cursor: pointer;
        color: rgb(172, 113, 53);
    }
</style>