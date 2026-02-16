<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    <AlertCircle class="size-16 text-(--color-muted-foreground) mb-6" />
    <h1 class="text-4xl font-bold text-(--color-foreground) mb-2">404</h1>
    <p class="text-lg text-(--color-muted-foreground) mb-6">Page not found</p>
    <p class="text-sm text-(--color-muted-foreground) mb-8">
      The page you are looking for does not exist or has been moved.
    </p>
    <NuxtLink
      to="/"
      class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
    >
      Back to Dashboard
    </NuxtLink>
  </div>
</template>
