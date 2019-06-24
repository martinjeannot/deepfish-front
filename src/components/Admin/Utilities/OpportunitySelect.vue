<template>
  <v-autocomplete
    v-model="opportunity"
    clearable
    :disabled="!talent"
    item-text="company.name"
    :items="opportunities"
    label="Opportunity"
    :loading="loading"
    prepend-icon="assignment"
    return-object
    :rules="rules"
    :search-input.sync="searchInput"
  ></v-autocomplete>
</template>

<script>
  import { debounce } from 'lodash';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'OpportunitySelect',
    props: [
      'value',
      'talent',
      'rules',
    ],
    data: () => ({
      opportunities: [],
      searchInput: '',
      loading: false,
    }),
    computed: {
      ...mapGetters([
        'api',
      ]),
      opportunity: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
    },
    watch: {
      searchInput(value) {
        if (value && value.length >= 3) {
          return this.debouncedSearchOpportunities(value);
        }
        return null;
      },
    },
    methods: {
      ...mapActions([
        'showSnackbar',
      ]),
      searchOpportunities(searchInput) {
        this.loading = true;
        this.api(`/opportunities/search/findInterviewSchedulableByTalentIdAndCompanyNameContainingAllIgnoreCase?projection=admin-item&talentId=${this.talent.id}&companyName=${encodeURIComponent(searchInput)}`)
          .then((response) => {
            this.opportunities = response.data._embedded.opportunities;
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => {
            this.loading = false;
          });
      },
    },
    created() {
      this.debouncedSearchOpportunities = debounce(this.searchOpportunities, 600);
    },
  };
</script>

<style scoped>

</style>
