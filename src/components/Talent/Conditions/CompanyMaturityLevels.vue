<template>
  <v-card>
    <h4>Type d'entreprises acceptés</h4>
    <v-checkbox v-for="companyMaturityLevel in companyMaturityLevels"
                :key="companyMaturityLevel.id"
                :value="companyMaturityLevel.id"
                :label="companyMaturityLevel.l10nKey"
                v-model="companyMaturityLevelsModel"
                :disabled="loading"
    ></v-checkbox>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'conditions-company-maturity-levels',
    props: ['companyMaturityLevels', 'conditions'],
    data: () => ({
      loading: false,
    }),
    computed: {
      ...mapGetters([
        'api',
      ]),
      companyMaturityLevelsModel: {
        get() {
          return this
            .conditions.companyMaturityLevels.map(companyMaturityLevel => companyMaturityLevel.id);
        },
        set(companyMaturityLevelsModel) {
          let request = null;
          if (companyMaturityLevelsModel.length > this.conditions.companyMaturityLevels.length) {
            // bind new association
            const addedId = companyMaturityLevelsModel
              .filter(id => !this.conditions.companyMaturityLevels
                .some(companyMaturityLevel => companyMaturityLevel.id === id))[0];
            const addedCompanyMaturityLevel = this.companyMaturityLevels
              .find(companyMaturityLevel => companyMaturityLevel.id === addedId);
            request = {
              method: 'post',
              url: this.conditions._links.companyMaturityLevels.href,
              data: addedCompanyMaturityLevel._links.self.href,
            };
          } else {
            // unbind existing association
            const remainingCompanyMaturityLevels = companyMaturityLevelsModel
              .map(id => this.companyMaturityLevels
                .find(companyMaturityLevel => companyMaturityLevel.id === id)._links.self.href);
            request = {
              method: 'put',
              url: this.conditions._links.companyMaturityLevels.href,
              data: remainingCompanyMaturityLevels.join('\n'),
            };
          }
          request.headers = { 'Content-Type': 'text/uri-list' };
          this.prepareForApiConsumption();
          this
            .api(request)
            .then(() => {
              // update model
              this.conditions.companyMaturityLevels =
                companyMaturityLevelsModel.map(id => this.companyMaturityLevels
                  .find(companyMaturityLevel => companyMaturityLevel.id === id));
            })
            .finally(() => this.clearLoading());
        },
      },
    },
    methods: {
      prepareForApiConsumption() {
        this.loading = true;
      },
      clearLoading() {
        this.loading = false;
      },
    },
  };
</script>

<style scoped>

</style>
