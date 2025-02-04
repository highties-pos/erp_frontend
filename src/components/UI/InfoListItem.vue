<template>
  <div :class="['section-group-data', { 'side-by-side': sideBySide }]">
    <div class="section-group-title">{{ title }}</div>
    <div
      :style="`max-width: 300px; text-align: ${sideBySide ? 'right' : 'left'}`"
      v-if="!editMode"
      :class="[{ disabled: !value }, { red }]"
    >
      {{ formattedValue }}
      <div v-if="showViewMore && viewMoreLimitPass" class="view-more-btn" @click="viewMore">
        {{ viewAll ? "View Less" : "View More" }}
      </div>
    </div>
  </div>
</template>

<script>
import { sliceText } from "../../utils/common";

export default {
  props: {
    sliceTextLength: Number,
    showViewMore: Boolean,
    title: String,
    red: Boolean,
    value: String,
    editMode: Boolean,
    sideBySide: Boolean,
  },
  data() {
    return {
      viewAll: false,
    };
  },
  computed: {
    formattedValue() {
      let val = this.value || "<Empty>";
      if (this.sliceTextLength && !this.viewAll) {
        val = sliceText(val, this.sliceTextLength);
      }
      return val;
    },
    viewMoreLimitPass() {
      return this.sliceTextLength < this.value.length;
    },
  },
  methods: {
    viewMore() {
      this.viewAll = !this.viewAll;
    },
  },
};
</script>

<style lang="scss" scoped>
.red {
  color: red;
}
.section-group-data {
  display: flex;
  margin: 10px 0;
  gap: 15px;
  & .disabled {
    color: #bbb;
  }
}
.side-by-side {
  justify-content: space-between;
  .section-group-title {
    min-width: 0;
  }
}
.section-group-title {
  min-width: 250px;
  font-weight: bold;
}
.view-more-btn {
  cursor: pointer;
  color: dodgerblue;
}
</style>
