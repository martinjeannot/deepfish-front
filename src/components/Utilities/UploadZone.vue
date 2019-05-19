<template>
  <vue-dropzone
    :id="id"
    :ref="id"
    :options="dropzoneOptions"
    :destroyDropzone="false"
    @vdropzone-removed-file="onRemovedFileEvent"
  >
  </vue-dropzone>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'upload-zone',
    props: ['id', 'uri', 'files'],
    data: () => ({}),
    computed: {
      ...mapGetters([
        'api',
      ]),
      dropzoneOptions() {
        return {
          url: `${this.api.defaults.baseURL}${this.uri}`,
          thumbnailWidth: 150,
          maxFilesize: 0.5,
          headers: {
            Authorization: this.api.defaults.headers.common.Authorization,
          },
          addRemoveLinks: Array.isArray(this.files) && this.files.length,
        };
      },
    },
    methods: {
      ...mapActions([
        'showSnackbar',
      ]),
      onRemovedFileEvent() {
        this.api
          .delete(this.dropzoneOptions.url)
          .then(() => this.showSnackbar(['OK', 'success']))
          .catch(() => this.showSnackbar(['Error', 'error']));
      },
    },
    mounted() {
      // pre-populate the dropzone area with existing files
      if (Array.isArray(this.files)) {
        this.files.forEach((file) => {
          this.$refs[this.id].manuallyAddFile(file.file, file.url);
        });
      }
    },
  }
  ;
</script>

<style scoped>

</style>
