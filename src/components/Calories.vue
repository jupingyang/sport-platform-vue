<template>
    <div>
        <!-- 麵包屑導航 -->  
        <el-breadcrumb separator="〉" >
            <el-breadcrumb-item :to="{ path:'/home'}">首頁</el-breadcrumb-item>
            <el-breadcrumb-item>運動平台</el-breadcrumb-item>    
            <el-breadcrumb-item>卡路里</el-breadcrumb-item>
        </el-breadcrumb>
        <!--運動列表主體-->
        <el-card>
            <!--搜尋表單-->
            <!-- <el-row :gutter="25"> -->
                <el-form :inline="true" :model="queryForm" :rules="formRules" ref="queryFormRef" class="queryForm">
                    <el-form-item label="運動名稱" prop="activity">
                        <el-input v-model="queryForm.activity" placeholder="請輸入運動名稱" clearable @clear="isShow = false" />
                    </el-form-item>
                    <el-form-item label="體重 (磅)" prop="weight">
                        <!-- type="number" oninput="if(value>500)value=500;if(value<50)value=50" 效果不喜歡 -->
                        <el-input v-model="queryForm.weight" placeholder="請輸入體重 (磅)" clearable @clear="isShow = false"/>
                    </el-form-item>
                    <el-form-item label="運動時間" prop="duration">
                        <el-input v-model="queryForm.duration" placeholder="請輸入運動時間 (分鐘)" clearable @clear="isShow = false"/>
                    </el-form-item>
                    <div class="btns">
                        <el-form-item>
                            <el-button type="info" @click="resetQueryForm">重設</el-button> 
                            <el-button type="primary" @click="getCalories">確定</el-button>   
                        </el-form-item>
                    </div>
                </el-form>

            <!-- 運動列表 border邊框 stripe隔行變色 -->
            <el-table :data="calories" v-show="isShow" style="border stripe;"> 
                <el-table-column type="index"></el-table-column><!-- 索引列 -->
                <el-table-column label="運動名稱" prop="name" ></el-table-column>
                <el-table-column label="每小時消耗的卡路里" prop="calories_per_hour"></el-table-column>
                <el-table-column label="運動時長 (分鐘)" prop="duration_minutes"></el-table-column>
                <el-table-column label="消耗總卡路里" prop="total_calories"></el-table-column>
            </el-table>               
        </el-card>        
    </div>              
</template>    
<script>

export default {
    data(){
        return{
            // 查詢訊息實體
            queryForm:{
                activity:"",
                weight:"",
                duration:"",
            },
            // 運動資料
            calories:[],
            // 新增用戶對話框隱藏/顯示
            isShow: false, 
            formRules:{
                // weight, duration: not required
                activity:[
                    { required: true, message: "請輸入運動名稱", trigger: "blur" },
                ],
                weight:[
                    { required: true, message: "請輸入體重", trigger: "blur" },
                    { validator: this.checkWeight, message: "請輸入 50 - 500 間的數字", trigger: "blur" }
                ],
                duration:[
                    { required: true, message: "請輸入運動時間", trigger: "blur" },
                    { validator: this.checkDuration, message: "請輸入大於 1 的數字", trigger: "blur" }
                ],
            }
        };
    },
    methods:{
        // 取得食物資料
        getCalories(){
            this.$refs.queryFormRef.validate(async valid =>{
                if(!valid) return;
                const {data:res} = await this.$axios.get("http://localhost:9000/getCalories", {params: this.queryForm});
                // console.log(res); 

                if(res.flag == "success"){
                    let data = JSON.parse(res.data)
                    // console.log(data); 
                    let arr = [];
                    for(let i in data){
                        arr.push(data[i])
                    }
                    // console.log(arr); 
                    this.calories = arr;// 卡路里數據封裝
                    console.log(this.calories);
                    this.isShow = true;
                }else{
                    this.$message.error("查無資料！請重新輸入運動名稱");
                    this.isShow = false;
                }
            });         
        },
        checkWeight(rule, value, callback) {
            if (value == '' || value == undefined || value == null) {
                callback();
            } else if (!Number(value)) {
                callback(new Error('請輸入 50 - 500 間的數字'));
            } else if (value < 50 || value > 500) {
                callback(new Error('請輸入 50 - 500 間的數字'));
            } else {
                callback();
            }
        },
        checkDuration(rule, value, callback) {
            if (value < 1) {
                callback(new Error('請輸入大於 1 的數字'));
            } else {
                callback();
            }
        },
        resetQueryForm(){
            this.$refs.queryFormRef.resetFields();
            this.isShow = false;
        }
    },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 15px;
}
.queryForm .el-input {
    el-input-width: 220px;
}
.btns{
    display: flex;
    justify-content: flex-end;
    margin-right: 10%;
}
</style>
