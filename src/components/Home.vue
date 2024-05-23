<template>
    <div>Home page
        <el-button type="info" @click="logout">登出</el-button>
    </div>    
</template>
<script>
export default {
    methods: {
        // 登出方法
        logout(){
            window.sessionStorage.clear();// 清除session
            this.$router.push("/login");// 回到登入頁
        }
    },
}
</script>
<style scoped>

</style>
