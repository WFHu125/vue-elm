<template>
  <transition name="move">
      <div class="food" v-show="showFlag" ref="foodWrapper">
          <div class="food-content">
              <div class="img-header">
                  <img :src="food.image" alt="">
                  <div class="back" @click.stop.prevent="hide">
                      <i class="icon-arrow_lift"></i>
                  </div>
              </div>
              <div class="content">
                  <h1 class="title">{{food.name}}</h1>
                  <div class="detail">
                      <span class="sell-count">月售{{food.sellCount}}份</span>
                      <span class="rating">好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="carcontral-wrapper">
                    <carcontral :food="food"></carcontral>
                  </div>
                  <transition name="fade">
                    <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
                  </transition>
              </div>
              <!-- 分隔符 -->
              <split v-show="food.info"></split>
              <div class="info" v-show="food.info">
                  <h1 class="title">商品介绍</h1>
                  <p class="text">{{food.info}}</p>
              </div>
              <split></split>
              <div class="rating">
                  <h1 class="title">商品评价</h1>
                  <ratingselect :select-type="selectType" :only-content="onlyContent"
                  :desc="desc" :ratings="food.ratings" @ratingType="selectRatingType" @togglecontent="toggleContent"></ratingselect>
                  <div class="ratings-wrapper">
                      <ul v-show="food.ratings && food.ratings.length">
                          <li v-show="needshow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="rating-item border-1px">
                          <div class="user">
                            <span class="name">{{rating.username}}</span>
                            <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
                          </div>
                          <div class="time">{{rating.rateTime | formatDate}}</div>
                          <div class="text">
                            <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                            {{rating.text}}
                          </div>
                          </li>
                      </ul>
                      <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                  </div>
              </div>
          </div>
      </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import Vue from "vue";
import { formatDate } from "common/js/date";
import carcontral from "components/carcontral/carcontral";
import split from "components/split/split";
import ratingselect from "components/ratingselect/ratingselect";

// const POSITIVE = 0;
// const NEGATIVE = 1;
const ALL = 2;
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: "全部",
        positive: "推荐",
        negative: "吐槽"
      }
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodWrapper, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      if (!event._constructed) {
        return;
      }
      Vue.set(this.food, "count", 1);
      this.$emit("addCart", event.target);
    },
    selectRatingType(type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    toggleContent(onlyContent) {
      this.onlyContent = onlyContent;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    needshow(type, content) {
      if (this.onlyContent && !content) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  components: {
    carcontral,
    split,
    ratingselect
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";

.food {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background: #fff;
  transform: translate3d(0, 0, 0);
  &.move-enter-active,
  &.move-leave-active {
    transition: all 0.5s linear;
    transform: translate3d(0, 0, 0);
  }
  &.move-enter,
  &.move-leave-active {
    transform: translate3d(100%, 0, 0);
  }
  .img-header {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .back {
      position: absolute;
      top: 10px;
      left: 0;
      .icon-arrow_lift {
        display: block;
        padding: 10px;
        font-size: 20px;
        color: #fff;
      }
    }
  }
  .content {
    position: relative;
    padding: 18px;
    .title {
      font-size: 14px;
      font-weight: 700;
      color: rgb(7, 17, 27);
      line-height: 14px;
      margin-bottom: 8px;
    }
    .detail {
      margin-bottom: 18px;
      line-height: 10px;
      height: 10px;
      font-size: 0;
      .sell-count,
      .rating {
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
      .rating {
        margin-left: 12px;
      }
    }
    .price {
      line-height: 24px;
      height: 24px;
      font-size: 0;
      font-weight: 700;
      .now {
        font-size: 14px;
        color: rgb(240, 20, 20);
      }
      .old {
        font-size: 10px;
        color: rgb(147, 153, 159);
        margin-left: 8px;
        text-decoration: line-through;
      }
    }
    .carcontral-wrapper {
      position: absolute;
      right: 12px;
      bottom: 12px;
    }
    .buy {
      position: absolute;
      right: 18px;
      bottom: 18px;
      z-index: 10;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      box-sizing: border-box;
      font-size: 10px;
      color: #fff;
      border-radius: 12px;
      background: rgb(0, 160, 220);
      &.fade-enter-active,
      &.fade-leave-active {
        transition: all 0.2s;
        opacity: 1;
      }
      &.fade-enter,
      &.fade-leave-active {
        opacity: 0;
      }
    }
  }
  .info {
    padding: 18px;
    .title {
      font-size: 14px;
      font-weight: 500;
      color: rgb(7, 17, 27);
      margin-bottom: 6px;
    }
    .text {
      font-size: 12px;
      font-weight: 200;
      color: rgb(77, 85, 93);
      line-height: 24px;
      padding: 0 8px;
      box-sizing: border-box;
    }
  }
  .rating {
    .title {
      margin-top: 18px;
      margin-left: 18px;
      font-size: 14px;
      font-weight: 500;
      color: rgb(7, 17, 27);
    }
    .ratings-wrapper {
      padding: 0 18px;
      .rating-item {
        position: relative;
        padding: 16px 0;
        @include border-1px(rgba(7,17,27,0.1));
        .user {
          position: absolute;
          top: 16px;
          right: 0;
          font-size: 0;
          .name {
            display: inline-block;
            font-size: 10px;
            color: rgb(147, 153, 159);
            line-height: 12px;
            margin-right: 6px;
            vertical-align: top;
          }
          .avatar {
            border-radius: 50%;
          }
        }
        .time {
          margin-bottom: 6px;
          font-size: 14px;
          color: rgb(147, 153, 159);
          line-height: 14px;
        }
        .text {
          line-height: 16px;
          font-size: 12px;
          color: rgb(7, 17, 27);
          .icon-thumb_down,
          .icon-thumb_up {
            margin-right: 4px;
            line-height: 24px;
          }
          .icon-thumb_down {
            color: rgb(147, 153, 159);
          }
          .icon-thumb_up {
            color: rgb(0, 160, 220);
          }
        }
      }
      .no-rating {
        padding: 16px 0;
        font-size: 12px;
        color: rgb(147, 153, 159);
      }
    }
  }
}
</style>


