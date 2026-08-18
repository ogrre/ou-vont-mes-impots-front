<template>
  <a class="skip-link" href="#contenu">Aller au contenu</a>
  <header class="site-header">
    <RouterLink class="brand" to="/depenses" aria-label="Mais où vont mes impôts ? — accueil">
      <span class="brand-mark">%</span>
      <span>Mais où vont<br /><strong>mes impôts&nbsp;?</strong></span>
    </RouterLink>
    <nav aria-label="Navigation principale">
      <RouterLink to="/vue-d-ensemble">Vue d’ensemble</RouterLink>
      <RouterLink to="/depenses">Les dépenses</RouterLink>
      <RouterLink to="/recettes">Les recettes</RouterLink>
    </nav>
    <a
      class="github-link"
      href="https://github.com/ogrre/ou-vont-mes-impots-front"
      target="_blank"
      rel="noopener noreferrer"
      >API open source ↗</a
    >
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
    </div>
    <nav class="footer-nav" aria-label="Informations légales">
      <RouterLink to="/accessibilite">Accessibilité : non conforme</RouterLink
      ><RouterLink to="/donnees-personnelles">Données personnelles</RouterLink
      ><RouterLink to="/mentions-legales">Mentions légales</RouterLink
      ><RouterLink to="/plan-du-site">Plan du site</RouterLink>
    </nav>
  </footer>
</template>
