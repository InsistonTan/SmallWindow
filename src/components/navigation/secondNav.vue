<template>
<div id="snav-main-div">
    <div v-if="login_uid==null||login_uid==''">
        <div class="snav-float-left" :class="{'snav-active':select=='最新'}" @click="action('最新')">最新</div>
        <div class="snav-float-left" :class="{'snav-active':select=='热门'}" @click="action('热门')">热门</div> 
    </div>
    <div v-else>
        <div class="snav-float-left" :class="{'snav-active':select=='关注'}" @click="action('关注')">关注</div>
        <div class="snav-float-left" :class="{'snav-active':select=='热门'}" @click="action('热门')">热门</div> 
        <div class="snav-float-left" :class="{'snav-active':select=='最新'}" @click="action('最新')">最新</div>
        <div class="snav-float-left" :class="{'snav-active':select=='点赞'}" @click="action('点赞')">点赞</div>
        <div class="snav-float-left" :class="{'snav-active':select=='评论'}" @click="action('评论')">评论</div>
        <div class="snav-float-left" :class="{'snav-active':select=='收藏'}" @click="action('收藏')">收藏</div>
    </div>
    
</div>
</template>

<script>
export default {
    name: 'secondNav',
    props: ['login_uid','select_item'],
    data() {
        return {
            select:null
        }
    },
    created(){
        if(this.login_uid==null||this.login_uid=="")
            this.select='最新';
        else
            this.select='关注';
    },
    methods:{
        action(data){
            //alert(data);
            if(data=='最新'){
                this.select='最新';
                this.$emit("getSelect","最新");
            }
            else if(data=='热门'){
                this.select='热门';
                this.$emit("getSelect","热门");
            }
            else if(data=='关注'){
                this.select='关注';
                this.$emit("getSelect","关注");
            }
            else if(data=='评论'){
                this.select='评论';
                this.$emit("getSelect","评论");
            }
            else if(data=='点赞'){
                this.select='点赞';
                this.$emit("getSelect","点赞");
            }
            else if(data=='收藏'){
                this.select='收藏';
                this.$emit("getSelect","收藏");
            }
        }
    },
    watch:{
          select_item:function(newVal,oldVar){
            //alert('111');
            if(newVal=="关注"){
                this.select="关注";
                this.$emit("clear_select");
            }

          }
      }
}
</script>

<style>
.snav-active{
    background:rgb(205,133,63);
    color:white;
}
#snav-main-div{
    border-bottom: 1px solid rgb(225,225,225);
    /* border-left: 1px solid rgb(225,225,225);
    border-right: 1px solid rgb(225,225,225); */
    border-radius: 4px;
    margin-top: 10px;
    width:100%;
    background:white;
    padding: 4px;
    padding-bottom:8px;
    padding-top:8px;
}
.snav-float-left {
    display: inline;
    /* float: left; */
    padding: 6px;
    padding-left: 8px;
    padding-right: 8px;
    
    margin-left: 5px;
    border-radius: 4px;
}
.snav-float-left:hover{
    cursor: pointer;
}
</style>
