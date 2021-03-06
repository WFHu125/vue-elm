<template>
  <div class="shopcar">
      <div class="content" @click="toggleList">
          <div class="content-left">
              <div class="logo-wrapper">
                  <div class="logo" :class="{'highlight':totalCount>0}">
                      <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                  </div>
                  <div class="num" v-show="totalCount>0">{{totalCount}}</div>
              </div>
              <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
              <div class="desc">
                  另需配送费￥{{deliveryPrice}}元
              </div>
          </div>
          <div class="content-right" @click.stop.prevent="pay">
              <div class="pay" :class="payClass">
              {{payDesc}}
              </div>
          </div>
      </div>
      <!-- vue2.0有变化 -->
      <transition-group class="ball-container" tag="div" name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
        <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
            <div class="inner inner-hook"></div>
        </div>
      </transition-group>
      <transition name="fold">
      <div class="shopcart-list" v-show="listshow">
          <div class="list-header">
              <h1 class="title">购物车</h1>
              <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
              <ul>
                  <li class="food" v-for="(food,index) in selectFoods" :key="index">
                      <span class="name">{{food.name}}</span>
                      <div class="price">
                          <span>￥{{food.price*food.count}}</span>
                      </div>
                      <div class="carcontral-wrapper">
                          <carcontral :food="food"></carcontral>
                      </div>
                  </li>
              </ul>
          </div>
      </div>
      </transition>
      <!-- 遮罩层 -->
      <transition name="fade">
          <div class="list-mask" @click="hideList" v-show="listshow"></div>
      </transition>
  </div>
</template>
<script type="text/ecmascript-6">
import carcontral from "components/carcontral/carcontral";
import BScroll from "better-scroll";

export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropballs: [],
      fold: true
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
      } else {
        return "去结算";
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return "not-enough";
      } else {
        return "enough";
      }
    },
    listshow() {
      if (!this.totalCount) {
        /* eslint-disable */
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show;
    }
  },
  methods: {
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    empty() {
      this.selectFoods.forEach(food => {
        food.count = 0;
      });
    },
    hideList() {
      this.fold = true;
    },
    pay() {
        if(this.totalPrice<this.minPrice){
            return;
        }
        window.alert(`支付${this.totalPrice}元`);
    },
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (ball.show === false) {
          ball.show = true;
          ball.el = el;
          this.dropballs.push(ball);
          return;
        }
      }
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show === true) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = "block";
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter(el) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        el.style.webkitTransform = "translate3d(0,0,0)";
        el.style.transform = "translate3d(0,0,0)";
        let inner = el.getElementsByClassName("inner-hook")[0];
        inner.style.webkitTransform = "translate3d(0,0,0)";
        inner.style.transform = "translate3d(0,0,0)";
      });
    },
    afterEnter(el) {
      let ball = this.dropballs.shift();
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    }
  },
  components: {
    carcontral
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/icon.scss";
@import "../../common/scss/mixin.scss";

.shopcar {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 50;
  width: 100%;
  height: 48px;
  .content {
    display: flex;
    background: #141d27;
    color: rgba(255, 255, 255, 0.4);
    .content-left {
      flex: 1;
      .logo-wrapper {
        display: inline-block;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        vertical-align: top;
        border-radius: 50%;
        background: #141d27;
        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #2b343c;
          text-align: center;
          .icon-shopping_cart {
            font-size: 24px;
            color: #80858a;
            line-height: 44px;
            &.highlight {
              color: #fff;
            }
          }
          &.highlight {
            background: rgb(0, 160, 220);
          }
        }
        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          font-size: 9px;
          font-weight: 700;
          border-radius: 16px;
          color: #fff;
          background: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }
      .price {
        display: inline-block;
        margin-top: 12px;
        vertical-align: top;
        line-height: 24px;
        font-size: 16px;
        font-weight: 700;
        padding-right: 12px;
        border-right: solid 1px rgba(255, 255, 255, 0.1);
        box-sizing: border-box;
        &.highlight {
          color: #fff;
        }
      }
      .desc {
        display: inline-block;
        margin-left: 12px;
        margin-top: 12px;
        font-size: 14px;
        font-weight: 700;
        line-height: 24px;
        vertical-align: top;
      }
    }
    .content-right {
      flex: 0 0 105px;
      width: 105px;
      .pay {
        height: 48px;
        font-size: 12px;
        font-weight: 700;
        line-height: 48px;
        text-align: center;
        &.not-enough {
          background: #2b343c;
        }
        &.enough {
          background: #00b43c;
          color: #fff;
        }
      }
    }
  }
  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgb(0, 160, 220);
      }
      &.drop-enter-active {
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
        .inner {
          transition: all 0.4s linear;
        }
      }
    }
  }
  .shopcart-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0, -100%, 0);
    &.fold-enter-active,
    &.fold-leave-active {
      transition: all 0.5s;
      transform: translate3d(0, -100%, 0);
    }
    &.fold-enter,
    &.fold-leave-active {
      transform: translate3d(0, 0, 0);
    }
    .list-header {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding: 0 13px;
      background: #f3f5f7;
      border-bottom: solid 1px rgba(7, 17, 27, 0.1);
      box-sizing: border-box;
      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
        font-weight: 200;
      }
      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }
    .list-content {
      padding: 0 18px;
      max-height: 217px;
      background: #fff;
      overflow: hidden;
      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        @include border-1px(rgba(7,17,27,0.1));
        .name {
          font-size: 14px;
          color: rgb(7, 17, 27);
          line-height: 24px;
        }
        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          color: rgb(240, 20, 20);
          font-weight: 700;
        }
        .carcontral-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.6);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    &.fade-enter-active,
    &.fade-leave-active {
      transition: all 0.5s;
      opacity: 1;
      background: rgba(7, 17, 27, 0.6);
    }
    &.fade-enter,
    &.fade-leave-active {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }
  }
}
</style>


