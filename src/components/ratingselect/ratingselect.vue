<template>
  <div class="ratingselect">
      <div class="rating-type border-1px">
          <span @click="select(2,$event)" class="block positive" :class="{'active':selecttype===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
          <span @click="select(0,$event)" class="block positive" :class="{'active':selecttype===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
          <span @click="select(1,$event)" class="block negative" :class="{'active':selecttype===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
      </div>
      <div @click="toggleContent" class="swith" :class="{'on':onlycontent}">
          <span class="icon-check_circle"></span>
          <span class="text">只看有内容的评价</span>
      </div>
  </div>
</template>
<script type="text/ecmascript-6">
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
  props: {
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: "全部",
          positive: "满意",
          negative: "不满意"
        };
      }
    }
  },
  data() {
    return {
      // 由于vue2.0中的变化，组件内修改props被弃用，故通过data属性，用prop去设置一个data属性的默认值
      selecttype: this.selectType,
      onlycontent: this.onlyContent
    };
  },
  computed: {
    positives() {
      return this.ratings.filter(rating => {
        return rating.rateType === POSITIVE;
      });
    },
    negatives() {
      return this.ratings.filter(rating => {
        return rating.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    select(type, event) {
      if (!event._constructed) {
        return;
      }
      this.selecttype = type;
      this.$emit("ratingType", type);
    },
    toggleContent(event) {
      if (!event._constructed) {
        return;
      }
      this.onlycontent = !this.onlycontent;
      this.$emit("togglecontent", this.onlycontent);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
.ratingselect {
  .rating-type {
    margin: 0 18px;
    padding: 18px 0;
    @include border-1px(rgba(7,17,27,0.1));
    .block {
      display: inline-block;
      padding: 8px 12px;
      margin-right: 8px;
      border-radius: 1px;
      font-size: 12px;
      line-height: 16px;
      .count {
        font-size: 8px;
        margin-left: 2px;
      }
      &.positive {
        color: rgb(77, 85, 93);
        background: rgba(0, 160, 220, 0.2);
        &.active {
          color: #fff;
          background: rgb(0, 160, 220);
        }
      }
      &.negative {
        color: rgb(77, 85, 93);
        background: rgba(77, 85, 93, 0.2);
        &.active {
          color: #fff;
          background: rgb(77, 85, 93);
        }
      }
    }
  }
  .swith {
    padding: 12px 18px;
    border-bottom: solid 1px rgba(7, 17, 27, 0.2);
    color: rgb(147, 153, 159);
    font-size: 0;
    &.on {
      .icon-check_circle {
        color: #00c850;
      }
    }
    .icon-check_circle {
      display: inline-block;
      font-size: 24px;
      margin-right: 4px;
      vertical-align: top;
    }
    .text {
      display: inline-block;
      font-size: 12px;
      line-height: 24px;
    }
  }
}
</style>


