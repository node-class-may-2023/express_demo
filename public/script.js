const logoutForm = document.querySelector('#logout-form')

logoutForm.addEventListener('submit', e => {
  e.preventDefault()
  document.cookie = 'jwt=; Max-Age=0; path=/; domain=' + location.hostname
})
