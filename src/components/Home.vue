<template>
  <!-- 引入container布局 -->
  <el-container class="home-container">
    <!-- 頭部 -->
    <el-header>
      <div>
        <img src="../assets/02.png" alt />
        <span>個人運動平台</span>
      </div>
      <el-button type="info" @click="logout">登出</el-button>
    </el-header>
    <!-- 主體 -->
    <el-container>
      <!-- 側邊欄 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"        
          active-text-color="#ffd04b"         
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath">
          <!-- active-text-color="#409eff"    -->
          <!-- @open="handleOpen" -->
          <!-- @close="handleClose" -->

        <!-- 一級菜單 -->
          <el-sub-menu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template #title>
              <!-- <el-icon><location /></el-icon> -->
              <!-- <i :class="iconsObject[item.id]"></i> -->
              <!-- <font-awesome-icon :icon="['fas', 'fire']" /> -->
              <font-awesome-icon :icon="icons[item.id]" style="margin-right: 5px;"/>
              <span>{{item.title}}</span>
            </template>
            <!-- 二級菜單 -->
            <el-menu-item :index="it.path" v-for="it in item.subMenuList" :key="it.id" @click="saveNavState(it.path)">
              <template #title>
                <!-- <el-icon><location /></el-icon> -->
                <font-awesome-icon :icon="icons[it.id]" style="margin-right: 5px;"/>
                <span>{{it.title}}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 主體內容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { Location } from '@element-plus/icons-vue'
export default {
  data(){
    return{
      // 導航菜單列表
      menuList:[],
      // 摺疊
      isCollapse:false,
      // 導航菜單logo    
      icons :{
        '100':'user',
        '200':'person-biking',
        '101':'address-book',
        '102':'lock',
        '103':'person-swimming',
        '104':'cart-shopping',
        '201':'book',
        '202':'fire',
        '203':'bowl-rice'
      },
      activePath:'/welcome',// 預設路徑
    }
  },
  components: {
    Location
  },  
  // onload(頁面一加載)事件  
  created(){
    // 查詢menuList
    this.getMenuList();
    // 取出存在session中的路徑, 動態修改 activePath
    this.activePath = window.sessionStorage.getItem('activePath');

  }, 
  methods: {
    // 登出方法
    logout() {
      window.sessionStorage.clear(); // 清除session
      this.$router.push("/login"); // 回到登入頁
    },
    // 獲取導航菜單方法
    async getMenuList(){
      const {data:res} = await this.$axios.get("http://localhost:9000/menus");
      console.log(res);
      if(res.flag != 200) return this.$message.error("讀取菜單列表失敗!");// 錯誤提示
      this.menuList = res.menus;// 數據回填
    },
    // 控制摺疊按鈕
    toggleCollapse(){
      this.isCollapse = !this.isCollapse;
    },
    // 保存路徑
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);// 儲存在session中
      this.activePath = activePath;
    },
  },
};
</script>
<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; // 左右貼邊
  padding-left: 0%; // 左邊界
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
img {
  width: 64px;
  height: 64px;
}
// |||按鈕樣式
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
