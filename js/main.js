const article = document.querySelector('article')
const articleError = article.getAttribute('data-error')
const nav = document.querySelector('nav')
const navCount = parseInt(nav.getAttribute('data-count'))
const navSuffix = nav.getAttribute('data-suffix')
const menu = document.querySelector('#menu')
const root = document.querySelector(':root')
const minWidth576px = window.matchMedia('(min-width: 576px)')

const extras =
{
  168: '28° anniversario',
  174: '29° anniversario'
}

for (let i = 1; i <= navCount; ++i)
{
  addNavLink(i, i + navSuffix)

  if (i in extras)
    addNavLink('e' + i, extras[i])
}

;(onresize = () => root.style.setProperty('--window-height', innerHeight + 'px'))()

;(onhashchange = () =>
{
  fetch(`articles/${location.hash.slice(1) || 0}.html`)
    .catch(() => location.reload())
    .then(r => r.ok ? r.text() : articleError)
    .then(s => article.innerHTML = s)

  if (!minWidth576px.matches)
    menu.checked = false
})()

function addNavLink(id, text)
{
  nav.insertAdjacentHTML(
    'afterbegin',
    /*html*/ `<a id="${id}" href="#${id}">${text}</a>`
  )
}
