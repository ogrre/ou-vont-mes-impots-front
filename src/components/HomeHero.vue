<script setup lang="ts">
defineProps<{ year: number; amount: string | null; description: string }>()
</script>

<template>
  <section class="home-hero" aria-labelledby="home-title">
    <div>
      <p class="eyebrow">Finances publiques · {{ year }}</p>
      <h1 id="home-title">Mais où vont mes impôts&nbsp;?</h1>
      <p class="hero-copy">{{ description }}</p>
      <div class="hero-actions"><RouterLink class="primary-cta" :to="`/explorer/${year}`">Explorer les dépenses <span aria-hidden="true">→</span></RouterLink><RouterLink class="secondary-cta" to="/recettes">Voir les recettes</RouterLink></div>
    </div>
    <div class="hero-total">
      <span>Dépenses publiques</span>
      <strong>{{ amount === null ? 'Donnée indisponible' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 }).format(Number(amount)) }}</strong>
      <small>Administrations publiques · comptes nationaux</small>
    </div>
  </section>
</template>
