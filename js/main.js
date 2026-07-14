const nav = document.querySelector('nav')
const navSuffix = nav.getAttribute('data-suffix')
const navLatestAlias = nav.getAttribute('data-latestalias')
const menu = document.querySelector('#menu')
const menuMessage = document.querySelector('#menu-button-container > div')
const root = document.querySelector(':root')
const minWidth768px = window.matchMedia('(min-width: 768px)')
const actualArticles = document.querySelectorAll('article:not([data-name="0"])')

for (const article of actualArticles)
{
  const name = article.getAttribute('data-name')

  if (article.hasAttribute('data-extra'))
  {
    const text = article.getAttribute('data-extra');
    addNavLink(name, text, true)
  }
  else
  {
    addNavLink(name, name + navSuffix, false)
  }
}

if (localStorage.menuMessage != 'consumed')
  menuMessage.classList.add('new')

menu.onchange = () =>
{
  if (!menu.checked)
    return

  localStorage.menuMessage = 'consumed'
  menuMessage.classList.remove('new')
}

function addNavLink(id, text, isExtra)
{
  nav.insertAdjacentHTML(
    'beforeend',
    /*html*/ `<a href="/${id}" data-link ${isExtra ? 'data-extra' : ''}>${text}</a>`
  )
}


// Routing.

let wasHistoryEnabled = true

function router()
{
  let articleName = location.pathname.slice(1).toLowerCase().replaceAll('.', '\0')
  const slashIndex = articleName.indexOf('/')
  articleName = articleName.slice(0, slashIndex < 0 ? undefined : slashIndex) || 0
  document.querySelector(`article[data-name="${articleName}"]`)?.scrollIntoView()

  if (!minWidth768px.matches)
    menu.checked = false
}

function pushRoute(route, isHistoryEnabled = true, force = false) {
  if (route == '/' + navLatestAlias)
    route = document.querySelector('nav a:last-child').pathname

  if (route == '/0')
    route = '/'

  if (!force && route == location.pathname)
    return

  if (wasHistoryEnabled)
    history.pushState({}, "", route)
  else
    history.replaceState({}, "", route)

  wasHistoryEnabled = isHistoryEnabled
  scrollToLinkForRoute(route)
}

let latestScrollToLinkForRouteId = undefined;

function scrollToLinkForRoute(route)
{
  clearTimeout(latestScrollToLinkForRouteId)

  latestScrollToLinkForRouteId = setTimeout(() => {
    let scrollToTop = true;

    for (const link of document.querySelectorAll('nav a'))
    {
      link.classList.remove('active')

      if (link.pathname == route)
      {
        scrollToTop = false;
        link.classList.add('active')
        link.scrollIntoView({ behavior: 'smooth' })
      }
    }

    if (scrollToTop)
      nav.scrollTo({ behavior: 'smooth', top: 0, left: 0 })
  }, 50);
}

// Retrocompatibility for old links with hash in the URL.
;(onhashchange = () =>
{
  let articleName = location.hash.slice(1).toLowerCase().replaceAll('.', '\0')
  const hashIndex = articleName.indexOf('#')
  articleName = articleName.slice(0, hashIndex < 0 ? undefined : hashIndex) || 0
  pushRoute('/' + articleName, true, true)
  router()
})()

onclick = e  =>
{
  const link = e.target.closest("a[data-link]")
  if (!link) return

  e.preventDefault()
  pushRoute(link.pathname)
  router()
}

onpopstate = e =>
{
  wasHistoryEnabled = true
  scrollToLinkForRoute(location.pathname)
  router()
};

let lastScrollTop = 0

const intersectionObserver = new IntersectionObserver
(
  (entries) =>
  {
    const entry = entries.find(e => e.isIntersecting)
    if (!entry) return
    pushRoute('/' + entry.target.getAttribute('data-name'), false)
  },
  {
    root: document.querySelector('main'),
    threshold: 0.5
  }
)

for (const article of document.querySelectorAll('article'))
  intersectionObserver.observe(article);
