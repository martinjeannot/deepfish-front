<template>
  <v-dialog
    v-model="dialog"
    max-width="650px"
  >
    <v-card>
      <v-card-title :primary-title="true">
        <div>
          <div class="headline">Nouveau poste</div>
          <div class="grey--text">Création d'un nouveau poste pour l'entreprise courante</div>
        </div>
      </v-card-title>
      <v-form
        v-model="creationFormValid"
        @submit.prevent="createRequirement"
      >
        <v-card-text>
          <v-flex xs12 sm8 offset-sm2 class="pb-3">
            <v-select
              v-model="newRequirement.jobFunction"
              :hide-details="true"
              :items="jobFunctions"
              label="Fonction"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm8 offset-sm2>
            <v-text-field
              v-model="newRequirement.name"
              label="Intitulé du poste"
            ></v-text-field>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-flex xs12 class="text-xs-right">
            <v-btn
              type="submit"
              color="primary"
            >
              créer
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex';

  export default {
    name: 'RequirementCreationDialog',
    props: {
      value: Boolean,
      companyId: String,
    },
    data: () => ({
      creationFormValid: false,
      newRequirement: {
        version: 2,
        createdBy: null,
        company: null,
        name: '',
        jobFunction: 'SALES',
      },
    }),
    computed: {
      ...mapState([
        'jobFunctions',
      ]),
      ...mapGetters([
        'api',
        'user',
        'loading',
      ]),
      dialog: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('update:value', value);
        },
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSuccessSnackbar',
        'showSnackbar',
      ]),
      createRequirement() {
        this.prepareForApiConsumption();
        // set values
        this.newRequirement.createdBy = this.user.id;
        this.newRequirement.company = `/${this.companyId}`;
        this.api
          .post('/requirements', this.newRequirement)
          .then(() => {
            this.dialog = false;
            this.showSnackbar(['Nouveau poste créé', 'success']);
            this.$emit('refresh-requirements');
          })
          .catch(() => this.showSnackbar(['Erreur', 'error']))
          .finally(() => this.clearLoading());
      },
    },
  };
</script>

<style scoped>

</style>
