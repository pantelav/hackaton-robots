<template>
  <q-layout view="hHh lpR fFf">

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated :width="280">
      <TheDrawer/>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import TheDrawer from 'src/components/TheDrawer.vue'

export default {
    setup() {
        const leftDrawerOpen = ref(false);
        return {
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value;
            }
        };
    },
    components: { TheDrawer }
}
</script>
