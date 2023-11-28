function toggleBurgerMenu() {
  let burgerMenu = document.getElementById('burgerMenu');
  let mainNav = document.getElementById('mainNav');
  if (burgerMenu.style.display === 'block') {
    burgerMenu.style.display = 'none';
  } else {
    burgerMenu.style.display = 'block';
    mainNav.style.display = 'flex';
  }
}
