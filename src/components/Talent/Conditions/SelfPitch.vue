<template>
  <div>
    <v-layout v-if="initialLoading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout v-else wrap class="d-block">
      <v-form v-model="valid" ref="form" @submit.prevent="submitForm" style="width: 100%">
        <div class="subheading font-weight-bold">Combien d'années d'expérience professionnelle as-tu ?</div>
        <v-flex xs12 sm4 md3>
          <v-text-field
            type="number"
            v-model="talent.yearsOfExperience"
            label="Nombre d'années d'expérience"
            :rules="[rules.positive]"
            :disabled="loading"
          ></v-text-field>
        </v-flex>
        <div class="subheading font-weight-bold">Combien gères-tu de consultants et/ou de projets ?</div>
        <v-flex xs12 sm4 md3>
          <v-text-field
            type="number"
            v-model="numberOfManagedConsultants"
            label="Nombre de consultants"
            :rules="[rules.positive]"
            :disabled="loading"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm4 md3>
          <v-text-field
            type="number"
            v-model="numberOfManagedProjects"
            label="Nombre de projets"
            :rules="[rules.positive]"
            :disabled="loading"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <div class="subheading font-weight-bold">Mets-toi en valeur en quelques mots (visible par le recruteur) :
          </div>
          <div>Quelle opportunité recherches-tu ? Quelles sont tes qualités ?</div>
        </v-flex>
        <v-flex xs12>
          <v-textarea
            v-model="talent.selfPitch"
            rows="9"
            :rules="[rules.maxLength]"
            :counter="1000"
            :readonly="loading"
          ></v-textarea>
        </v-flex>
        <v-flex xs12 class="text-xs-right">
          <!-- submit button duplicated to prevent UI bug -->
          <v-btn
            type="submit"
            color="primary"
            :disabled="!valid || loading"
            :loading="loading"
            class="hidden-sm-and-up"
          >
            Valider mon profil
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            :disabled="!valid || loading"
            :loading="loading"
            class="hidden-xs-only"
            style="position: absolute; bottom: 15px; right: 40px;"
          >
            Valider mon profil
          </v-btn>
        </v-flex>
      </v-form>
    </v-layout>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    positive: value => value >= 0 || 'La valeur doit être positive',
    maxLength: value => value.length < 1001 || 'Ta présentation est trop longue',
  };

  export default {
    name: 'ConditionsSelfPitch',
    data: () => ({
      initialLoading: false,
      loading: false,
      talent: null,
      valid: false,
      rules,
    }),
    computed: {
      ...mapGetters([
        'api',
        'user',
      ]),
      numberOfManagedConsultants: {
        get() {
          return this.talent.numberOfManagedConsultants > 0 ? this.talent.numberOfManagedConsultants : '';
        },
        set(value) {
          this.talent.numberOfManagedConsultants = value;
        },
      },
      numberOfManagedProjects: {
        get() {
          return this.talent.numberOfManagedProjects > 0 ? this.talent.numberOfManagedProjects : '';
        },
        set(value) {
          this.talent.numberOfManagedProjects = value;
        },
      },
    },
    methods: {
      ...mapActions([
        'showSnackbar',
        'setAlertComponent',
        'saveTalentData',
      ]),
      prepareForApiConsumption(initialLoading = false) {
        this.initialLoading = initialLoading;
        this.loading = true;
      },
      clearLoading() {
        this.initialLoading = false;
        this.loading = false;
      },
      submitForm() {
        this
          .saveProfile()
          .then(() => {
            this.$router.push('/talent/opportunities');
            this.showSnackbar(['Tes conditions ont été sauvegardées', 'success']);
            this.setAlertComponent({
              type: 'success',
              message: 'Merci, tu recevras un email de notification pour chaque nouvelle opportunité reçue. À bientôt !',
            });
          });
      },
      saveProfile() {
        this.prepareForApiConsumption();
        return this.saveTalentData(this.talent)
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      this
        .api(this.user._links.self.href)
        .then((response) => {
          this.talent = response.data;
        })
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
