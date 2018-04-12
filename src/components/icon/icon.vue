<template>
  <span class="icon" :class="[iconSize,classMap[typeno]]"></span>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    typeno: {
      type: Number
    },
    typesize: {
      type: Number
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
  },
  computed: {
    iconSize() {
      return "iconSize-" + this.typesize;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/scss/mixin";
@import "../../common/scss/icon.scss";

.icon {
  display: inline-block;
  background-repeat: no-repeat;
  &.iconSize-12 {
    width: 12px;
    height: 12px;
    margin-right: 4px;
    background-size: 12px 12px;
    &.decrease {
      @include bg-image("decrease_1");
    }
    &.discount {
      @include bg-image("discount_1");
    }
    &.guarantee {
      @include bg-image("guarantee_1");
    }
    &.invoice {
      @include bg-image("invoice_1");
    }
    &.special {
      @include bg-image("special_1");
    }
  }
  &.iconSize-13 {
    width: 12px;
    height: 12px;
    margin-right: 2px;
    background-size: 12px 12px;
    &.decrease {
      @include bg-image("decrease_3");
    }
    &.discount {
      @include bg-image("discount_3");
    }
    &.guarantee {
      @include bg-image("guarantee_3");
    }
    &.invoice {
      @include bg-image("invoice_3");
    }
    &.special {
      @include bg-image("special_3");
    }
  }
  &.iconSize-16 {
    width: 16px;
    height: 16px;
    background-size: 16px 16px;
    vertical-align: top;
    margin-right: 6px;
    &.decrease {
      @include bg-image("decrease_2");
    }
    &.discount {
      @include bg-image("discount_2");
    }
    &.guarantee {
      @include bg-image("guarantee_2");
    }
    &.invoice {
      @include bg-image("invoice_2");
    }
    &.special {
      @include bg-image("special_2");
    }
  }
  &.iconSize-17 {
    width: 16px;
    height: 16px;
    background-size: 16px 16px;
    vertical-align: top;
    margin-right: 6px;
    &.decrease {
      @include bg-image("decrease_4");
    }
    &.discount {
      @include bg-image("discount_4");
    }
    &.guarantee {
      @include bg-image("guarantee_4");
    }
    &.invoice {
      @include bg-image("invoice_4");
    }
    &.special {
      @include bg-image("special_4");
    }
  }
}
</style>


