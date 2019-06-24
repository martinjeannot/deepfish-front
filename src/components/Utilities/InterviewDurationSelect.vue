<template>
  <v-select
    v-model="duration"
    :items="durations"
    label="Duration"
    prepend-icon="timer"
    :rules="rules"
  ></v-select>
</template>

<script>
  export default {
    name: 'InterviewDurationSelect',
    props: [
      'value',
      'rules',
    ],
    data: () => ({
      durations: [
        {
          text: '30 min',
          value: 30,
        },
        {
          text: '1h',
          value: 60,
        },
        {
          text: '1h30',
          value: 90,
        },
      ],
    }),
    computed: {
      duration: {
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
