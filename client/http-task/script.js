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

document.addEventListener('DOMContentLoaded', function () {
  let checkboxes = document.querySelectorAll('.accordion-checkbox');

  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      let group = checkbox.getAttribute('data-group');

      checkboxes.forEach(function (otherCheckbox) {
        if (
          otherCheckbox !== checkbox &&
          otherCheckbox.getAttribute('data-group') === group
        ) {
          otherCheckbox.checked = false;
        }
      });
    });
  });
});
