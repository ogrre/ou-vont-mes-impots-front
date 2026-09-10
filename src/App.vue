<template>
  <a class="skip-link" href="#contenu">Aller au contenu</a>
  <header class="site-header">
    <RouterLink class="brand" to="/" aria-label="Mais où vont mes impôts ? — accueil">
      <span class="brand-mark">€</span>
      <span>Mais où vont<br /><strong>mes impôts&nbsp;?</strong></span>
    </RouterLink>
    <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="main-navigation" @click="menuOpen = !menuOpen">
      <span class="visually-hidden">Ouvrir ou fermer le menu</span>
      <span aria-hidden="true">☰</span>
    </button>
    <nav id="main-navigation" :class="{ 'is-open': menuOpen }" aria-label="Navigation principale" @click="menuOpen = false">
      <RouterLink to="/" exact-active-class="router-link-exact-active">Vue d’ensemble</RouterLink>
      <RouterLink to="/explorer/2024">Explorer</RouterLink>
      <RouterLink to="/recettes">Les recettes</RouterLink>
      <RouterLink to="/methodologie">Méthodologie</RouterLink>
    </nav>
    <div class="header-actions">
      <div class="header-search"><GlobalFinanceSearch :year="currentYear" /></div>
      <a
        class="api-link"
        href="https://ou-vont-mes-impots.staging.dokploy.betta.black/docs/api"
        target="_blank"
        rel="noopener noreferrer"
        >API / OpenAPI <span aria-hidden="true">↗</span></a
      >
    </div>
  </header>

  <RouterView />

  <footer>
    <div>
      <p>
        <strong>Mais où vont mes impôts&nbsp;?</strong> rend les finances publiques plus lisibles à
        partir de données officielles traçables.
      </p>
      <p>
        Projet indépendant, sans affiliation avec le Gouvernement français ou une administration
        publique.
      </p>
      <section class="public-api" aria-labelledby="public-api-title">
        <h2 id="public-api-title">Une API publique et gratuite</h2>
        <p>
          Les données normalisées utilisées par ce site sont accessibles librement en lecture
          seule. Consultez la documentation interactive pour découvrir et réutiliser l’API.
        </p>
        <p class="public-api-links">
          <a
            href="https://ou-vont-mes-impots.staging.dokploy.betta.black/docs/api"
            target="_blank"
            rel="noopener noreferrer"
            >Documentation de l’API <span aria-hidden="true">↗</span></a
          >
        </p>
      </section>
    </div>
    <nav class="footer-nav" aria-label="Informations légales">
      <RouterLink to="/accessibilite">Accessibilité : non conforme</RouterLink
      ><RouterLink to="/donnees-personnelles">Données personnelles</RouterLink
      ><RouterLink to="/mentions-legales">Mentions légales</RouterLink
      ><RouterLink to="/plan-du-site">Plan du site</RouterLink>
      <a
        class="github-link"
        href="https://github.com/ogrre/ou-vont-mes-impots-api"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Code source du backend sur GitHub"
        title="Code source du backend sur GitHub"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
          <path fill="currentColor" d="M12 .7a11.3 11.3 0 0 0-3.57 22.02c.57.1.78-.25.78-.55v-2.1c-3.18.69-3.85-1.35-3.85-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.54-.29-5.21-1.27-5.21-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.12 1.17a10.8 10.8 0 0 1 5.68 0c2.16-1.48 3.12-1.17 3.12-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.39-2.68 5.35-5.23 5.63.41.36.78 1.08.78 2.18v3.23c0 .3.21.66.79.55A11.3 11.3 0 0 0 12 .7Z" />
        </svg>
      </a>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import GlobalFinanceSearch from '@/components/explorer/GlobalFinanceSearch.vue'

const menuOpen = ref(false)
const route = useRoute()
const currentYear = computed(() => Number(route.params.year ?? route.query.year ?? 2024))
</script>
