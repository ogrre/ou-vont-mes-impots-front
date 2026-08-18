# Suivi de l’accessibilité

Le projet vise la conformité au RGAA 4.1.2. Il ne doit pas être présenté comme totalement ou partiellement conforme tant qu’un audit exhaustif n’a pas fourni un taux valide.

## Contrôles automatisés

Les tests Vitest utilisent axe-core pour détecter une partie des erreurs de structure, de nom accessible et de sémantique. Les contrastes sont exclus de l’exécution jsdom car ce moteur ne calcule pas fidèlement les styles.

```sh
bun run test:unit -- --run
```

Un test automatisé ne couvre qu’une fraction du RGAA. Il ne remplace pas les vérifications manuelles.

## Recette manuelle requise avant publication

- audit des 106 critères RGAA 4.1.2 sur un échantillon représentatif ;
- navigation intégrale au clavier et contrôle de l’ordre du focus ;
- tests avec NVDA/Firefox, JAWS/Chrome et VoiceOver/Safari ;
- zoom navigateur à 200 % et mise en page à 320 pixels CSS ;
- contrôle des contrastes de tous les états, dont survol et focus ;
- vérification sans couleurs, sans CSS et avec JavaScript désactivé lorsque pertinent ;
- vérification des graphiques et de leurs alternatives textuelles ;
- mise à jour de la déclaration, du taux et des non-conformités après audit.

## Informations à fournir

- contact accessibilité public ;
- statut juridique de l’éditeur et applicabilité de l’article 47 ;
- responsable et moyens affectés au schéma pluriannuel ;
- résultat, date, échantillon et organisme ayant conduit l’audit.
