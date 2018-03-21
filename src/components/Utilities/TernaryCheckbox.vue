<template>
  <v-checkbox :label="label" :value="value" :indeterminate="indeterminate" v-model="ternaryModel"
              :color="color"></v-checkbox>
</template>

<script>
  export default {
    name: 'ternary-checkbox',
    props: ['label', 'value', 'unchecked-state-model', 'checked-state-model', 'indeterminate-state-model'],
    data: () => ({
      state: 0,
      indeterminate: false,
      arrayModels: false,
      internalUncheckedStateModel: this.uncheckedStateModel, // state 0
      internalCheckedStateModel: this.checkedStateModel, // state 1
      internalIndeterminateStateModel: this.indeterminateStateModel, // state 2
      color: null,
    }),
    computed: {
      ternaryModel: {
        get() {
          return this.state ? this.value : null;
        },
        set(/* value */) {
          this.state = (this.state + 1) % 3; // state rotation
          if (this.state) {
            if (this.state === 1) {
              this.setCheckedStateValue(this.value);
            } else {
              this.setIndeterminateStateValue(this.value);
            }
          } else {
            this.setUncheckedStateValue(this.value);
          }
          this.$emit('update:uncheckedStateModel', this.internalUncheckedStateModel);
          this.$emit('update:checkedStateModel', this.internalCheckedStateModel);
          this.$emit('update:indeterminateStateModel', this.internalIndeterminateStateModel);
        },
      },
    },
    methods: {
      setUncheckedStateValue(value) {
        this.indeterminate = false;
        if (this.arrayModels) {
          this.internalUncheckedStateModel.push(value);
          this.removeValueFromArray(value, this.internalCheckedStateModel);
          this.removeValueFromArray(value, this.internalIndeterminateStateModel);
        } else {
          this.internalUncheckedStateModel = value;
          this.internalCheckedStateModel = null;
          this.internalIndeterminateStateModel = null;
        }
        this.color = null;
      },
      setCheckedStateValue(value) {
        this.indeterminate = false;
        if (this.arrayModels) {
          this.removeValueFromArray(value, this.internalUncheckedStateModel);
          this.internalCheckedStateModel.push(value);
          this.removeValueFromArray(value, this.internalIndeterminateStateModel);
        } else {
          this.internalUncheckedStateModel = null;
          this.internalCheckedStateModel = value;
          this.internalIndeterminateStateModel = null;
        }
        this.color = null;
      },
      setIndeterminateStateValue(value) {
        this.indeterminate = true;
        if (this.arrayModels) {
          this.removeValueFromArray(value, this.internalUncheckedStateModel);
          this.removeValueFromArray(value, this.internalCheckedStateModel);
          this.internalIndeterminateStateModel.push(value);
        } else {
          this.internalUncheckedStateModel = null;
          this.internalCheckedStateModel = null;
          this.internalIndeterminateStateModel = value;
        }
        this.color = 'red';
      },
      removeValueFromArray(value, array) {
        const index = array.indexOf(value);
        if (index > -1) {
          array.splice(index, 1);
        }
      },
    },
    created() {
      if (this.uncheckedStateModel instanceof Array
        || this.checkedStateModel instanceof Array
        || this.indeterminateStateModel instanceof Array) {
        this.arrayModels = true;
        this.internalUncheckedStateModel = this.uncheckedStateModel ? this.uncheckedStateModel : [];
        this.internalCheckedStateModel = this.checkedStateModel ? this.checkedStateModel : [];
        this.internalIndeterminateStateModel = this.indeterminateStateModel
          ? this.indeterminateStateModel
          : [];
      }
      if (this.internalCheckedStateModel
        && (!this.arrayModels || this.internalCheckedStateModel.length)) {
        this.state = 1;
      } else if (this.internalIndeterminateStateModel
        && (!this.arrayModels || this.internalIndeterminateStateModel.length)) {
        this.state = 2;
      }
      this.indeterminate = this.state === 2;
    },
  };
</script>

<style scoped>

</style>
