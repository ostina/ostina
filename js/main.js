const article = document.querySelector('article')
const articleError = article.getAttribute('data-error')
const nav = document.querySelector('nav')
const navCount = parseInt(nav.getAttribute('data-count'))
const navSuffix = nav.getAttribute('data-suffix')
const navLatestAlias = nav.getAttribute('data-latestalias')
const menu = document.querySelector('#menu')
const menuMessage = document.querySelector('#menu-button-container > div')
const root = document.querySelector(':root')
const minWidth768px = window.matchMedia('(min-width: 768px)')

const extras =
{
  168: '28° anniversario',
  174: '29° anniversario',
  180: '30° anniversario',
  186: '31° anniversario',
  192: '32° anniversario',
}

for (let i = 1; i <= navCount; ++i)
{
  addNavLink(i, i + navSuffix)

  if (i in extras)
    addNavLink('e' + i, extras[i])
}

if (localStorage.menuMessage != 'consumed')
  menuMessage.classList.add('new')

;(onhashchange = () =>
{
  let articleName = location.hash.slice(1).toLowerCase().replaceAll('.', '\0')
  const hashIndex = articleName.indexOf('#')
  articleName = articleName.slice(0, hashIndex < 0 ? undefined : hashIndex) || 0

  switch (articleName)
  {
    case navLatestAlias:
      location = nav.firstChild.href
      return

    default:
      fetch(`articles/${articleName}.html`)
        .catch(() => location.reload())
        .then(r => r.ok ? r.text() : articleError)
        .then(s => article.innerHTML = s)

      if (!minWidth768px.matches)
        menu.checked = false
  }
})()

menu.onchange = () =>
{
  if (!menu.checked)
    return

  localStorage.menuMessage = 'consumed'
  menuMessage.classList.remove('new')
}

function addNavLink(id, text)
{
  nav.insertAdjacentHTML(
    'afterbegin',
    /*html*/ `<a id="${id}" href="#${id}">${text}</a>`
  )
}
