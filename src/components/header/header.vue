<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <icon :typeno="seller.supports[0].type" :typesize="12"></icon>
          <!-- <span class="icon" :class="this.classMap[seller.supports[0].type]"></span> -->
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%" alt="">
    </div>
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="seller-name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li v-for="(item,index) in seller.supports" :key="index" class="support-item">
                <icon :typeno="seller.supports[index].type" :typesize="16"></icon>
                <!-- <span class="icon" :class="classMap[seller.supports[index].type]"></span> -->
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.infos}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
import star from "components/star/star";
import icon from "components/icon/icon";

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      detailShow: false
    };
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invioce", "guarantee"];
  },
  methods: {
    showDetail: function() {
      this.detailShow = true;
    },
    hideDetail() {
      this.detailShow = false;
    }
  },
  components: {
    star, icon
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/scss/mixin";
@import "../../common/scss/icon.scss";

.header {
  width: 100%;
  position: relative;
  background: rgba(7, 17, 27, 0.5);
  color: #fff;
  .content-wrapper {
    position: relative;
    padding: 24px 12px 18px 24px;
    font-size: 0;
    .avatar {
      display: inline-block;
      vertical-align: top;
      img {
        border-radius: 2px;
      }
    }
    .content {
      display: inline-block;
      font-size: 14px;
      margin-left: 16px;
      .title {
        margin: 2px 0 8px 0;
        vertical-align: top;
        .brand {
          display: inline-block;
          vertical-align: top;
          width: 30px;
          height: 18px;
          @include bg-image("brand");
          background-size: 30px 18px;
          background-repeat: no-repeat;
        }
        .name {
          display: inline-block;
          margin-left: 6px;
          font-size: 16px;
          line-height: 18px;
          font-weight: bold;
        }
      }
      .description {
        font-size: 12px;
        font-weight: 200;
        line-height: 12px;
        margin-bottom: 10px;
      }
      .support {
        .text {
          vertical-align: top;
          font-size: 10px;
          font-weight: 200;
          line-height: 12px;
        }
      }
    }
    .support-count {
      position: absolute;
      right: 12px;
      bottom: 18px;
      padding: 0 8px;
      border-radius: 14px;
      text-align: center;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      .count {
        font-size: 10px;
        vertical-align: top;
        line-height: 24px;
      }
      .icon-keyboard_arrow_right {
        font-size: 10px;
        line-height: 24px;
        margin-left: 2px;
      }
    }
  }
  .bulletin-wrapper {
    position: relative;
    height: 28px;
    line-height: 28px;
    padding: 0 22px 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(7, 17, 27, 0.2);
    .bulletin-title {
      display: inline-block;
      width: 22px;
      height: 12px;
      @include bg-image("bulletin");
      background-repeat: no-repeat;
      background-size: 22px 12px;
      margin-right: 4px;
      vertical-align: top;
      margin-top: 7px;
    }
    .bulletin-text {
      font-size: 10px;
      font-weight: 200;
      margin: 0 4px;
      vertical-align: top;
    }
    .icon-keyboard_arrow_right {
      position: absolute;
      right: 12px;
      font-size: 10px;
      top: 8px;
    }
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(10px);
  }
  .detail {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(7, 17, 27, 0.8);
    &.fade-enter-active,
    &.fade-leave-active {
      transition: all 0.5s;
    }
    &.fade-enter,
    &.fade-leave-active {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }
    .detail-wrapper {
      width: 100%;
      min-height: 100%;
      .detail-main {
        margin-top: 64px;
        padding-bottom: 64px;
        .seller-name {
          font-size: 16px;
          font-weight: 700;
          line-height: 16px;
          text-align: center;
        }
        .star-wrapper {
          margin-top: 18px;
          padding: 2px 0;
          text-align: center;
        }
        .title {
          width: 80%;
          display: flex;
          margin: 28px auto 24px auto;
          .line {
            flex: 1;
            position: relative;
            top: -6px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          .text {
            padding: 0 12px;
            font-weight: 700;
            font-size: 14px;
          }
        }
        .supports {
          width: 80%;
          margin: 0 auto;
          .support-item {
            padding: 0 12px;
            margin-bottom: 12px;
            font-size: 0;
            &:last-child {
              margin-bottom: 0;
            }
            .text {
              font-size: 12px;
              font-weight: 200;
              line-height: 16px;
            }
          }
        }
        .bulletin {
          width: 80%;
          margin: 0 auto;
          .content {
            padding: 0 12px;
            font-size: 12px;
            font-weight: 200;
            line-height: 24px;
          }
        }
      }
    }
    .detail-close {
      position: relative;
      width: 32px;
      height: 32px;
      margin: -64px auto 0 auto;
      clear: both;
      font-size: 32px;
    }
  }
}
</style>