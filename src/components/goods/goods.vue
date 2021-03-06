<template>
  <div>
      <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for='(item,index) in goods' :key="index" class="menu-item" :class="{'active':currentIndex===index}"
                @click="selectMenu(index,$event)">
                    <span class="text border-1px">
                        <icon v-show="item.type>0" :typeno="item.type" :typesize="13"></icon>
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodWrapper">
            <ul>
                <li v-for="(item,i) in goods" :key="i" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="(food,index) in item.foods" :key="index" class="food-item border-1px" @click="selectfood(food,$event)">
                            <div class="icon">
                                <img :src="food.icon" width="57" height="57" alt="">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="description">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span>
                                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="carcontral-wrapper">
                                  <carcontral @addCart="addcart" :food="food"></carcontral>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcar ref="shopcar" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcar>
      </div>
      <food :food="selectedfood" @addCart="addcart" ref="food"></food>
  </div>
</template>
<script type="text/ecmascript-6">
import icon from "components/icon/icon";
import BScroll from "better-scroll";
import shopcar from "components/shopcar/shopcar";
import carcontral from "components/carcontral/carcontral";
import food from "components/food/food";

const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedfood: {}
    };
  },
  created() {
    this.$http.get("/api/goods").then(res => {
      res = res.data;
      if (res.errno === ERR_OK) {
        this.goods = res.data;
        this.$nextTick(() => {
          this._initScroll();
          this.caculateHeight();
        });
      }
    });
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        // 若是最后一个，height2返回undefined
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
    },
    selectFoods() {
      let foods = [];
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  methods: {
    addcart(target) {
      this._drop(target);
    },
    _drop(target) {
      // 体验优化,异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcar.drop(target);
      });
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodScroll = new BScroll(this.$refs.foodWrapper, {
        probeType: 3,
        click: true
      });
      this.foodScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    caculateHeight() {
      let foodList = this.$refs.foodWrapper.getElementsByClassName(
        "food-list-hook"
      ); // 拿到每个区间的dom值
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index, event) {
      // better-scroll中只有自己派发的点击事件才有_constructed属性，在pc上，浏览器上的点击事件return掉，只执行自己派发的事件
      if (!event._constructed) {
        return 0;
      }
      let foodList = this.$refs.foodWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let el = foodList[index];
      this.foodScroll.scrollToElement(el, 300);
    },
    selectfood(food, event) {
      if (!event._constructed) {
        return 0;
      }
      this.selectedfood = food;
      this.$refs.food.show();
    }
  },
  components: {
    icon,
    shopcar,
    carcontral,
    food
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin";

.goods {
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  display: flex;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;
    .menu-item {
      display: table;
      height: 54px;
      width: 56px;
      line-height: 14px;
      padding: 0 12px;
      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        font-size: 12px;
        font-weight: 200;
        @include border-1px(rgba(7,17,27,0.1));
      }
      &.active {
        background: rgb(255, 255, 255);
        color: rgb(7, 17, 27);
        .text {
          @include border-none();
        }
      }
    }
  }
  .foods-wrapper {
    flex: 1;
    .title {
      padding-left: 14px;
      background: #f3f5f7;
      font-size: 12px;
      color: rgb(147, 153, 159);
      line-height: 26px;
      border-left: solid 2px #d9dde1;
    }
    .food-item {
      display: flex;
      margin: 18px 18px 0 18px;
      padding-bottom: 18px;
      @include border-1px(rgba(7,17,27,0.1));
      &:last-child {
        @include border-none();
      }
      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }
      .content {
        flex: 1;
        .name {
          margin: 2px 0 8px 0;
          font-size: 14px;
          color: rgb(7, 17, 27);
          line-height: 14px;
        }
        .description,
        .extra {
          font-size: 10px;
          color: rgb(147, 153, 159);
          line-height: 10px;
        }
        .description {
          margin-bottom: 8px;
          line-height: 12px;
        }
        .extra {
          .count {
            margin-right: 12px;
          }
        }
        .price {
          line-height: 24px;
          font-weight: 700;
          .now {
            font-size: 14px;
            color: rgb(240, 20, 20);
            margin-right: 8px;
          }
          .old {
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
        .carcontral-wrapper {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>