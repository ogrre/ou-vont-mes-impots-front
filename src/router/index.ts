import { createRouter, createWebHistory } from 'vue-router'
import ExpenditureView from '@/views/ExpenditureView.vue'
import RevenueView from '@/views/RevenueView.vue'
import OverviewView from '@/views/OverviewView.vue'
import AccessibilityView from '@/views/AccessibilityView.vue'
import LegalNoticeView from '@/views/LegalNoticeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import PrivacyView from '@/views/PrivacyView.vue'
import SiteMapView from '@/views/SiteMapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', redirect: '/depenses' },
    {
      path: '/vue-d-ensemble',
      name: 'overview',
      component: OverviewView,
      meta: { title: 'Vue d’ensemble' },
    },
    {
      path: '/depenses',
      name: 'expenditure',
      component: ExpenditureView,
      meta: { title: 'Les dépenses' },
    },
    { path: '/recettes', name: 'revenue', component: RevenueView, meta: { title: 'Les recettes' } },
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
