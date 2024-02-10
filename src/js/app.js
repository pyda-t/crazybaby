import { isWebp } from './modules/isWebp.js';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { gsap } from 'gsap';

isWebp();

const body = document.body;
const header = body.querySelector('.header');
const menu = body.querySelector('.page__menu');
const navLinks = body.querySelectorAll('a[href^="#"');
const burgerButton = body.querySelector('.header__burger');
const form = body.querySelector('.questions__form');
const emailField = form.querySelector('[name="email"]');
const massageField = form.querySelector('[name="massage"]');
const animImages = body.querySelectorAll('.anim--image');
const animTexts = body.querySelectorAll('.anim--text');

let menuIsOpen = false;
let headerHeight = header.offsetHeight;
let emailError = true;

const openMenu = () => {
  menuIsOpen = true;
  burgerButton.classList.add('header__burger--active');
  menu.classList.add('page__menu--active');
};

const closeMenu = () => {
  menuIsOpen = false;
  burgerButton.classList.remove('header__burger--active');
  menu.classList.remove('page__menu--active');
};

const validateEmail = (email) => {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(email);
};

const createObserver = (options) => {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const { target } = entry;

        gsap.to(target, {
          opacity: 1,
          duration: 0.5,
          ...options,
        });

        observer.unobserve(target);
      };
    });
  }, {
    rootMargin: '50px',
  });
};

burgerButton.addEventListener('click', () => {
  if (menuIsOpen) {
    closeMenu();
    return;
  }

  openMenu();
});

navLinks.forEach(navLink => {
  navLink.addEventListener('click', function(e) {
    e.preventDefault();

    const href = this.getAttribute('href').slice(1);
    const scrollTarget = document.getElementById(href);
    const elementPosition = scrollTarget.getBoundingClientRect().top;
    const offsetPosition = elementPosition - headerHeight;

    window.scrollBy({
      top: offsetPosition,
      behavior: 'smooth',
    });

    closeMenu();
  });
});

window.addEventListener('resize', () => {
  headerHeight = header.offsetHeight;
})

const swiper = new Swiper('.features__slider', {
    modules: [Navigation],
    speed: 300,
    loop: true,
    navigation: {
        nextEl: '.features__button--next',
        prevEl: '.features__button--prev',
      },
      breakpoints: {
          1024: {
              slidesPerView: 3,
            }
          }
});

emailField.addEventListener('blur', (e) => {
  if (validateEmail(e.target.value.trim())) {
    emailField.classList.add('questions__input--success');
    return;
  }

  emailError = true;
  emailField.classList.add('questions__input--error');
});

emailField.addEventListener('input', (e) => {
  if (emailError && validateEmail(e.target.value.trim())) {
    emailError = false;
    emailField.classList.remove('questions__input--error');
    emailField.classList.add('questions__input--success');
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();

  if (emailError) {
    emailField.classList.add('questions__input--error');
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

  console.log(data);

  emailError = false;
  emailField.classList.remove('questions__input--success')
  emailField.value = '';
  massageField.value = '';
});

const imagesObserver = createObserver({ scale: 1, delay: 0.5 });
const textsObserver = createObserver({ y: 0 });

animImages.forEach(animImage => imagesObserver.observe(animImage));
animTexts.forEach(animText => textsObserver.observe(animText));
