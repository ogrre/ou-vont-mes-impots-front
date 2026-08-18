<template>
  <main id="contenu" class="page-shell legal-page">
    <p class="eyebrow">Navigation</p>
    <h1>Plan du site</h1>
    <nav class="site-map" aria-label="Plan du site">
      <h2>Comprendre le budget</h2>
      <ul>
        <li><RouterLink to="/vue-d-ensemble">Vue d’ensemble</RouterLink></li>
        <li><RouterLink to="/depenses">Les dépenses</RouterLink></li>
        <li><RouterLink to="/recettes">Les recettes</RouterLink></li>
      </ul>
      <h2>Informations</h2>
      <ul>
        <li><RouterLink to="/accessibilite">Accessibilité</RouterLink></li>
        <li><RouterLink to="/donnees-personnelles">Données personnelles</RouterLink></li>
        <li><RouterLink to="/mentions-legales">Mentions légales</RouterLink></li>
      </ul>
    </nav>
  </main>
</template>
