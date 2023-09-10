<template>
  <div class="nav__item">
    <q-icon :name="props.icon" size="32px"/>
    <p class="title">{{ props.title }}</p>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  title: string;
  icon?: string;
  href?: string;
  breadcrumb?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  icon: "radio_button_unchecked",
  href: "#",
  breadcrumb: false,
});
</script>

<style scoped lang="scss">
.nav__item {
  margin: 10px 0;
  padding: 12px 26px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: $accent;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all .2s;
  &:hover:not(.active) {
    background: $primary-half;
    color: #fff;
  }
}

</style>
