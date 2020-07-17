<template>
    <div>
        <p v-if="urls.length>0&&u_src=='home'" class="text-info">已选择图片(点击图片可以移除):</p>
        <div class="showPic_pic_div" v-for="data in urls" :key="data.url" v-if="data.url!=''&&data.url!=null">
            <div style="display:inline;">
                <img :src="data.url"  @click="removePic(data);" alt="图片" 
                     :class="{'showPic_pic':u_src=='showMsg'||u_src=='home','showPic_pic_viewMsg':u_src=='viewMsg'}">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'showPicture',
    props:['urls','u_src'],
    data(){
        return{
            
        }
    },
    created(){

    },
    mounted(){

    },
    methods:{
        removePic(data){
            console.log(data);
            this.$emit("removeItem",data);
        }
    }
}
</script>
<style>
    /* .showPic_content{
        padding: 5px;
    } */
    .showPic_pic_div{
        display: inline;
        margin-left: 5px;
    }
    .showPic_pic_div:hover{
        cursor: pointer;
    }
    .showPic_pic{
        margin-top: 5px;
        width: 100px;
        height: 100px;
        border-radius: 4px;
    }
    .showPic_pic_viewMsg{
        margin-left: 7px;
        margin-bottom: 5px;
        width: 96%;
    }
    @media screen and (max-width: 500px){
        .showPic_pic_viewMsg{
            margin-left: 7px;
            margin-bottom: 5px;
            width: 93%;
        }
    }
</style>