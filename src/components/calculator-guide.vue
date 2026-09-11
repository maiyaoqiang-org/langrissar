<template>
  <el-collapse class="calculator-guide-toggle">
    <el-collapse-item title="使用说明" name="instructions">
      <div class="ddjsq-guide">
        <slot />
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style>
.calculator-layout .calculator-page .calculator-guide-toggle {
  margin-top: 24px;
  overflow: hidden;
}

.calculator-layout .calculator-guide-toggle > .el-collapse-item > .el-collapse-item__header,
.calculator-layout .calculator-guide-toggle > .el-collapse-item > div > .el-collapse-item__header {
  min-height: 56px;
  padding: 14px 20px;
  color: #344b70;
  font-size: 16px;
  font-weight: 600;
}

.calculator-layout .calculator-guide-toggle > .el-collapse-item > .el-collapse-item__wrap > .el-collapse-item__content {
  padding: 0;
}

.calculator-layout .calculator-guide-toggle .ddjsq-guide {
  margin: 0;
  padding: 4px 20px 20px;
  border: 0;
  border-radius: 0;
}

.calculator-layout .calculator-guide-toggle .ddjsq-guide-notes:first-child {
  margin-top: 12px;
}

@media (max-width: 600px) {
  .calculator-layout .calculator-guide-toggle .ddjsq-guide {
    padding: 2px 16px 18px;
  }
}
</style>
