<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
@import "@/styles/flex.css";
@import "@/styles/mrpd.scss";
/*每个页面公共css */
img,image{
  display: none !important;
  opacity: 0;
}
uni-page {
  font-size: 14px;
  color: #606266;

  uni-page-body {
    > view {
      overflow: auto;
    }
  }

  uni-button {
    font-size: 14px;
    padding: 0;
    background-color: $uni-color-primary;
    color: #fff;
  }

  .uni-forms-item__content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .average-box {
    display: flex;
    font-size: 24rpx;

    > view {
      flex: 1;
    }

    .value {
      font-size: 28rpx;
    }
  }

  .primary {
    color: $uni-color-primary;
  }

  .success {
    color: $uni-color-success;
  }

  .warning {
    color: $uni-color-warning;
  }

  .error {
    color: $uni-color-error;
  }


  .base-el-form {
    .average-box {
      display: flex;
      font-size: 18px;

      > view {
        flex: 1;
      }

      .value {
        font-size: 20px;
      }
    }

    .card-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;

      .el-card {
        width: 640px;
      }
    }

    &.el-form--inline.el-form--label-top {
      .el-form-item {
        display: inline-block;
      }
    }

    .el-form-item__content {
      width: 140px;
    }

    .el-card__body {
      overflow: auto;
    }

    @for $i from 1 through 50{
      .item-w-#{$i*10} {
        &.el-form-item__content, .el-form-item__content {
          width: $i*10px;
        }
      }
    }

  }


}
</style>
