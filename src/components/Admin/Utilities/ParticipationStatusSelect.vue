<template>
  <v-select
    v-model="participationStatus"
    :items="participationStatuses"
    :label="label"
    :readonly="readonly"
    :rules="rules"
  >
    <template #selection="{ item }">
      <div :class="[`${item.color}--text`]">
        {{ item.text }}
      </div>
    </template>
    <template #item="{ item }">
      <div :class="[`${item.color}--text`]">
        {{ item.text }}
      </div>
    </template>
  </v-select>
</template>

<script>
  export default {
    name: 'ParticipationStatusSelect',
    props: [
      'value',
      'label',
      'readonly',
      'rules',
    ],
    data: () => ({
      participationStatuses: [
        {
          text: 'Needs action',
          value: 'NEEDS_ACTION',
          color: 'warning',
        },
        {
          text: 'Accepted',
          value: 'ACCEPTED',
          color: 'success',
        },
      ],
    }),
    computed: {
      participationStatus: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
    },
  };
</script>

<style scoped>

</style>
