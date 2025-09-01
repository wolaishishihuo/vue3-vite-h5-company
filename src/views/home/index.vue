<template>
  <div class="flex-col gap-20px p-20px">
    <h1 class="text-center">
      <JStepsCard>
        <!-- <template #header>
          <div class="step-header">
            <span class="step-title">第一步</span>
            <span class="step-time">2024-01-15 09:00</span>
          </div>
        </template> -->
        <div class="step-content">
          订单已创建，等待付款确认
        </div>
      </JStepsCard>
    </h1>
    <JButton type="primary">
      主要按钮
    </JButton>
  </div>
</template>

<script setup lang="ts">
import { JButton, JStepsCard } from '@jname/vue-mobile-components';
</script>
