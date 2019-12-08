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
            @change="updateOpportunityName"
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
            rows="15"
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
      >
        envoyer mon offre
      </v-btn>
    </v-flex>
  </v-form>
</template>

<script>
  const rules = {
    required: value => !!value || 'Champ obligatoire',
    positive: value => value > 0 || 'La valeur doit être supérieure à 0',
    maxValue: value => value < 1000 || 'Le montant est en k€ (ex: 45 k€)',
  };

  export default {
    name: 'OpportunitySendingForm',
    props: {
      requirements: Array,
    },
    data: () => ({
      rules,
      opportunityFormValid: false,
      opportunity: {
        name: '',
        baseSalaryFrom: null,
        baseSalaryTo: null,
        pitch: '',
      },
      selectedRequirement: null,
    }),
    computed: {
      baseSalaryRangeValid() {
        return this.opportunity.baseSalaryFrom < this.opportunity.baseSalaryTo;
      },
    },
    methods: {
      sendOpportunity() {
        // TODO
      },
      updateOpportunityName(selectedRequirement) {
        if (selectedRequirement) {
          this.opportunity.name = selectedRequirement.name;
        }
      },
    },
  };
</script>

<style scoped>

</style>
