<template>
  <v-flex xs12>
    <v-flex xs12 v-for="(answer, index) in typeformAnswers" :key="index"
            class="mt-2">
      <div class="font-weight-bold">{{ answer.question }}</div>
      <div>{{ answer.value }}</div>
    </v-flex>
  </v-flex>
</template>

<script>
  export default {
    name: 'typeform-answers',
    props: ['typeform'],
    data: () => ({}),
    computed: {
      typeformAnswers() {
        return this.typeform.form_response.answers.map((answer) => {
          const question = this.typeform.form_response.definition.fields
            .find(field => field.id === answer.field.id).title;
          let value = null;
          switch (answer.type) {
            case 'text':
              value = answer.text;
              break;
            case 'choice': // multiple choice / single selection
              value = answer.choice.label;
              break;
            case 'choices': // multiple choice / multiple selection
              value = answer.choices.labels.join(', ');
              break;
            default:
              value = 'N/A';
          }
          return { question, value };
        });
      },
    },
  };
</script>

<style scoped>

</style>
