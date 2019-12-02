<template>
  <v-select
    v-model="status"
    :items="statuses"
    :label="label"
  ></v-select>
</template>

<script>
  export default {
    name: 'CompanyStatusSelect',
    props: {
      label: String,
      value: String,
    },
    data: () => ({
      statuses: [
        {
          text: 'Pending',
          value: 'PENDING',
        },
        {
          text: 'Validated',
          value: 'VALIDATED',
        },
      ],
    }),
    computed: {
      status: {
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
