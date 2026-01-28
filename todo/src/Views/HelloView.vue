<template>
  <div>

    <RouterLink to="/login"></RouterLink>
    <RouterLink to="/register"></RouterLink>
    
    <RouterView />
  
  </div>
  
</template>

import { RouterLink, RouterView } from 'vue-router'

export default {
  components: {
   RouterLink,
   RouterView
  }
}

<script setup>

</script>