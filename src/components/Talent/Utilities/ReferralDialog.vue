<template>
  <v-dialog v-model="dialog" v-if="talent" maxWidth="650px">
    <v-card>
      <v-card-title>
        <v-flex xs12>
          <div class="pb-2 title">L'expérience Deepfish te plaît ?</div>
          <div class="pb-2 subheading grey--text text--darken-2">
            Parraine autant de collègues ingé d'affaires, business managers ou responsables d'agence que tu le souhaites.
            Pour chacun de tes filleuls qui trouve un poste via Deepfish, nous te verserons 500€ !
          </div>
          <div class="subtitle-1 grey--text">
            L'offre de 500 € ne fonctionne pas pour les stagiaires.
          </div>
        </v-flex>
      </v-card-title>
      <v-form v-model="referralFormValid" @submit.prevent="sendInvitations">
        <v-card-text>
          <v-text-field
            v-model="emails"
            label="Emails"
            placeholder="Liste d'emails séparés par des virgules"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            v-model="subject"
            label="Sujet"
            placeholder="List d'emails séparés par des virgules"
            :rules="[rules.required]"
          ></v-text-field>
          <v-textarea
            v-model="message"
            label="Message"
            rows="11"
            :rules="[rules.required]"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-flex xs12 class="text-xs-right">
            <v-btn
              type="submit"
              color="primary"
              flat
              :loading="loading"
              :disabled="!referralFormValid"
            >
              Envoyer les invitations
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'TalentReferralDialog',
    props: ['value', 'talent'],
    data: () => ({
      rules,
      referralFormValid: false,
      emails: '',
      subject: '',
      message: '',
    }),
    computed: {
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
        'showSnackbar',
        'setSnackbar',
      ]),
      sendInvitations() {
        this.prepareForApiConsumption();
        this.api
          .post(`/talents/${this.user.id}/send-referral-invitations`, {
            emails: this.emails,
            subject: this.subject,
            message: this.message,
          })
          .then(() => {
            this.dialog = false;
            this.setDefaultReferralFormValues();
            this.showSnackbar(['Invitations envoyées avec succès', 'success']);
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
      setDefaultReferralFormValues() {
        this.emails = '';
        this.subject = `Invitation perso pour Deepfish de ${this.user.firstName} ${this.user.lastName}`;
        this.message =
          `Hello !

Je t'invite à rejoindre la plateforme de recrutement Deepfish pour recevoir des opportunités de job (Ingé d'affaires, Business Manager, Respo d'agence) parmi une centaine d'ESN, à tes conditions et en toute discrétion :)

C'est super pour faire de la veille d'opportunités sans effort et de manière anonyme !

Découvre Deepfish ici : https://www.deepfish.co

À bientôt`;
      },
    },
    created() {
      this.setDefaultReferralFormValues();
    },
  };
</script>

<style scoped>

</style>
