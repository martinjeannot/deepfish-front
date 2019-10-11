<template>
  <v-text-field
    v-model="searchInput"
    append-outer-icon="search"
    hide-details
    label="Search"
    single-line
    @click:append-outer="search"
    @keyup.enter="search"
  ></v-text-field>
</template>

<script>
  export default {
    name: 'SearchBox',
    props: [
      'value',
    ],
    data: () => ({}),
    computed: {
      searchInput: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
    },
    methods: {
      search() {
        this.$emit('search', this.value);
      },
    },
  };
</script>

<style scoped>

</style>
