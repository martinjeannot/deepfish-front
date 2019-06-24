<template>
  <v-select
    v-model="format"
    :items="formats"
    label="Format"
  ></v-select>
</template>

<script>
  export default {
    name: 'InterviewFormatSelect',
    props: [
      'value',
    ],
    data: () => ({
      formats: [
        {
          text: 'Téléphonique',
          value: 'PHONE',
        },
        {
          text: 'Vidéo',
          value: 'VIDEO',
        },
        {
          text: 'En physique',
          value: 'IN_PERSON',
        },
      ],
    }),
    computed: {
      format: {
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
