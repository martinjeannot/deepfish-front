<template>
  <v-layout v-if="loading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else>
    <v-flex xs12 v-for="requirement in this.requirements" :key="requirement.id">
      <h3>{{ requirement.name }}</h3>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="requirement.talents" :hide-actions="true">
          <v-flex slot="item" slot-scope="props" xs12 sm6>
            <v-card>
              <v-card-title>
                <v-flex xs4 sm2 class="text-xs-center">
                  <v-avatar size="80" class="mr-2">
                    <img :src="props.item.profile.pictureUrl" alt="picture"/>
                  </v-avatar>
                </v-flex>
                <v-flex xs8 sm10>
                  <h4>{{ props.item.firstName }} {{ props.item.lastName[0] }}.</h4>
                  {{ props.item.profile.positions.values[0].title
                  }} chez {{ props.item.profile.positions.values[0].company.name }}
                </v-flex>
              </v-card-title>
              <v-card-actions>
                <v-flex xs6 class="text-xs-center">
                  <v-btn flat color="success">Contacter</v-btn>
                </v-flex>
                <v-flex xs6 class="text-xs-center">
                  <v-btn flat color="error">Refuser</v-btn>
                </v-flex>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'employer-talents',
    data: () => ({
      requirements: [],
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'user',
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
      this
        .api(`/opportunities?projection=employer&forwarded=true&requirement.company=${this.user.company.id}`)
        .then((response) => {
          // sort talents by requirements
          response.data._embedded.opportunities.forEach((opportunity) => {
            const foundRequirement = this.requirements
              .find(requirement => requirement.id === opportunity.requirement.id);
            if (foundRequirement) {
              foundRequirement.talents.push(opportunity.talent);
            } else {
              const requirementToAdd = opportunity.requirement;
              requirementToAdd.talents = [];
              requirementToAdd.talents.push(opportunity.talent);
              this.requirements.push(requirementToAdd);
            }
          });
        })
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
