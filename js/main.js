const article = document.querySelector('article')
const articleError = article.getAttribute('data-error')
const nav = document.querySelector('nav')
const navCount = parseInt(nav.getAttribute('data-count'))
const navSuffix = nav.getAttribute('data-suffix')
const menu = document.querySelector('#menu')
const minWidth576px = window.matchMedia('(min-width: 576px)')

for (let i = navCount; i >= 0; i--)
{
  if (i > 0)
  {
    let a = document.createElement('a')
    a.id = i
    a.href = '#' + i
    a.innerHTML = i + navSuffix
    nav.appendChild(a)
  }

  let script = document.createElement('script')
  script.src = 'articles/' + i + '.js'
  document.body.appendChild(script)
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
      article.innerHTML = articleError
    }
  }
)()
