<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "default" | "muted" | "accent";
  size?: "giant" | "large" | "medium" | "small" | "tiny";
  uppercase?: boolean;
  center?: boolean;
}>();

const tag = computed(() => `h${props.level ?? 1}`);
</script>

<template>
  <component
    :is="tag"
    class="title"
    :class="{
      '-muted': props.variant === 'muted',
      '-accent': props.variant === 'accent',
      '-giant': props.size === 'giant',
      '-large': props.size === 'large',
      '-medium': props.size === 'medium',
      '-small': props.size === 'small',
      '-tiny': props.size === 'tiny',
      '-uppercase': props.uppercase,
      '-center': props.center,
    }"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
@use "../styles/foundations/functions" as *;
@use "../styles/foundations/variables" as vars;

.title {
  margin: 0;
  font-weight: 700;
  color: var(--color-text);
}
.title.-muted {
  color: vars.$btn-text-disabled;
}
.title.-accent {
  color: var(--color-primary);
}
.title.-giant {
  font-size: rem(36);
}
.title.-large {
  font-size: rem(28);
}
.title.-medium {
  font-size: rem(20);
}
.title.-small {
  font-size: rem(16);
}
.title.-tiny {
  font-size: rem(14);
}
.title.-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.title.-center {
  text-align: center;
}
</style>
