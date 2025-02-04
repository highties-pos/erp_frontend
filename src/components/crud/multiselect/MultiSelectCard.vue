<template>
  <div>
    <Card :title="title" style="height: 500px" :spaceBetween="cardSpaceBetween">
      <MultiSelectChip
        :defaultSelectPlaceholder="defaultSelectPlaceholder"
        :title="subTitle"
        :vertical-chips="true"
        :options="options"
        :selectedValues="selectedValues"
        @update="$emit('update', $event)"
      />
    </Card>
  </div>
</template>
<script>
import Card from "../../UI/Card.vue";
import MultiSelectChip from "./MultiSelectChip.vue";

export default {
  components: {
    Card,
    MultiSelectChip,
  },
  props: {
    defaultSelectPlaceholder: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cardSpaceBetween: {
      type: Boolean,
      required: true,
    },
    subTitle: {
      type: String,
    },
    options: {
      type: Array,
      default: () => [],
    },
    selectedValues: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
<style></style>
