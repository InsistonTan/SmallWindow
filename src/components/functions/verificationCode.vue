<template>
<div>
    <canvas id="codecanvas" class="codecanvas" v-bind:height="height" v-bind:width="width" v-on:click="creatCode"></canvas>
    <a href="#" v-on:click="creatCode" style="margin-left: 10px;font-size: 13px;text-decoration:none;" class="font_shadow">看不清？换一个！</a>
</div>
</template>

<script>
export default {
    name: 'verificationCode',
    props: ['width', 'height'],
    data() {
        return {
            v_code: null
        }
    },
    mounted() {
        this.creatCode();
    },
    methods: {
        //生成验证码
        creatCode: function () {
            var showCode = "";
            //document.getElementById('codecanvas')
            var canvas = document.getElementById('codecanvas');
            if (canvas != null) {
                //var width = document.getElementById('codecanvas').clientWidth;
                //var height = document.getElementById('codecanvas').clientHeight;
                var width, height;
                var context = canvas.getContext("2d");
                canvas.width = width = this.width;
                canvas.height = height = this.height;
                var sCode = "q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m,1,2,3,4,5,6,7,8,9,0";
                var aCode = sCode.split(",");
                var codeLength = aCode.length;

                for (var i = 0; i <= 3; i++) {
                    var index = Math.floor(Math.random() * codeLength);
                    showCode += aCode[index];
                }
                context.translate(10, 25);
                context.font = "bold 23px 微软雅黑";
                context.fillStyle = this.randomColor();
                context.fillText(showCode, 0, 0);

                for (var i = 0; i <= 10; i++) {
                    context.translate(-5, -5);
                    context.strokeStyle = this.randomColor();
                    context.beginPath();
                    context.moveTo(Math.random() * width, Math.random() * height);
                    context.lineTo(Math.random() * width, Math.random() * height);
                    context.stroke();
                }
                //this.v_code = showCode;
                this.$emit("getCode",showCode);
            }
        },
        //随机颜色
        randomColor: function () {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            return "rgb(" + r + "," + g + "," + b + ")";
        }

    }
}
</script>

<style>
@import url(../../lib/css/shadow.css);

.codecanvas {
    background-color: rgb(230, 230, 230);
    margin-top: 10px;
    border-radius: 4px;
    /* margin-left: -50px; */
}
</style>
