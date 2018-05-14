<template>
  <div>
    <v-layout v-if="initialLoading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout v-else wrap class="d-block">
      <v-flex xs12>
        <span class="subheading">Combien d'années d'expérience professionnelle avez-vous ?</span>
      </v-flex>
      <v-flex xs12 sm3>
        <v-select
          :items="Array(40).fill().map((_, i) => i + 1)"
          v-model="talent.yearsOfExperience"
          :disabled="loading"
          @input="saveProfile"
        ></v-select>
      </v-flex>
      <v-flex xs12>
        <div class="subheading">Mettez-vous en valeur en quelques mots :</div>
        <div>Quelle opportunité recherchez-vous ? Quelles sont vos qualités ?</div>
      </v-flex>
      <v-form v-model="valid" ref="form" @submit.prevent="submitSelfPitch" style="width: 100%">
        <v-flex xs12>
          <v-text-field v-model="talent.selfPitch" multi-line rows="9" :rules="[rules.maxLength]" :counter="1000"
                        :readonly="loading"></v-text-field>
        </v-flex>
        <v-flex xs12 class="text-xs-right">
          <v-btn type="submit" color="primary" :disabled="!valid || loading" :loading="loading">Valider</v-btn>
        </v-flex>
      </v-form>
    </v-layout>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    maxLength: value => value.length < 1001 || 'Votre présentation est trop longue',
  };

  export default {
    name: 'conditions-self-pitch',
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
    },
    methods: {
      ...mapActions([
        'showSnackbar',
      ]),
      prepareForApiConsumption(initialLoading = false) {
        this.initialLoading = initialLoading;
        this.loading = true;
      },
      clearLoading() {
        this.initialLoading = false;
        this.loading = false;
      },
      submitSelfPitch() {
        this
          .saveProfile()
          .then(() => {
            this.$router.push('/talent/opportunities');
            this.showSnackbar('Vos conditions ont été sauvegardées');
          });
      },
      saveProfile() {
        this.prepareForApiConsumption();
        return this.api
          .patch(this.user._links.self.href, this.talent)
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
