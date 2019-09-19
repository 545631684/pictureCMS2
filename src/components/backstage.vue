<template>
    <el-container style="height: 100vh;">
        <!-- 头部 -->
        <el-header style="height: 10vh; background: #252a2f; position: relative;">
            <myHeader></myHeader>
        </el-header>
        
        <el-container style="height: 90vh;">
            <!-- 左边导航 -->
            <el-aside style="width: 220px;">
                <myLeft></myLeft>
            </el-aside>
            <!-- 主内容区 -->
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import myHeader from '../components/myHeader'
import myLeft from '../components/myLeft'
export default {
	name: 'backstage',
     data() {
      return {
      };
    },
    created () {
      this.$store.dispatch('getLocalStorage')
    },
    components: {
        myHeader,
        myLeft
    }
}
</script>

<style scoped>
</style>



// WEBPACK FOOTER //
// src/components/backstage.vue