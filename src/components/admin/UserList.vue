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
                <!-- 搜尋列 -->
                <el-col :span="10">
                    <el-input placeholder="請輸入搜尋內容" v-model="queryInfo.query" clearable @clear="getUserList"> 
                        <template #append>
                            <el-icon @click="getUserList"><Search /></el-icon>
                        </template>
                    </el-input> 
                </el-col>

                <!-- 搜尋按鈕 -->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">新增用戶</el-button>
                </el-col>
            </el-row>
            <!-- 用戶列表 border邊框 stripe隔行變色 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column><!-- 索引列 -->
                <el-table-column label="用戶名稱" prop="username"></el-table-column>
                <el-table-column label="電子信箱" prop="email"></el-table-column>
                <el-table-column label="密碼" prop="password"></el-table-column>
                <el-table-column label="角色" prop="role"></el-table-column>
                <el-table-column label="狀態" prop="state">
                    <!-- 作用域插槽 -->
                    <template #default="scope">
                        <!-- {{scope.row}} 每一行封裝的數據 -->
                        <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
                    </template> 
                </el-table-column>       
                <el-table-column label="操作">
                    <template #default="scope">
                        <!-- 修改按鈕 -->
                        <el-button type="primary" size="small" @click="showUpdateDialog(scope.row.id)">
                            <el-icon ><edit /></el-icon> 
                        </el-button>
                        <!-- 刪除按鈕 -->
                        <!-- <el-button type="danger" :icon="Delete" size="mini"> -->
                        <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">    
                            <el-icon ><delete /></el-icon>  
                        </el-button>
                        <!-- 設定按鈕 -->
                        <el-tooltip effect="dark" content="修改權限" placement="top-start" :enterable="false"><!-- 文字提示 enterable 隱藏-->
                            <el-button type="warning" size="small" @click="showSettingDialog(scope.row.id)">
                                <el-icon ><setting /></el-icon> 
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分頁組件 -->
            <!-- size-change 顯示記錄條數發生變化 ; current-change 當前頁發生變化 -->
            <div class="pagination-block"> 
                <el-pagination
                    @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pageNum"
                    :page-sizes="[1, 2, 5, 100]"
                    :page-size="queryInfo.pageSize" 
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"                   
                />
            </div>
        </el-card>    

        <!-- 新增用戶對話框 -->
        <el-dialog title="新增用戶" v-model="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
                <el-form-item label="用戶名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密碼" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="email" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>               
            </el-form>
            <!-- 內容底部區域 --><!-- 作用域插槽 <template #default="scope">-->  
            <template #footer>          
                <span class="dialog-footer">                           
                    <el-button @click="addDialogVisible = false">取消</el-button>    
                    <el-button type="primary" @click="addUser">確定</el-button>                         
                </span>
            </template>
        </el-dialog>
        
        <!-- 更新用戶對話框 -->
        <el-dialog title="更新用戶" v-model="updateDialogVisible" width="50%" @close="updateDialogClosed">
            <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="70px" >
                <el-form-item label="用戶名" prop="username">
                    <el-input v-model="updateForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="密碼" prop="password">
                    <el-input v-model="updateForm.password"></el-input>
                </el-form-item>
                <el-form-item label="email" prop="email">
                    <el-input v-model="updateForm.email"></el-input>
                </el-form-item>               
            </el-form>
            <!-- 內容底部區域 --><!-- 看作用域插槽 <template #default="scope">-->  
            <template #footer>          
                <span class="dialog-footer">                           
                    <el-button @click="updateDialogVisible = false">取消</el-button>    
                    <el-button type="primary" @click="updateUserInfo">確定</el-button>                         
                </span>
            </template>
        </el-dialog>

        <!-- 設定用戶權限對話框 -->
        <el-dialog title="設定用戶權限" v-model="settingDialogVisible" width="50%" @close="settingDialogClosed">
            <el-form :model="settingForm" ref="settingFormRef" label-width="70px" >
                <el-form-item label="用戶權限" prop="role">
                    <el-radio-group v-model="settingForm.role" @change="handleChange">
                        <el-radio :value="0" >超級管理員</el-radio><!--value="admimistrator"-->
                        <el-radio :value="1" >普通管理員</el-radio><!--value="powerUser"-->
                        <el-radio :value="2" >普通用戶</el-radio><!--value="user"-->
                    </el-radio-group>
                </el-form-item>                  
            </el-form>
            <!-- 內容底部區域 -->
            <template #footer>          
                <span class="dialog-footer">                           
                    <el-button @click="settingDialogVisible = false">取消</el-button>    
                    <el-button type="primary" @click="userRoleChanged">確定</el-button>                         
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script >
import { ArrowRight, Search, Delete, Edit, Setting } from '@element-plus/icons-vue'

export default {
    created(){
        this.getUserList();
    },
    data(){
        return{
            // 查詢訊息實體
            queryInfo:{
                query:"",// 查詢訊息
                pageNum: 1,// 當前頁
                pageSize: 5,// 每頁顯示記錄條數
            },
            // 用戶列表
            userList:[],
            // 總記錄數
            total: 0,
            // 新增用戶對話框隱藏/顯示
            addDialogVisible: false,            
            // 新增用戶表單
            addForm: { 
                username:'',
                password:'',
                email:'',
            },    
            // 更新用戶表單
            updateForm: {}, 
            // 設定用戶權限表單
            settingForm: {
                role:'',
            },
            // 更新用戶對話框隱藏/顯示 
            updateDialogVisible: false,
            // 設定用戶對話框隱藏/顯示 
            settingDialogVisible: false,
            // 新增用戶表單驗證   
            addFormRules:{
                username:[
                    { required: true, message: "請輸入用戶名稱", trigger: "blur" },
                    { min: 6, max: 8, message: "長度在 6 到 8 個字符間", trigger: "blur" }
                ],
                password:[
                    { required: true, message: "請輸入密碼", trigger: "blur" },
                    { min: 6, max: 8, message: "長度在 6 到 8 個字符間", trigger: "blur" }
                ],
                email:[
                    { required: true, message: "請輸入電子信箱", trigger: "blur" },
                    { min: 6, max: 30, message: "請輸入正確電子信箱地址", trigger: "blur" }
                ],
            },
            // 更新用戶表單驗證
            updateFormRules:{
                password:[
                    { required: true, message: "請輸入密碼", trigger: "blur" },
                    { min: 6, max: 8, message: "長度在 6 到 8 個字符間", trigger: "blur" }
                ],
                email:[
                    { required: true, message: "請輸入電子信箱", trigger: "blur" },
                    { min: 6, max: 30, message: "請輸入正確電子信箱地址", trigger: "blur" }
                ],
            },
        };
    },
    components: {
        ArrowRight, Search, Delete, Edit, Setting
    },
    methods: {
        // 獲取用戶列表 
        async getUserList(){
            const {data:res} = await this.$axios.get("http://localhost:9000/allUser", {params:this.queryInfo});
            this.userList = res.data;// 用戶列表數據封裝
            this.total = res.numbers;// 總用戶數
        },
        // 顯示記錄條數發生變化
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getUserList();
        },
        // 當前頁發生變化
        handleCurrentChange(newPage){
            this.queryInfo.pageNum = newPage;
            this.getUserList();
        },
        // 修改用戶狀態
        async userStateChanged(userInfo){
            // console.log(userInfo.id);
            // console.log(userInfo.state);
            const {data:res} = await this.$axios.put(`http://localhost:9000/userState?id=${userInfo.id}&state=${userInfo.state}`);
            if(res != "success"){
                userInfo.state = !userInfo.state;
                return this.$message.error("操作失敗!");
            } 
            this.$message.success("操作成功!");
        },
        // 關閉新增對話框, 表單內容重置
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();// 表單內容重置
        },
        // 新增用戶
        addUser(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return;
                const {data:res} = await this.$axios.post("http://localhost:9000/addUser", this.addForm);
                if( res != "success"){              
                    return this.$message.error("操作失敗!");
                } 
                this.$message.success("操作成功!");
                this.addDialogVisible = false;
                this.getUserList();
            });
        },
        // 根據主鍵刪除用戶方法
        async deleteUser(id){
            const confirmResult = await this.$confirm('此操作將永久刪除用戶，請問是否繼續？','提示',{
                confirmButtonText:'確定',
                cancelButtonText:'取消',
                type:'warning'
            }).catch(err => err)
            // 取消刪除
            if(confirmResult != 'confirm'){
                return this.$message.info("已取消刪除");            
            }
            // 確定刪除
            const {data:res} = await this.$axios.delete("http://localhost:9000/deleteUser?id="+id);
            if(res != "success"){              
                return this.$message.error("刪除失敗!");
            } 
            this.$message.success("刪除成功!");
            this.getUserList();
        },
        // 顯示更新用戶對話框
        async showUpdateDialog(id){
            const {data:res} = await this.$axios.get("http://localhost:9000/getUser?id="+id);            
            this.updateForm = res; // 查出的用戶資料反填到updateForm
            this.updateDialogVisible = true; // 開啟更新對話框           
        },
        // 關閉更新對話框, 表單內容重置
        updateDialogClosed(){
            this.$refs.updateFormRef.resetFields();
        },
        // 內容更新確認
        updateUserInfo(){
            this.$refs.updateFormRef.validate(async valid =>{
                if(!valid) return;
                // 發更新請求
                const {data:res} = await this.$axios.put("http://localhost:9000/updateUser", this.updateForm);
                if( res != "success"){              
                    return this.$message.error("操作失敗!");
                } 
                this.$message.success("操作成功!");
                this.updateDialogVisible = false;
                this.getUserList();
            })    
        },
        // 顯示權限設定對話框
        async showSettingDialog(id){
            const {data:res} = await this.$axios.get("http://localhost:9000/getUser?id="+id);
            // console.log(res);
            // console.log(res.role);        
            this.settingForm = res; // 
            // console.log('res.role:' , typeof res.role);//string
            // console.log('超級管理員:' , typeof "超級管理員");//string
           
            if(this.settingForm.role === '超級管理員'){
                this.settingForm.role = 0;
            }else if(this.settingForm.role === '普通管理員'){
                this.settingForm.role = 1;
            }else{
                this.settingForm.role = 2;
            }
            this.settingDialogVisible = true;           
        },
        // 關閉權限設定對話框, 表單內容重置
        settingDialogClosed(){
            this.$refs.settingFormRef.resetFields();
        },
        // 權限設定確認
        userRoleChanged(){
            console.log(this.settingForm);
            if(this.settingForm.role == 0){
                this.settingForm.role = "超級管理員";
            }else if(this.settingForm.role == 1){
                this.settingForm.role = "普通管理員";
            }else{
                this.settingForm.role = "普通用戶";
            }
            console.log(this.settingForm);

            this.$refs.settingFormRef.validate(async valid => {
                if(!valid) return;
                // 發更新請求
                const {data:res} = await this.$axios.put("http://localhost:9000/updateUser", this.settingForm);
                if( res != "success"){              
                    return this.$message.error("操作失敗!");
                } 
                this.$message.success("操作成功!");
                this.settingDialogVisible = false;
                this.getUserList();
            })
        }, 
        //handleChange
        handleChange(){
            this.$forceUpdate();
        },
    }
}    
</script>
<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 15px;
}
.pagination-block {
    margin-top: 10px;
}
</style>