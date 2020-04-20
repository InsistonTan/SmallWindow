<template>
<div>
    <!-- 顶部导航栏 -->
    <HeadNav @getInfo="getInfo($event)" :search_key="key"></HeadNav>
    <!-- 下部主体 -->
    <div id="search-Maincontainer">
        <div id="search-leftContent" style="width:30%;float:left;">
            <p> </p>
        </div>
        <!-- 中间展示内容主体 -->
        <div id="midContent" style="" class="round shadow_div midContent">
            <div id="mid-container">
                <ul class="nav nav-tabs nav justify-content-center" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#search-showUser" style="color: rgb(0,0,0);">用户</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#MessageBody" style="color: rgb(0,0,0);" v-on:click="searchMessage">帖子</a>
                    </li>
                </ul>
                <!-- tab panes -->
                <div class="tab-content " style="padding-top: 10px;padding-bottom: 20px;">
                    <div id="search-showUser" class="container tab-pane active">
                        <ShowUsers v-bind:uid="uid" v-bind:users="user_data"></ShowUsers>
                    </div>
                    <div id="MessageBody" class="container tab-pane fade">
                        <ShowMessages v-bind:messages="message_data" v-bind:uid="uid"></ShowMessages>
                    </div>
                </div>
            </div>
            <!-- 展示结果的div -->
            <div id="resultBody"> </div>
        </div>

        <div id="search-rightContent" style="width:30%;float:left;">
            <p> </p>
        </div>
    </div>
</div>
</template>

<script>
import ShowMessages from "@/components/functions/showMessages";
import ShowUsers from "@/components/functions/showUsers";
import HeadNav from "@/components/navigation/headNav";
import axios from "axios";
export default {
    name: 'search',
    components: {
        HeadNav,
        ShowMessages,
        ShowUsers
    },
    data() {
        return {
            key: this.$route.query.key,
            uid: null,
            username: null,
            message_data: null,
            user_data: null

        }
    },
    mounted() {
        this.searchUser();
    },
    created() {
        //this.getInfo();
    },
    methods: {
        //获取个人信息，检查是否已经登录
        getInfo: function (data) {
            console.log("search--receieve info...");
            if (data.UID != null && data.UID != "") {
                this.uid = data.UID;
                this.username = data.Username;
            }
        },
        //搜索用户
        searchUser: function () {
            axios
                .post("/api/searchUser?keyword=" + this.key)
                .then(response => {
                    //console.log("");
                    if (response.data != null)
                        this.user_data = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //搜索帖子
        searchMessage: function () {
            axios
                .post("/api/searchMessage?keyword=" + this.key)
                .then(response => {
                    //console.log(response);
                    if (response.data != null)
                        this.message_data = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}
</script>

<style>
@import url("../../lib/css/search.css");

body {
    background: rgb(245, 245, 245);
    /* background-image: linear-gradient(to bottom right, #FFDAB9, #FFFFF0);
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-attachment: fixed; */
}

.midContent {
    width: 40%;
    float: left;
    background-color: rgba(255, 255, 255, 0.5);
    padding-bottom: 2%;
}
#search-Maincontainer{
    margin-top:75px;
}
#mid-container{
    margin-top:10px;
}
#search-showUser{
    width:60%;
}
@media screen and (max-width: 500px) {
    #search-showUser{
        width:100%;
    }
    #search-Maincontainer{
        margin-top:5px;
    }
    #search-leftContent{
        display: none;
    }
    #search-rightContent{
        display: none;
    }
    body {
        background: rgb(245, 245, 245);
    }

    .midContent {
        width: 100%;
        float: none;
        background-color: rgba(255, 255, 255, 0.5);
        padding-bottom: 2%;
    }
}
</style>
