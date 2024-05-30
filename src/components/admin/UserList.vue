<template>
    <div>用戶列表
        <!-- 麵包屑導航 -->  
        <!-- <el-breadcrumb :separator-icon="ArrowRight" >     -->
        <el-breadcrumb separator="❯" ><!-- 〉﹥＞ ❭ ❯ ❱ ⟩  -->
            <el-breadcrumb-item :to="{ path:'/home'}">首頁</el-breadcrumb-item>
            <el-breadcrumb-item>權限管理</el-breadcrumb-item>    
            <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--用戶列表主體-->
        <el-card>
            <el-row :gutter="25">
            <!--搜尋區域-->
                <!-- 搜尋欄 -->
                <el-col :span="10">
                    <el-input placeholder="請輸入搜尋內容" > 
                        <template #append>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input> 
                </el-col>

                <!-- 搜尋按鈕 -->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">新增用戶</el-button>
                </el-col>
            </el-row>
        </el-card>    
    </div>
</template>
<script>
import { ArrowRight, Search } from '@element-plus/icons-vue'
export default {
    data(){
        return{

        }
    },
    components: {
        ArrowRight, Search
    },    
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 15px;
}
</style>