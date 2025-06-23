<template>
  <div class="aspect-demo">
    <div class="container">
      <h3 class="demo-title">
        常用宽高比
      </h3>

      <!-- 视频宽高比 16:9 -->
      <div class="demo-item">
        <h4>视频宽高比 (16:9)</h4>
        <div class="aspect-video">
          <div class="text-white bg-primary flex-center">
            <span>16:9 视频容器</span>
          </div>
        </div>
      </div>

      <!-- 正方形 1:1 -->
      <div class="demo-item">
        <h4>正方形 (1:1)</h4>
        <div class="aspect-square">
          <div class="bg-secondary flex-center">
            <span>1:1 正方形</span>
          </div>
        </div>
      </div>

      <!-- 竖向 9:16 -->
      <div class="demo-item">
        <h4>竖向比例 (9:16)</h4>
        <div class="aspect-portrait">
          <div class="text-white bg-primary flex-center">
            <span>9:16 竖向容器</span>
          </div>
        </div>
      </div>

      <h3 class="demo-title">
        其他比例
      </h3>

      <!-- 4:3 比例 -->
      <div class="demo-item">
        <h4>传统屏幕 (4:3)</h4>
        <div class="aspect-4-3">
          <div class="bg-secondary flex-center">
            <span>4:3 比例</span>
          </div>
        </div>
      </div>

      <!-- 3:2 比例 -->
      <div class="demo-item">
        <h4>照片比例 (3:2)</h4>
        <div class="aspect-3-2">
          <div class="text-white bg-primary flex-center">
            <span>3:2 比例</span>
          </div>
        </div>
      </div>

      <!-- 2:1 比例 -->
      <div class="demo-item">
        <h4>宽屏比例 (2:1)</h4>
        <div class="aspect-2-1">
          <div class="text-white bg-primary flex-center">
            <span>2:1 比例</span>
          </div>
        </div>
      </div>

      <!-- iphoneX 比例 -->
      <div class="demo-item">
        <h4>iPhone X (375:812)</h4>
        <div class="aspect-iphoneX">
          <div class="bg-secondary flex-center">
            <span>iPhone X 比例</span>
          </div>
        </div>
      </div>

      <h3 class="demo-title">
        自定义比例
      </h3>

      <!-- 自定义比例示例 -->
      <div class="demo-item">
        <h4>自定义比例 (5:4)</h4>
        <div class="custom-aspect-5-4">
          <div class="text-white bg-primary flex-center">
            <span>5:4 自定义比例</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AspectRatioDemo'
});
</script>

<style lang="less" scoped>
.aspect-demo {
  padding-bottom: 50px;

  .container {
    padding: 16px;
  }

  .demo-title {
    margin: 20px 0 10px;
    font-size: 18px;
    font-weight: 500;
  }

  .demo-item {
    margin-bottom: 20px;

    h4 {
      margin: 8px 0;
      font-size: 16px;
      font-weight: normal;
      color: #666;
    }

    .bg-primary {
      background-color: #3875c6;
    }

    .bg-secondary {
      background-color: #f6f7f8;
    }

    .text-white {
      color: white;
    }
  }

  // 自定义宽高比示例
  .custom-aspect-5-4 {
    .aspect-ratio(5, 4); // 直接使用mixin创建自定义比例
  }
}
</style>
