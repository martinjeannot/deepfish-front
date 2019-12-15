<template>
  <v-form v-model="opportunityFormValid" @submit.prevent="sendOpportunity">
    <v-flex xs12 class="pb-3">
      <v-card>
        <v-card-text>
          <v-select
            v-model="selectedRequirement"
            item-text="name"
            :items="requirements"
            label="Poste à pourvoir"
            prepend-icon="work"
            :return-object="true"
            :rules="[rules.required]"
            @change="onRequirementChange"
          ></v-select>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 class="pb-3">
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="opportunity.name"
            label="Intitulé du poste"
            :rules="[rules.required]"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 class="pb-3">
      <v-card>
        <v-card-text>
          <v-layout wrap align-center fill-height>
            <v-flex xs12 class="body-2">
              Fourchette de salaire fixe
            </v-flex>
            <v-flex xs5>
              <v-text-field
                v-model="opportunity.baseSalaryFrom"
                max="1000"
                min="0"
                :rules="[rules.required, rules.positive, rules.maxValue]"
                suffix="k€ / an"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex xs2 class="text-xs-center">
              à
            </v-flex>
            <v-flex xs5>
              <v-text-field
                v-model="opportunity.baseSalaryTo"
                max="1000"
                :min="opportunity.baseSalaryFrom"
                :rules="[rules.required, rules.positive, rules.maxValue]"
                suffix="k€ / an"
                type="number"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-card>
        <v-card-text>
          <v-textarea
            v-model="opportunity.pitch"
            :auto-grow="true"
            label="Message"
            rows="7"
            :rules="[rules.required]"
          ></v-textarea>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-btn
        type="submit"
        :block="true"
        color="primary"
        :disabled="!opportunityFormValid || !baseSalaryRangeValid"
        :loading="loading"
      >
        envoyer mon offre
      </v-btn>
    </v-flex>
  </v-form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    required: value => !!value || 'Champ obligatoire',
    positive: value => value > 0 || 'La valeur doit être supérieure à 0',
    maxValue: value => value < 1000 || 'Le montant est en k€ (ex: 45 k€)',
  };

  export default {
    name: 'OpportunitySendingForm',
    props: {
      loading: Boolean,
      talent: Object,
      requirements: Array,
    },
    data: () => ({
      rules,
      opportunityFormValid: false,
      opportunity: {
        employer: null,
        talent: null,
        requirement: null,
        name: '',
        baseSalaryFrom: null,
        baseSalaryTo: null,
        pitch: '',
      },
      selectedRequirement: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'user',
      ]),
      baseSalaryRangeValid() {
        return parseFloat(this.opportunity.baseSalaryFrom) <
          parseFloat(this.opportunity.baseSalaryTo);
      },
    },
    methods: {
      ...mapActions([
        'showSnackbar',
      ]),
      sendOpportunity() {
        this.$emit('prepare-for-api-consumption');
        this.opportunity.employer = this.user._links.self.href;
        this.opportunity.talent = this.talent._links.self.href;
        this.api
          .post('/opportunities', this.opportunity)
          .then((response) => {
            this.$emit('opportunity-sent', response.data);
          })
          .catch(() => this.showSnackbar(['Erreur', 'error']))
          .finally(() => this.$emit('clear-loading'));
      },
      onRequirementChange(selectedRequirement) {
        if (selectedRequirement) {
          this.opportunity.requirement = selectedRequirement._links.self.href;
          this.opportunity.name = selectedRequirement.name;
          this.populatePitch(selectedRequirement);
        }
      },
      populatePitch(selectedRequirement) {
        if (!selectedRequirement) {
          return;
        }
        this.$emit('prepare-for-api-consumption');
        this.api(`/opportunities?requirement=${selectedRequirement.id}&sort=createdAt,desc&size=1`)
          .then((response) => {
            if (response.data._embedded.opportunities.length) {
              this.opportunity.pitch = response.data._embedded.opportunities[0].pitch;
            } else {
              this.opportunity.pitch = '';
            }
          })
          .catch(() => this.showSnackbar(['Erreur', 'error']))
          .finally(() => this.$emit('clear-loading'));
      },
    },
    created() {
      if (this.requirements.length) {
        this.selectedRequirement = this.requirements[0];
        this.populatePitch(this.requirements[0]);
      }
    },
  };
</script>

<style scoped>

</style>
