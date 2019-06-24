<template>
  <v-select
    v-model="time"
    :items="times"
    :label="label"
    prepend-icon="access_time"
  ></v-select>
</template>

<script>
  export default {
    name: 'InterviewTimeSelect',
    props: [
      'value',
      'label',
    ],
    data: () => ({
      startHour: 8,
      endHour: 20,
    }),
    computed: {
      time: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
      times() {
        const times = Array
          .from({ length: (this.endHour - this.startHour) + 1 }, (x, i) => `0${i + this.startHour}`.slice(-2))
          .map(hour => ['00', '30'].map(minutes => `${hour}:${minutes}`));
        return [].concat(...times); // flatten times
      },
    },
  };
</script>

<style scoped>

</style>
