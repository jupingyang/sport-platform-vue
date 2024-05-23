import { createRouter, createWebHashHistory } from 'vue-router'
//引入Login component
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

const routes = [
  {
    path: "/",
    redirect:"/login"
  },
  {
    path:"/login",
    component: Login
  },
  {
    path:"/home",
    component: Home
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// 掛載路由導航守衛
router.beforeEach((to,from,next)=>{
  /**
   *   to 將要訪問
   * from 從哪訪問
   * next 接著做:
   *  next(url) 重定向到url,
   *  next() 繼續訪問to路徑 
   */

  // 1 訪問登入頁直接放行
  if(to.path == '/login') return next();
  // 2 訪問非登入頁先獲取user
  const userFlag = window.sessionStorage.getItem("user");// 取出當前user
  if(!userFlag) return next('/login');// 如果值為空, 回到登入頁
  // 3 符合會員要求放行
  next();
})

export default router
