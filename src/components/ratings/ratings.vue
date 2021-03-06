<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <p class="title">综合评分</p>
          <p class="rank">高于周边商家{{seller.rankRate}}%</p>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings"
      @ratingType="selectRatingType" @togglecontent="toggleContent"></ratingselect>
      <div class="ratings-wrapper">
        <ul>
          <li v-for="(rating,index) in ratings" v-show="needshow(rating.rateType,rating.text)" :key="index" class="rating-item border-1px">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28" alt="">
            </div>
            <div class="content">
              <div class="name">{{rating.username}}</div>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <div class="text">{{rating.text}}</div>
              <div class="recommend">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <span class="banner" v-for="(item,index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="no-rating"></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { formatDate } from "common/js/date";
import BScroll from "better-scroll";
import star from "components/star/star";
import split from "components/split/split";
import ratingselect from "components/ratingselect/ratingselect";

const ALL = 2;
export default {
  props: {
    seller: Object
  },
  data() {
    return {
      ratings: [],
      showFlag: false,
      selectType: ALL,
      onlyContent: true
    };
  },
  created() {
    this.$http.get("/api/ratings").then(res => {
      res = res.data;
      console.log(res);
      if (res.errno === 0) {
        this.ratings = res.data;
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          });
        });
      }
    });
  },
  methods: {
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
    needshow(type, text) {
      if (this.onlyContent && !text) {
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
    star,
    split,
    ratingselect
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin";
.ratings {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  .overview {
    display: flex;
    padding: 18px 0;
    .overview-left {
      flex: 0 0 137px;
      width: 137px;
      padding: 6px 0;
      border-right: solid 1px rgba(7, 17, 27, 0.1);
      text-align: center;
      @media only screen and (max-width: 320px) {
        flex: 0 0 120px;
        width: 120px;
      }
      .score {
        font-size: 24px;
        color: rgb(255, 153, 0);
        line-height: 28px;
      }
      .title {
        font-size: 12px;
        color: rgb(7, 17, 27);
        line-height: 12px;
        margin-top: 6px;
        margin-bottom: 8px;
      }
      .rank {
        font-size: 10px;
        color: rgb(147, 153, 159);
        line-height: 10px;
      }
    }
    .overview-right {
      flex: 1;
      padding: 6px 0 6px 24px;
      @media only screen and (max-width: 320px) {
        padding-left: 6px;
      }
      .score-wrapper {
        margin-bottom: 8px;
        font-size: 0;
        .title {
          display: inline-block;
          vertical-align: top;
          line-height: 18px;
          color: rgb(7, 17, 27);
          margin-right: 12px;
          font-size: 12px;
        }
        .star {
          display: inline-block;
        }
        .score {
          display: inline-block;
          vertical-align: top;
          line-height: 18px;
          margin-left: 12px;
          color: rgb(255, 153, 0);
          font-size: 12px;
        }
      }
      .delivery-wrapper {
        font-size: 0;
        .title {
          line-height: 18px;
          color: rgb(7, 17, 27);
          margin-right: 12px;
          font-size: 12px;
        }
        .delivery {
          color: rgb(147, 153, 159);
          font-size: 12px;
        }
      }
    }
  }
  .ratings-wrapper {
    padding: 0 18px;
    .rating-item {
      display: flex;
      padding: 18px 0;
      @include border-1px(rgba(7,17,27,0.1));
      .avatar {
        flex: 0 0 28px;
        width: 28px;
        margin-right: 12px;
        img {
          border-radius: 50%;
        }
      }
      .content {
        position: relative;
        flex: 1;
        .name {
          font-size: 10px;
          font-weight: 200;
          line-height: 12px;
          margin-bottom: 4px;
        }
        .star-wrapper {
          margin-bottom: 6px;
          font-size: 0;
          .star {
            display: inline-block;
          }
          .delivery {
            display: inline-block;
            font-size: 10px;
            font-weight: 200;
            color: rgb(147, 153, 159);
            line-height: 12px;
            vertical-align: top;
            margin-left: 6px;
          }
        }
        .text {
          margin-bottom: 8px;
          font-size: 12px;
          color: rgb(7, 17, 27);
          line-height: 18px;
        }
        .recommend {
          font-size: 0;
          .icon-thumb_up,.icon-thumb_down {
            display: inline-block;
            font-size: 12px;
            line-height: 18px;
            vertical-align: top;
            margin-right: 8px;
          }
          .icon-thumb_up{
            color: rgb(0, 160, 220);
          }
          .icon-thumb_down{
            color: rgb(147, 153, 159);
          }
          .banner {
            display: inline-block;
            vertical-align: top;
            line-height: 16px;
            padding: 0 6px;
            color: rgb(147, 153, 159);
            font-size: 9px;
            border: solid 1px rgba(7, 17, 27, 0.1);
            border-radius: 1px;
            background: #fff;
            margin-right: 8px;
            margin-bottom: 8px;
          }
        }
        .time {
          position: absolute;
          right: 0;
          top: 0;
          line-height: 12px;
          color: rgb(147, 153, 159);
          font-size: 10px;
          font-weight: 200;
        }
      }
    }
  }
}
</style>