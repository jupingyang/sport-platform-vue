<template>
    <div>
        <!-- 麵包屑導航 -->  
        <el-breadcrumb separator="〉" >
            <el-breadcrumb-item :to="{ path:'/home'}">首頁</el-breadcrumb-item>
            <el-breadcrumb-item>運動平台</el-breadcrumb-item>    
            <el-breadcrumb-item>營養配餐</el-breadcrumb-item>
        </el-breadcrumb>
        <!--食物列表主體-->
        <el-card>
            <el-row :gutter="25">
            <!--搜尋區域-->
                <!-- 搜尋列 -->
                <el-col :span="10">
                    <el-input placeholder="請輸入食物名稱" v-model="foodQuery.query" clearable @clear="isShow = false"> 
                        <template #append>
                            <el-icon @click="getFoodData" style="cursor: pointer;" ><Search /></el-icon>
                        </template>
                    </el-input> 
                </el-col>
            </el-row>
            <!-- 食物列表 border邊框 stripe隔行變色 -->
            <el-table :data="foodData" v-show="isShow" border stripe> 
                <el-table-column label="食物名稱" prop="food" ></el-table-column>
                <el-table-column label="熱量 (千卡)" prop="energy"></el-table-column>
                <el-table-column label="蛋白質 (克)" prop="protein"></el-table-column>
                <el-table-column label="脂肪 (克)" prop="fat"></el-table-column>
                <el-table-column label="碳水化合物 (克)" prop="carbohydrate"></el-table-column>
                <el-table-column label="膳食纖維 (克)" prop="fiber"></el-table-column>
            </el-table>               
        </el-card>        
    </div>              
</template>    
<script>
import { Search } from '@element-plus/icons-vue'

export default {
    data(){
        return{
            // 查詢訊息實體
            foodQuery:{
                query:"",
            },
            // 食物資料
            foodData:[],
            // 新增用戶對話框隱藏/顯示
            isShow: false, 
        };
    },
    components: {
        Search,
    },
    methods:{
        // 取得食物資料
        async getFoodData(){
            const {data:res} = await this.$axios.get("http://localhost:9000/getFood", {params:this.foodQuery});
            console.log(res);
            console.log(res.flag);

            if( res.flag == "success"){              
                this.foodData[0] = res;// 食物資料數據封裝
                this.isShow = true;
            }else{
                this.$message.error("查無資料！請重新輸入食物名稱");
                this.isShow = false;
            } 
        },
    },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 15px;
}
</style>