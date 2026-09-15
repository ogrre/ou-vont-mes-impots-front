import { createRouter, createWebHistory } from 'vue-router'
const RevenueView = () => import('@/views/RevenueView.vue')
const OverviewView = () => import('@/views/OverviewView.vue')
const AccessibilityView = () => import('@/views/AccessibilityView.vue')
const LegalNoticeView = () => import('@/views/LegalNoticeView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')
const PrivacyView = () => import('@/views/PrivacyView.vue')
const SiteMapView = () => import('@/views/SiteMapView.vue')
const HomeView = () => import('@/views/HomeView.vue')
const BudgetDrilldownPlaceholderView = () => import('@/views/BudgetDrilldownPlaceholderView.vue')
const SpendingExplorerView = () => import('@/views/SpendingExplorerView.vue')
const MethodologyView = () => import('@/views/MethodologyView.vue')
const CofogDetailView = () => import('@/views/CofogDetailView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Accueil' } },
    { path: '/budget-etat/:year(\\d+)', name: 'state-budget', component: BudgetDrilldownPlaceholderView, meta: { title: 'Budget de l’État' } },
    { path: '/budget-etat/:year(\\d+)/missions/:code', name: 'state-budget-mission', component: BudgetDrilldownPlaceholderView, meta: { title: 'Mission du budget de l’État' } },
    { path: '/budget-etat/:year(\\d+)/programmes/:code', name: 'state-budget-programme', component: BudgetDrilldownPlaceholderView, meta: { title: 'Programme du budget de l’État' } },
    { path: '/budget-etat/:year(\\d+)/programmes/:programme/actions/:code', name: 'state-budget-action', component: BudgetDrilldownPlaceholderView, meta: { title: 'Action du budget de l’État' } },
    {
      path: '/vue-d-ensemble',
      name: 'overview',
      component: OverviewView,
      meta: { title: 'Vue d’ensemble' },
    },
    { path: '/depenses', redirect: '/explorer/2024' },
    { path: '/explorer/:year(\\d+)', name: 'explorer', component: SpendingExplorerView, meta: { title: 'Explorer les dépenses' } },
    { path: '/recettes', name: 'revenue', component: RevenueView, meta: { title: 'Les recettes' } },
    { path: '/depenses/cofog/:year(\\d+)/:code', name: 'cofog-detail', component: CofogDetailView, meta: { title: 'Détail d’une fonction COFOG' } },
    { path: '/methodologie', name: 'methodology', component: MethodologyView, meta: { title: 'Méthodologie' } },
    {
      path: '/accessibilite',
      name: 'accessibility',
      component: AccessibilityView,
      meta: { title: 'Accessibilité' },
    },
    {
      path: '/donnees-personnelles',
      name: 'privacy',
      component: PrivacyView,
      meta: { title: 'Données personnelles' },
    },
    {
      path: '/mentions-legales',
      name: 'legal',
      component: LegalNoticeView,
      meta: { title: 'Mentions légales' },
    },
    {
      path: '/plan-du-site',
      name: 'sitemap',
      component: SiteMapView,
      meta: { title: 'Plan du site' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { title: 'Page introuvable' },
    },
  ],
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title ?? 'Mais où vont mes impôts ?')} — Mais où vont mes impôts ?`
  requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>('#contenu h1')
    heading?.setAttribute('tabindex', '-1')
    heading?.focus({ preventScroll: true })
  })
})

export default router
