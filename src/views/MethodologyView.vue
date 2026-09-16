<script setup lang="ts">
import GlossaryInfo from '@/components/GlossaryInfo.vue'
</script>

<template>
  <main id="contenu" class="page-shell">
    <section class="hero"><p class="eyebrow">Comprendre les données</p><h1>Méthodologie</h1><p class="hero-copy">Les chiffres sont utiles lorsqu’on sait exactement ce qu’ils mesurent.</p></section>
    <section class="methodology-grid methodology-page-grid">
      <article>
        <h2>Les distinctions essentielles</h2>
        <ul>
          <li><strong>Budget de l’État ≠ dépenses publiques</strong> : le premier est un sous-ensemble des administrations publiques.</li>
          <li><strong>AE <GlossaryInfo term="AE" /> ≠ CP <GlossaryInfo term="CP" /></strong> : les engagements autorisent une dépense ; les paiements constatent les décaissements.</li>
          <li><strong>LFI <GlossaryInfo term="LFI" /> ≠ exécution <GlossaryInfo term="Exécution" /></strong> : une prévision initiale ne décrit pas ce qui a réellement été payé.</li>
          <li><strong>Comptabilité budgétaire <GlossaryInfo term="Comptabilité budgétaire" /> ≠ comptes nationaux <GlossaryInfo term="Comptes nationaux" /></strong> : les périmètres et méthodes diffèrent.</li>
          <li><strong>Brut ≠ consolidé <GlossaryInfo term="Consolidé" /></strong> : les flux entre administrations peuvent être traités différemment.</li>
        </ul>
      </article>
      <article>
        <h2>Les niveaux d’exploration</h2>
        <p><strong>COFOG <GlossaryInfo term="COFOG" /></strong> décrit les fonctions des administrations publiques : santé, enseignement, protection sociale…</p>
        <p><strong>APU <GlossaryInfo term="APU" />, APUC <GlossaryInfo term="APUC" />, APUL <GlossaryInfo term="APUL" />, ASSO <GlossaryInfo term="ASSO" /></strong> désignent respectivement l’ensemble des administrations publiques, centrales, locales et de sécurité sociale.</p>
        <p><strong>Mission <GlossaryInfo term="Mission" /> → Programme <GlossaryInfo term="Programme" /> → Action <GlossaryInfo term="Action" /> → Sous-action <GlossaryInfo term="Sous-action" /></strong> est la hiérarchie du budget de l’État.</p>
      </article>
    </section>
  </main>
</template>
