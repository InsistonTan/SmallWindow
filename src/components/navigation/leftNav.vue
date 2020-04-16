<template>
<!-- 副导航栏 -->
<div class="leftNav_div">
    <nav class="rounded nav nav-pills fixed-top nav justify-content-center leftNav shadow_div" v-if="uid==null||uid==''">
        <ul class="navbar-nav nav_item">
            <div>
                <li class="nav-item">
                    <router-link :to="{path:'/MultiPage/',query:{action:'seeTopMsg'}}">热门</router-link>
                </li>
            </div>
            <div>
                <li class="nav-item">
                    <a href="#">暂无</a>
                </li>
            </div>
            <div>
                <li class="nav-item">
                    <a href="#">暂无</a>
                </li>
            </div>
            <div>
                <li class="nav-item">
                    <a href="#">暂无</a>
                </li>
            </div>
            <div>
                <li class="nav-item">
                    <a href="#">暂无</a>
                </li>
            </div>
            <div>
                <li class="nav-item">
                    <a href="#">暂无</a>
                </li>
            </div>
        </ul>
    </nav>
    <nav class="rounded nav nav-pills fixed-top nav justify-content-center leftNav shadow_div" v-else>
        <ul class="navbar-nav nav_item">
            <div>
                <li class="nav-item">
                    <a href="#">点赞</a>
                </li>
            </div>
            <div>
                <li class="nav-item">
                    <a href="#">评论</a>
                </li>
            </div>
            <div>
                <li class="nav-item">
                    <a href="#">收藏</a>
                </li>
            </div>
            <div>
                <li class="nav-item">
                    <router-link :to="{path:'/MultiPage/',query:{action:'seeTopMsg'}}">热门</router-link>
                </li>
            </div>
            <div>
                <li class="nav-item">
                    <a href="#">暂无</a>
                </li>
            </div>
            <div>
                <li class="nav-item">
                    <a href="#">暂无</a>
                </li>
            </div>
        </ul>
    </nav>
    <p></p>
</div>
</template>

<script>
export default {
    name: 'leftNav',
    props: ['uid'],
    data() {
        return {}
    }
}
</script>

<style>
@import url("../../lib/css/shadow.css");
@import url("../../lib/css/leftNav.css");
</style>
