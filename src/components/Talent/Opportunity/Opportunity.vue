<template>
  <v-layout v-if="loading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else>
    {{ this.opportunity }}
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'opportunity',
    props: ['id'],
    data: () => ({
      opportunity: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this.api(`/opportunities/${this.id}`)
        .then((response) => {
          this.opportunity = response.data;
        })
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
