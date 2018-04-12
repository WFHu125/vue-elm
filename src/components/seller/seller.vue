<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="name">{{seller.name}}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.delivery}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <div class="title">公告与活动</div>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="(item,index) in seller.supports" :key="index">
            <icon :typesize="17" :typeno="seller.supports[index].type"></icon>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pics-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90" alt="">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item border-1px" v-for="(item,index) in seller.infos" :key="index">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { saveToLocal, loadFromLocal } from "common/js/store.js";
import BScroll from "better-scroll";
import star from "components/star/star";
import split from "components/split/split";
import icon from "components/icon/icon";
export default {
  props: {
    seller: Object
  },
  data() {
    return {
      favorite: (() => {
        return loadFromLocal(this.seller.id, "favorite", false);
      })()
    };
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
      this._initPics();
    });
  },
  watch: {
    seller() {
      this._initScroll();
      this._initPics();
    }
  },
  computed: {
    favoriteText() {
      return this.favorite ? "已收藏" : "收藏";
    }
  },
  methods: {
    toggleFavorite(event) {
      if (!event._constructed) {
        return;
      }
      this.favorite = !this.favorite;
      saveToLocal(this.seller.id, "favorite", this.favorite);
    },
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        });
      } else {
        this.scroll.refresh();
      }
    },
    _initPics() {
      if (this.seller.pics) {
        let picWidth = 120;
        let margin = 6;
        let width = (picWidth + margin) * this.seller.pics.length - margin;
        this.$refs.picList.style.width = width + "px";
        this.$nextTick(() => {
          if (!this.picscroll) {
            this.picscroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: "vertical"
            });
          } else {
            this.picscroll.refresh();
          }
        });
      }
    }
  },
  components: {
    star,
    split,
    icon
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/scss/mixin";
.seller {
  position: absolute;
  top: 174px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .overview {
    position: relative;
    padding: 18px 18px 0 18px;
    .name {
      font-size: 14px;
      color: rgb(7, 17, 27);
      line-height: 14px;
      margin-bottom: 8px;
    }
    .desc {
      padding-bottom: 18px;
      border-bottom: solid 1px rgba(7, 17, 27, 0.1);
      font-size: 0;
      .star {
        display: inline-block;
        margin-right: 8px;
      }
      .text {
        font-size: 10px;
        color: rgb(77, 85, 93);
        line-height: 18px;
        vertical-align: top;
        &:first-child {
          margin-right: 12px;
        }
      }
    }
    .remark {
      padding: 18px 0;
      display: flex;
      .block {
        display: inline-block;
        flex: 1;
        border-right: solid 1px rgba(7, 17, 27, 0.1);
        text-align: center;
        &:last-child {
          border-right: none;
        }
        h2 {
          color: rgb(77, 85, 93);
          font-size: 10px;
          line-height: 10px;
          margin-bottom: 4px;
        }
        .content {
          font-size: 10px;
          color: rgb(7, 17, 27);
          .stress {
            font-size: 24px;
            font-weight: 200;
            line-height: 24px;
          }
        }
      }
    }
    .favorite {
      position: absolute;
      width: 50px;
      top: 18px;
      right: 11px;
      text-align: center;
      .icon-favorite {
        display: block;
        font-size: 24px;
        line-height: 24px;
        color: #d4d6d9;
        margin-bottom: 4px;
        &.active {
          color: rgb(240, 20, 20);
        }
      }
      .text {
        font-size: 10px;
        color: rgb(77, 85, 93);
        line-height: 10px;
      }
    }
  }
  .bulletin {
    padding: 18px 18px 0 18px;
    .title {
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .content-wrapper {
      padding: 8px 12px 16px 12px;
      @include border-1px(rgba(7,17,27,0.1));
      .content {
        font-size: 12px;
        font-weight: 100;
        color: rgb(240, 20, 20);
        line-height: 24px;
      }
    }
    .supports {
      .support-item {
        padding: 16px 12px;
        @include border-1px(rgba(7,17,27,0.1));
        font-size: 0;
        &:last-child {
          @include border-none();
        }
        .text {
          display: inline-block;
          font-size: 12px;
          color: rgb(7, 17, 27);
          line-height: 16px;
        }
      }
    }
  }
  .pics {
    padding: 18px 0 18px 18px;
    .title {
      margin-bottom: 12px;
      font-size: 14px;
      line-height: 14px;
      color: rgb(7, 17, 27);
    }
    .pics-wrapper {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      .pic-list {
        font-size: 0;
        .pic-item {
          display: inline-block;
          margin-right: 6px;
          width: 120px;
          height: 90px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  .info {
    padding: 18px 18px 0 18px;
    .title {
      font-size: 14px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      padding-bottom: 12px;
      @include border-1px(rgba(7,17,27,0.1));
    }
    .info-item {
      padding: 16px 12px;
      font-size: 12px;
      font-weight: 100;
      color: rgb(7, 17, 27);
      line-height: 16px;
      @include border-1px(rgba(7,17,27,0.1));
      &:last-child {
        @include border-none();
      }
    }
  }
}
</style>