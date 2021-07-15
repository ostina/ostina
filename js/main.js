const article = document.querySelector('article')
const articleError = article.getAttribute('data-error')
const nav = document.querySelector('nav')
const navCount = parseInt(nav.getAttribute('data-count'))
const navSuffix = nav.getAttribute('data-suffix')
const menu = document.querySelector('#menu')
const minWidth576px = window.matchMedia('(min-width: 576px)')

const extras =
{
  168: '28° anniversario'
}

onload = () =>
(
  onhashchange = () =>
  {
    if (!minWidth576px.matches)
      menu.checked = false

    try
    {
      article.innerHTML = eval('_' + location.hash.substr(1))
    }
    catch
    {
      article.textContent = articleError
    }
  }
)()

addArticle(0)

for (let i = 1; i <= navCount; i++)
{
  addArticle(i)
  addNavLink(i, i + navSuffix)

  if (i in extras)
  {
    addArticle('e' + i)
    addNavLink('e' + i, extras[i])
  }
}

function addNavLink(id, text)
{
  const a = document.createElement('a')
  a.id = id
  a.href = '#' + id
  a.textContent = text
  nav.prepend(a)
}

function addArticle(id)
{
  const script = document.createElement('script')
  script.src = 'articles/' + id + '.js'
  document.body.append(script)
}
