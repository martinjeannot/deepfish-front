<template>
  <v-text-field
    v-if="format === 'PHONE'"
    v-model="location"
    label="Phone number"
    :prepend-icon="locationIcon"
    :rules="rules"
  ></v-text-field>
  <v-textarea
    v-else
    v-model="location"
    label="Location"
    :prepend-icon="locationIcon"
    :rules="rules"
  ></v-textarea>
</template>

<script>
  export default {
    name: 'InterviewLocationInputField',
    props: [
      'value',
      'format',
      'rules',
    ],
    data: () => ({}),
    computed: {
      location: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
      locationIcon() {
        switch (this.format) {
          case 'PHONE':
            return 'phone';
          case 'VIDEO':
            return 'videocam';
          case 'IN_PERSON':
            return 'place';
          default:
            return 'not_listed_location';
        }
      },
    },
  };
</script>

<style scoped>

</style>
