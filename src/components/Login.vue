<template>
    <div class="login_container">
        <!-- login area -->
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt/>
            </div>
            <!-- form area -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login_form" label-width="0px">
                <!-- username -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username">
                        <template #prefix>
                            <el-icon><user /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <!-- password -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password">
                        <template #prefix>                       
                            <el-icon><lock /></el-icon>                   
                            <!-- <font-awesome-icon :icon="['fas', 'fire']" /> -->
                        </template>
                    </el-input>
                </el-form-item>
                <!-- button -->
                <div class="btns">
                    <el-form-item >
                        <el-button type="primary" @click="login">登入</el-button>
                        <el-button type="info" @click="resetLoginForm">重設</el-button>
                    </el-form-item>
                </div>
            </el-form>    
        </div>
    </div>
</template>

<script >
import { User,Lock } from '@element-plus/icons-vue'
export default{
    data(){
        return{
            loginForm:{
                username:"admin",
                password:"123456"
            },
            loginRules:{
                username:[
                    { required: true, message: '會員名稱 (必填)', trigger: 'blur' },
                    { min: 5, max: 12, message: '長度介於 5 - 12 個字數之間', trigger: 'blur' },
                ],
                password:[
                    { required: true, message: '會員密碼 (必填)', trigger: 'blur' },
                    { min: 6, max: 10, message: '長度介於 6 - 10 位數之間', trigger: 'blur' },
                ],
            },
        };
    },
    components: {
        User,Lock
    },
    methods: {
        // 重設表單內容
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        // 登入方法
        login(){
            // 驗證規則
            this.$refs.loginFormRef.validate(async valid =>{
                if( !valid ) return;// 驗證失敗
                const res = await this.$axios.post("http://localhost:9000/login",this.loginForm);// 訪問後端
                // console.log(res);
                if( res.data.flag == "success"){
                    this.$message.success("操作成功!");// 訊息提示
                    this.$router.push({path:"/home"});// 頁面路由跳轉
                    // console.log(res.data.user);
                    window.sessionStorage.setItem("user",res.data.user);// 儲存user
                }else{
                    this.$message.error("操作失敗!");// 錯誤提示
                }
            })           
        },       
    },   
}
</script>

<style lang="less" scoped>
//login_container style
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
//login_box style
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position:absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 5px;
        box-shadow: 0 0 2px #ddd;
        position:absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #0ee;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .login_form{
        position:absolute;
        bottom: 0%;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
    }
}
</style>

