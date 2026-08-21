const modules_flsModules = {};

//вспомогательные функции
let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout((() => {
      lockPaddingElements.forEach((lockPaddingElement => {
        lockPaddingElement.style.paddingRight = "";
      }));
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }), delay);
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    }));
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
function functions_FLS(message) {
  setTimeout((() => {
    if (window.FLS) console.log(message);
  }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item) {
    return item.dataset[dataSetValue];
  });

  if (media.length) {
    const breakpointsArray = media.map(item => {
      const params = item.dataset[dataSetValue];
      const paramsArray = params.split(",");
      return {
        value: paramsArray[0],
        type: paramsArray[1] ? paramsArray[1].trim() : "max",
        item: item
      };
    });

    const mdQueries = uniqArray(
      breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
    );

    const mdQueriesArray = mdQueries.map(breakpoint => {
      const [query, value, type] = breakpoint.split(",");
      const matchMedia = window.matchMedia(query);
      const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
      return { itemsArray, matchMedia };
    });

    return mdQueriesArray;
  }
}

function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

//========================================================================================================================================================

const iconMenu = document.querySelector('.header__burger');
const headerBody = document.querySelector('.header-menu');
let headerClose = document.querySelector('.header-menu__close');

if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    e.stopPropagation();

    document.documentElement.classList.toggle("menu-open");
  });

  if (headerClose) {
    headerClose.addEventListener("click", function (e) {
      e.stopPropagation();
      document.documentElement.classList.remove("menu-open");
    });
  }

  document.addEventListener('click', function (e) {
    const isClickInsideHeaderBody = headerBody && headerBody.contains(e.target);
    const isClickOnMenuIcon = e.target === iconMenu || iconMenu.contains(e.target);

    if (!isClickInsideHeaderBody && !isClickOnMenuIcon) {
      document.documentElement.classList.remove("menu-open");
    }
  });
}

//========================================================================================================================================================

// Добавление к шапке при скролле
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      header.classList.add('_header-scroll');
      document.documentElement.classList.add('header-scroll');
    } else {
      header.classList.remove('_header-scroll');
      document.documentElement.classList.remove('header-scroll');
    }
  });
}



//========================================================================================================================================================

//Прокрутка к блоку
let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
  const targetBlockElement = document.querySelector(targetBlock);
  if (!targetBlockElement) {
    console.warn(`Element ${targetBlock} not found`);
    return;
  }

  let headerItem = '';
  let headerItemHeight = 0;

  if (noHeader) {
    headerItem = 'header.header';
    const headerElement = document.querySelector(headerItem);
    if (headerElement) {
      if (!headerElement.classList.contains('_header-scroll')) {
        headerElement.style.cssText = `transition-duration: 0s;`;
        headerElement.classList.add('_header-scroll');
        headerItemHeight = headerElement.offsetHeight;
        headerElement.classList.remove('_header-scroll');
        setTimeout(() => {
          headerElement.style.cssText = ``;
        }, 0);
      } else {
        headerItemHeight = headerElement.offsetHeight;
      }
    }
  }

  if (document.documentElement.classList.contains("menu-open")) {
    if (typeof menuClose === 'function') {
      menuClose();
    }
  }

  if (typeof SmoothScroll !== 'undefined') {
    let options = {
      speedAsDuration: true,
      speed: speed,
      header: headerItem,
      offset: offsetTop,
      easing: 'easeOutQuad',
    };
    new SmoothScroll().animateScroll(targetBlockElement, '', options);
  } else {
    let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + window.scrollY;
    if (headerItemHeight) {
      targetBlockElementPosition -= headerItemHeight;
    }
    if (offsetTop) {
      targetBlockElementPosition -= offsetTop;
    }
    window.scrollTo({
      top: targetBlockElementPosition,
      behavior: "smooth"
    });
  }
};
function pageNavigation() {
  document.addEventListener("click", pageNavigationAction);
  document.addEventListener("watcherCallback", pageNavigationAction);

  function pageNavigationAction(e) {
    if (e.type === "click") {
      const targetElement = e.target;
      const gotoLink = targetElement.closest('[data-goto]');

      if (gotoLink) {
        const gotoLinkSelector = gotoLink.dataset.goto || '';
        const noHeader = gotoLink.hasAttribute('data-goto-header');
        const gotoSpeed = gotoLink.dataset.gotoSpeed ? parseInt(gotoLink.dataset.gotoSpeed) : 500;
        const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
        const checkValue = gotoLink.dataset.check || '';

        if (checkValue) {
          activateCheckboxByDataCheck(checkValue);
        }

        if (window.modules_flsModules && modules_flsModules.fullpage) {
          const fullpageSection = document.querySelector(`${gotoLinkSelector}`)?.closest('[data-fp-section]');
          const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;

          if (fullpageSectionId !== null) {
            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
            if (document.documentElement.classList.contains("menu-open") && typeof menuClose === 'function') {
              menuClose();
            }
          }
        } else {
          gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
        }

        e.preventDefault();
      }
    } else if (e.type === "watcherCallback" && e.detail) {
      const entry = e.detail.entry;
      const targetElement = entry.target;

      if (targetElement.dataset.watch === 'navigator') {
        document.querySelectorAll('[data-goto]._navigator-active').forEach(el => {
          el.classList.remove('_navigator-active');
        });

        const navigatorLinks = findNavigatorLinks(targetElement);
        navigatorLinks.forEach(link => {
          if (entry.isIntersecting) {
            link.classList.add('_navigator-active');
          } else {
            link.classList.remove('_navigator-active');
          }
        });
      }
    }
  }

  function findNavigatorLinks(element) {
    const links = [];

    if (element.id) {
      const idLinks = document.querySelectorAll(`[data-goto="#${element.id}"]`);
      links.push(...idLinks);
    }

    if (element.classList.length) {
      element.classList.forEach(className => {
        const classLinks = document.querySelectorAll(`[data-goto=".${className}"]`);
        links.push(...classLinks);
      });
    }

    return links;
  }
}
pageNavigation();

//========================================================================================================================================================


//Форма валидация
function formFieldsInit(options = { viewPass: true, autoHeight: false }) {
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.add('_form-focus');
        targetElement.parentElement.classList.add('_form-focus');
      }
      formValidate.removeError(targetElement);
      targetElement.hasAttribute('data-validate') ? formValidate.removeError(targetElement) : null;
    }
  });
  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.remove('_form-focus');
        targetElement.parentElement.classList.remove('_form-focus');
      }
      targetElement.hasAttribute('data-validate') ? formValidate.validateInput(targetElement) : null;
      checkFilled(targetElement);
    }
  });
  document.body.addEventListener("input", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      checkFilled(targetElement);
    }
  });
  function checkFilled(element) {
    if (!element.disabled) {
      const hasValue = element.value && element.value.trim().length > 0;
      if (element.type === 'checkbox') {
        if (element.checked) {
          element.classList.add('filled');
          element.parentElement?.classList.add('filled');
        } else {
          element.classList.remove('filled');
          element.parentElement?.classList.remove('filled');
        }
      } else if (element.type === 'radio') {
        if (element.checked) {
          element.classList.add('filled');
          element.parentElement?.classList.add('filled');
        } else {
          element.classList.remove('filled');
          element.parentElement?.classList.remove('filled');
        }
      } else {
        if (hasValue) {
          element.classList.add('filled');
          element.parentElement?.classList.add('filled');
        } else {
          element.classList.remove('filled');
          element.parentElement?.classList.remove('filled');
        }
      }
    }
  }
  if (options.viewPass) {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (targetElement.closest('.form__viewpass')) {
        const viewpassBlock = targetElement.closest('.form__viewpass');
        const input = viewpassBlock.closest('.form__input').querySelector('input');
        if (input) {
          const isActive = viewpassBlock.classList.contains('_viewpass-active');
          input.setAttribute("type", isActive ? "password" : "text");
          viewpassBlock.classList.toggle('_viewpass-active');
        } else {
          console.error('Input не найден!');
        }
      }
    });
  }
  if (options.autoHeight) {
    const textareas = document.querySelectorAll('textarea[data-autoheight]');
    if (textareas.length) {
      textareas.forEach(textarea => {
        const startHeight = textarea.hasAttribute('data-autoheight-min') ?
          Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
        const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
          Number(textarea.dataset.autoheightMax) : Infinity;
        setHeight(textarea, Math.min(startHeight, maxHeight))
        textarea.addEventListener('input', () => {
          if (textarea.scrollHeight > startHeight) {
            textarea.style.height = `auto`;
            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
          }
        });
      });
      function setHeight(textarea, height) {
        textarea.style.height = `${height}px`;
      }
    }
  }
}
formFieldsInit({
  viewPass: true,
  autoHeight: false
});
let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll('*[data-required]');
    if (formRequiredItems.length) {
      formRequiredItems.forEach(formRequiredItem => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;
    if (formRequiredItem.dataset.required === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
    } else if (formRequiredItem.dataset.validate === "password-confirm") {
      const passwordInput = document.getElementById('password');
      if (!passwordInput) return error;
      if (formRequiredItem.value !== passwordInput.value) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else {
      if (!formRequiredItem.value.trim()) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }
    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add('_form-error');
    formRequiredItem.parentElement.classList.add('_form-error');
    let inputError = formRequiredItem.parentElement.querySelector('.form__error');
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.error) {
      formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
    }
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove('_form-error');
    formRequiredItem.parentElement.classList.remove('_form-error');
    if (formRequiredItem.parentElement.querySelector('.form__error')) {
      formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
    }
  },
  addSuccess(formRequiredItem) {
    formRequiredItem.classList.add('_form-success');
    formRequiredItem.parentElement.classList.add('_form-success');
  },
  removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove('_form-success');
    formRequiredItem.parentElement.classList.remove('_form-success');
  },
  formClean(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      if (input.type !== 'checkbox' && input.type !== 'radio' && input.type !== 'submit' && input.type !== 'button') {
        input.value = '';
      }
      input.classList.remove('_form-focus', '_form-success', '_form-error', 'filled');
      input.parentElement?.classList.remove('_form-focus', '_form-success', '_form-error', 'filled');
      if (input.classList.contains('telephone') && input.clearFilled) {
        input.clearFilled();
      }
    });

    const checkboxes = form.querySelectorAll('.checkbox__input');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
      checkbox.classList.remove('_form-success', '_form-error', 'filled');
      checkbox.closest('.checkbox')?.classList.remove('_form-success', '_form-error', 'filled');
    });

    const radios = form.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.checked = false;
      radio.classList.remove('_form-success', '_form-error', 'filled');
      radio.parentElement?.classList.remove('_form-success', '_form-error', 'filled');
    });

    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
      select.selectedIndex = 0;
      select.classList.remove('_form-success', '_form-error', 'filled');
    });

    form.querySelectorAll('.form__error').forEach(el => el.remove());

    if (modules_flsModules.select) {
      let selectsDiv = form.querySelectorAll('div.select');
      if (selectsDiv.length) {
        for (let index = 0; index < selectsDiv.length; index++) {
          const select = selectsDiv[index].querySelector('select');
          modules_flsModules.select.selectBuild(select);
        }
      }
    }
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
  }
};

//Форма отправка
function formSubmit() {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener('submit', function (e) {
        const form = e.target;
        formSubmitAction(form, e);
      });
      form.addEventListener('reset', function (e) {
        const form = e.target;
        formValidate.formClean(form);
      });
    }
  }

  document.addEventListener('click', function (e) {
    const clearButton = e.target.closest('.btn-clear');
    if (clearButton) {
      e.preventDefault();
      const form = clearButton.closest('form');
      if (form) {
        formValidate.formClean(form);
      }
    }
  });

  async function formSubmitAction(form, e) {
    const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
    if (error === 0) {
      const ajax = form.hasAttribute('data-ajax');
      if (ajax) {
        e.preventDefault();
        const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
        const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
        const formData = new FormData(form);
        form.classList.add('_sending');
        const response = await fetch(formAction, {
          method: formMethod,
          body: formData
        });
        if (response.ok) {
          let responseResult = await response.json();
          form.classList.remove('_sending');
          formSent(form, responseResult);
        } else {
          alert("Помилка");
          form.classList.remove('_sending');
        }
      } else if (form.hasAttribute('data-dev')) {
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
      if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
        const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
        gotoBlock(formGoToErrorClass, true, 1000);
      }
    }
  }

  function formSent(form, responseResult = ``) {
    document.dispatchEvent(new CustomEvent("formSent", {
      detail: {
        form: form
      }
    }));
    const telephoneInputs = form.querySelectorAll('.telephone');
    telephoneInputs.forEach(input => {
      const parent = input.closest('.form__input');
      if (parent) {
        parent.classList.remove('filled');
        input.classList.remove('filled');
      }
    });

    showThanksBlock(form);

    setTimeout(() => {
      if (modules_flsModules.popup) {
        const popup = form.dataset.popupMessage;
        popup ? modules_flsModules.popup.open(popup) : null;
      }
    }, 0);
    formValidate.formClean(form);
  }

  function showThanksBlock(form) {
    const thanksId = form.getAttribute('data-thanks');
    if (thanksId) {
      const thanksBlock = document.querySelector(thanksId);
      if (thanksBlock) {
        thanksBlock.classList.add('active');

        setTimeout(() => {
          thanksBlock.classList.remove('active');
        }, 5000);
      }
    }
  }
}
formSubmit();


//========================================================================================================================================================

if (document.querySelector('.block-gallery__slider')) {
  const swiperGallery = new Swiper('.block-gallery__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 16,
    speed: 800,
    navigation: {
      prevEl: '.block-gallery-arrow-prev',
      nextEl: '.block-gallery-arrow-next',
    },
    breakpoints: {
      1400: { slidesPerView: 'auto', spaceBetween: 35, }
    },
    on: {
      init: function () {
        updateFraction(this);
      },
      slideChange: function () {
        updateFraction(this);
      },
    },
  });

  function updateFraction(swiper) {
    const currentEl = document.querySelector('.block-gallery-pagination-fraction .swiper-pagination-current');
    const totalEl = document.querySelector('.block-gallery-pagination-fraction .swiper-pagination-total');

    if (currentEl && totalEl) {
      let currentSlide;
      if (swiper.params.loop) {
        currentSlide = swiper.realIndex + 1;
      } else {
        currentSlide = swiper.activeIndex + 1;
      }
      currentEl.textContent = currentSlide.toString();

      let totalSlides;
      if (swiper.params.loop) {
        totalSlides = swiper.slides.length / 2;
      } else {
        totalSlides = swiper.slides.length;
      }

      totalEl.textContent = totalSlides.toString();
    }
  }
}

document.querySelectorAll('.slide-block-gallery__slider').forEach((slider) => {
  const galleryContainer = slider.closest('.slide-block-gallery__images');

  if (!galleryContainer) return;

  const pagination = galleryContainer.querySelector('.slide-block-gallery-pagination');
  const prevBtn = galleryContainer.querySelector('.slide-block-gallery-arrow-prev');
  const nextBtn = galleryContainer.querySelector('.slide-block-gallery-arrow-next');

  const config = {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 800,
  };

  if (pagination) {
    config.pagination = {
      el: pagination,
      clickable: true,
    };
  }

  if (prevBtn && nextBtn) {
    config.navigation = {
      prevEl: prevBtn,
      nextEl: nextBtn,
    };
  }

  new Swiper(slider, config);
});

if (document.querySelector('.block-price__slider')) {
  const sliders = document.querySelectorAll('.block-price__slider');

  sliders.forEach((slider) => {
    const body = slider.closest('.block-price__body');

    const swiperPrice = new Swiper(slider, {
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 30,
      autoHeight: true,
      speed: 800,
      navigation: {
        prevEl: body ? body.querySelector('.price-arrow-prev') : null,
        nextEl: body ? body.querySelector('.price-arrow-next') : null,
      },
      pagination: {
        el: body ? body.querySelector('.pagination-price') : null,
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 30 },
        1432: { slidesPerView: 4, spaceBetween: 20 }
      },
    });
  });
}

if (document.querySelector('.block-reviews__slider')) {
  const sliders = document.querySelectorAll('.block-reviews__slider');

  sliders.forEach((slider) => {
    const body = slider.closest('.block-reviews__body');

    const swiperPrice = new Swiper(slider, {
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 16,
      speed: 800,
      navigation: {
        prevEl: body ? body.querySelector('.reviews-arrow-prev') : null,
        nextEl: body ? body.querySelector('.reviews-arrow-next') : null,
      },
      pagination: {
        el: body ? body.querySelector('.pagination-reviews') : null,
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 16 },
        992: { slidesPerView: 3, spaceBetween: 16 },
        1432: { slidesPerView: 3, spaceBetween: 20 }
      },
    });
  });
}

if (document.querySelector('.block-works-gallery__slider')) {
  const sliders = document.querySelectorAll('.block-works-gallery__slider');

  sliders.forEach((slider) => {
    const body = slider.closest('.block-works-gallery');

    const swiperPrice = new Swiper(slider, {
      observer: true,
      observeParents: true,
      slidesPerView: "auto",
      spaceBetween: 20,
      centeredSlides: true,
      speed: 800,
      navigation: {
        prevEl: body ? body.querySelector('.works-gallery-arrow-prev') : null,
        nextEl: body ? body.querySelector('.works-gallery-arrow-next') : null,
      },
      pagination: {
        el: body ? body.querySelector('.pagination-works-gallery') : null,
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false, },
        992: { slidesPerView: 4, spaceBetween: 20, centeredSlides: false, },
        1432: { slidesPerView: 6, spaceBetween: 20, centeredSlides: false, }
      },
    });
  });
}

if (document.querySelector('.block-steps1__slider')) {
  const swiperSteps1 = new Swiper('.block-steps1__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 16,
    speed: 800,
    navigation: {
      prevEl: '.steps1-arrow-prev',
      nextEl: '.steps1-arrow-next',
    },
    pagination: {
      el: '.pagination-steps1',
      clickable: true,
    },
    on: {
      init: function () {
        updateFraction(this);
      },
      slideChange: function () {
        updateFraction(this);
      },
    },
  });

  function updateFraction(swiper) {
    const currentEl = document.querySelector('.steps1-pagination-fraction .swiper-pagination-current');
    const totalEl = document.querySelector('.steps1-pagination-fraction .swiper-pagination-total');

    if (currentEl && totalEl) {
      let currentSlide;
      if (swiper.params.loop) {
        currentSlide = swiper.realIndex + 1;
      } else {
        currentSlide = swiper.activeIndex + 1;
      }
      currentEl.textContent = currentSlide.toString();

      let totalSlides;
      if (swiper.params.loop) {
        totalSlides = swiper.slides.length / 2;
      } else {
        totalSlides = swiper.slides.length;
      }

      totalEl.textContent = totalSlides.toString();
    }
  }
}

//========================================================================================================================================================

Fancybox.bind("[data-fancybox]", {
  // ваши опции
});

//========================================================================================================================================================

//Попап
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      attributeOpenButton: "data-popup",
      attributeCloseButton: "data-close",
      fixElementSelector: "[data-lp]",
      youtubeAttribute: "data-popup-youtube",
      youtubePlaceAttribute: "data-popup-youtube-place",
      setAutoplayYoutube: true,
      classes: {
        popup: "popup",
        popupContent: "popup__content",
        popupActive: "popup_show",
        bodyActive: "popup-show"
      },
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hashSettings: {
        goHash: true
      },
      on: {
        beforeOpen: function () { },
        afterOpen: function () { },
        beforeClose: function () { },
        afterClose: function () { }
      }
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false
    };
    this.previousOpen = {
      selector: false,
      element: false
    };
    this.lastClosed = {
      selector: false,
      element: false
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings
      },
      on: {
        ...config.on,
        ...options?.on
      }
    };
    this.bodyLock = false;
    this.previousMenuState = false;
    this.options.init ? this.initPopups() : null;
    this._resizeObserver = null;
    this._mutationObserver = null;
  }

  initPopups() {
    this.eventsPopup();
  }

  eventsPopup() {
    document.addEventListener("click", function (e) {
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
        if ("error" !== this._dataValue) {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
    }.bind(this));

    document.addEventListener("keydown", function (e) {
      if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && 9 == e.which && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }.bind(this));

    if (this.options.hashSettings.goHash) {
      window.addEventListener("hashchange", function () {
        if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
      }.bind(this));
      window.addEventListener("load", function () {
        if (window.location.hash) this._openToHash();
      }.bind(this));
    }

    window.addEventListener("resize", this._handleResize.bind(this));
  }

  _calculateBottomHeight(popupElement) {
    const popupContent = popupElement.querySelector(`.${this.options.classes.popupContent}`);
    if (!popupContent) return;

    const popupTop = popupContent.querySelector('.popup__top');
    const popupBody = popupContent.querySelector('.popup__body');
    const popupCenter = popupBody ? popupBody.querySelector('.popup-center') : null;
    const popupBottom = popupBody ? popupBody.querySelector('.popup__bottom') : null;

    if (!popupTop || !popupBottom || !popupCenter) return;

    const topHeight = popupTop.offsetHeight;
    const centerHeight = popupCenter.offsetHeight;

    const bodyStyles = window.getComputedStyle(popupBody);
    const bodyPaddingTop = parseFloat(bodyStyles.paddingTop) || 0;
    const bodyPaddingBottom = parseFloat(bodyStyles.paddingBottom) || 0;
    const bodyPadding = bodyPaddingTop + bodyPaddingBottom;

    const vh = window.innerHeight;
    const maxHeight = vh - topHeight - centerHeight - bodyPadding;

    popupBottom.style.maxHeight = `${Math.max(maxHeight, 100)}px`;
  }

  _calculateCloseButtonPosition() {
    if (!this.targetOpen.element) return;

    const popupContent = this.targetOpen.element.querySelector(`.${this.options.classes.popupContent}`);
    const closeButton = this.targetOpen.element.querySelector('.popup-close-other');

    if (popupContent && closeButton) {
      const popupRect = this.targetOpen.element.getBoundingClientRect();
      const contentRect = popupContent.getBoundingClientRect();
      const topPosition = contentRect.top - popupRect.top + 13;
      closeButton.style.top = topPosition + 'px';
    }
  }

  _handleResize() {
    if (this.isOpen && this.previousOpen.element) {
      this._calculateBottomHeight(this.previousOpen.element);
      this._calculateCloseButtonPosition();
    }
  }

  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
      if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(this.targetOpen.selector);
      if (this.targetOpen.element) {
        this.previousMenuState = document.documentElement.classList.contains('menu-open');
        if (this.previousMenuState) {
          if (typeof menuClose === 'function') {
            menuClose();
          } else {
            document.documentElement.classList.remove("menu-open");
            if (typeof bodyUnlock === 'function') bodyUnlock();
          }
        }
        if (this.youTubeCode) {
          const codeVideo = this.youTubeCode;
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
          const iframe = document.createElement("iframe");
          iframe.setAttribute("allowfullscreen", "");
          const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
          iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
          iframe.setAttribute("src", urlVideo);
          if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
          }
          this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
        }
        const videoElement = this.targetOpen.element.querySelector("video");
        if (videoElement) {
          videoElement.muted = true;
          videoElement.currentTime = 0;
          videoElement.play().catch((e => console.error("Autoplay error:", e)));
        }
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
          detail: {
            popup: this
          }
        }));
        this.targetOpen.element.classList.add(this.options.classes.popupActive);
        document.documentElement.classList.add(this.options.classes.bodyActive);
        if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;

        setTimeout(() => {
          this._calculateBottomHeight(this.targetOpen.element);
          this._calculateCloseButtonPosition();
        }, 50);

        this._setupObserver(this.targetOpen.element);

        this.options.on.afterOpen(this);
        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
          detail: {
            popup: this
          }
        }));
      }
    }
  }

  _setupObserver(popupElement) {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }

    const popupBody = popupElement.querySelector('.popup__body');
    if (!popupBody) return;

    const popupCenter = popupBody.querySelector('.popup-center');
    const popupBottom = popupBody.querySelector('.popup__bottom');

    if (!popupCenter || !popupBottom) return;

    this._mutationObserver = new MutationObserver(() => {
      this._calculateBottomHeight(popupElement);
      this._calculateCloseButtonPosition();
    });

    this._mutationObserver.observe(popupCenter, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }

  close(selectorValue) {
    if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
    if (!this.isOpen || !bodyLockStatus) return;

    this.options.on.beforeClose(this);
    document.dispatchEvent(new CustomEvent("beforePopupClose", {
      detail: {
        popup: this
      }
    }));

    if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";

    this.previousOpen.element.classList.remove(this.options.classes.popupActive);
    const videoElement = this.previousOpen.element.querySelector("video");
    if (videoElement) videoElement.pause();
    this.previousOpen.element.setAttribute("aria-hidden", "true");

    const popupBottom = this.previousOpen.element.querySelector('.popup__bottom');
    if (popupBottom) {
      popupBottom.style.maxHeight = '';
    }

    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }

    if (!this._reopen) {
      document.documentElement.classList.remove(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
      if (this.previousMenuState) {
        if (typeof menuOpen === 'function') {
          menuOpen();
        } else {
          document.documentElement.classList.add("menu-open");
          if (typeof bodyLock === 'function') bodyLock();
        }
      }
    }

    document.dispatchEvent(new CustomEvent("afterPopupClose", {
      detail: {
        popup: this
      }
    }));
    this.options.on.afterClose(this);
  }

  _getHash() {
    if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
  }

  _openToHash() {
    let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
    const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
    if (buttons && classInHash) this.open(classInHash);
  }

  _setHash() {
    history.pushState("", "", this.hash);
  }

  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }

  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && 0 === focusedIndex) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
}
modules_flsModules.popup = new Popup({});

function menuOpen() {
  bodyLock();
  document.documentElement.classList.add("menu-open");
}
function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}

//========================================================================================================================================================

//Маска
const telephone = document.querySelectorAll('.telephone');
if (telephone) {
  Inputmask({
    "mask": "+7 (999) 999 99 99",
    "showMaskOnHover": false,
  }).mask(telephone);
}

//========================================================================================================================================================

//До-после
class BeforeAfter {
  constructor(props) {
    let defaultConfig = {
      init: true,
      logging: true,
      swiper: null
    };
    this.config = Object.assign(defaultConfig, props);
    this.isDragging = false;

    if (this.config.init) {
      const beforeAfterItems = document.querySelectorAll('[data-ba]');
      if (beforeAfterItems.length > 0) {
        this.beforeAfterInit(beforeAfterItems);
      }
    }
  }

  beforeAfterInit(beforeAfterItems) {
    beforeAfterItems.forEach((beforeAfter, index) => {
      if (beforeAfter) {
        this.beforeAfterClasses(beforeAfter);
        this.beforeAfterItemInit(beforeAfter);
      }
    });
  }

  beforeAfterClasses(beforeAfter) {
    beforeAfter.addEventListener('mouseover', function (e) {
      const targetElement = e.target;
      const isArrow = targetElement.closest('[data-ba-arrow]');

      if (!isArrow) {
        if (targetElement.closest('[data-ba-before]')) {
          beforeAfter.classList.remove('_right');
          beforeAfter.classList.add('_left');
        } else {
          beforeAfter.classList.add('_right');
          beforeAfter.classList.remove('_left');
        }
      }
    });

    beforeAfter.addEventListener('mouseleave', function () {
      beforeAfter.classList.remove('_left');
      beforeAfter.classList.remove('_right');
    });
  }

  beforeAfterItemInit(beforeAfter) {
    const beforeAfterArrow = beforeAfter.querySelector('[data-ba-arrow]');
    const afterItem = beforeAfter.querySelector('[data-ba-after]');

    if (!beforeAfterArrow || !afterItem) {
      return;
    }

    const beforeAfterArrowWidth = parseFloat(
      window.getComputedStyle(beforeAfterArrow).getPropertyValue('width')
    );

    const handleStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleDragStart(e, beforeAfter, afterItem, beforeAfterArrowWidth);
    };

    beforeAfterArrow.addEventListener('mousedown', handleStart);
    beforeAfterArrow.addEventListener('touchstart', handleStart, { passive: false });
  }

  handleDragStart(e, beforeAfter, afterItem, arrowWidth) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = true;

    const swiperInstance = this.config.swiper;

    if (swiperInstance && typeof swiperInstance === 'object') {
      swiperInstance.allowTouchMove = false;
      swiperInstance.allowSlideNext = false;
      swiperInstance.allowSlidePrev = false;
      swiperInstance.touchEventsData.preventDefault = true;
    }

    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    const sizes = {
      width: beforeAfter.offsetWidth,
      left: beforeAfter.getBoundingClientRect().left - window.scrollX
    };

    const moveHandler = (eMove) => {
      if (!this.isDragging) return;
      eMove.preventDefault();
      eMove.stopPropagation();
      this.handleMouseMove(eMove, beforeAfter, afterItem, arrowWidth, sizes);
    };

    const endHandler = (eEnd) => {
      if (!this.isDragging) return;

      eEnd.preventDefault();
      eEnd.stopPropagation();

      this.isDragging = false;

      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('mouseup', endHandler);
      document.removeEventListener('touchend', endHandler);
      document.removeEventListener('touchcancel', endHandler);

      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';

      if (swiperInstance && typeof swiperInstance === 'object') {
        setTimeout(() => {
          swiperInstance.allowTouchMove = true;
          swiperInstance.allowSlideNext = true;
          swiperInstance.allowSlidePrev = true;
          swiperInstance.touchEventsData.preventDefault = false;
        }, 50);
      }
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', endHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });
    document.addEventListener('touchend', endHandler);
    document.addEventListener('touchcancel', endHandler);

    document.addEventListener('dragstart', (eDrag) => {
      eDrag.preventDefault();
    });
  }

  handleMouseMove(e, beforeAfter, afterItem, arrowWidth, sizes) {
    let clientX;
    if (e.type === 'touchmove' && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
    } else if (e.clientX) {
      clientX = e.clientX;
    } else {
      return;
    }

    let posLeft = clientX - sizes.left;
    posLeft = Math.max(0, Math.min(posLeft, sizes.width));

    const way = (posLeft / sizes.width) * 100;
    const arrowLeft = `calc(${way}% - ${arrowWidth}px)`;

    const arrow = beforeAfter.querySelector('[data-ba-arrow]');
    if (arrow) {
      arrow.style.left = arrowLeft;
      arrow.style.transform = 'translate(50%, -50%)';
    }
    afterItem.style.width = `${100 - way}%`;
  }
}

let swiperBeforeAfter = null;

const sliderContainer = document.querySelector('.block-before-after__slider');

if (sliderContainer) {
  swiperBeforeAfter = new Swiper('.block-before-after__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 16,
    speed: 400,
    touchStartPreventDefault: false,
    touchMoveStopPropagation: true,
    noSwiping: true,
    noSwipingClass: 'before-after__arrows',
    navigation: {
      prevEl: '.before-after-arrow-prev',
      nextEl: '.before-after-arrow-next',
    },
    pagination: {
      el: ".before-after-pagination-fraction",
      type: "custom",
      renderCustom: function (swiper, current, total) {
        const fractionElement = document.querySelector(".before-after-pagination-fraction");
        if (fractionElement) {
          fractionElement.querySelector(".swiper-pagination-current").textContent = current;
          fractionElement.querySelector(".swiper-pagination-total").textContent = total;
        }
      }
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      }
    },
    on: {
      touchStart: function (event) {
        const target = event.target;
        if (target && target.closest) {
          const isArrow = target.closest('[data-ba-arrow]');
          if (isArrow) {
            event.preventDefault();
            event.stopPropagation();
            return false;
          }
        }
        return true;
      }
    }
  });
}

if (typeof window.modules_flsModules === 'undefined') {
  window.modules_flsModules = {};
}

window.modules_flsModules.ba = new BeforeAfter({
  swiper: swiperBeforeAfter,
  logging: true
});

//========================================================================================================================================================

const tabsBlocks = document.querySelectorAll('[data-tabs-switch]');
if (tabsBlocks) {
  tabsBlocks.forEach((block, blockIndex) => {
    const toggle = block.querySelector('.price-toggle');
    if (!toggle) return;

    const textElements = block.querySelectorAll('.heading-complex2__switch .heading-complex2__text');
    if (textElements.length < 2) return;

    const tab1 = block.querySelector('[data-tab="1"]');
    const tab2 = block.querySelector('[data-tab="2"]');

    if (!tab1 || !tab2) {
      return;
    }

    function updateTabs() {
      if (toggle.checked) {
        textElements.forEach(el => el.classList.remove('active'));
        if (textElements[0]) textElements[0].classList.add('active');

        tab1.classList.add('active');
        tab2.classList.remove('active');
      } else {
        textElements.forEach(el => el.classList.remove('active'));
        if (textElements[1]) textElements[1].classList.add('active');

        tab2.classList.add('active');
        tab1.classList.remove('active');
      }
    }

    textElements.forEach((el, index) => {
      el.addEventListener('click', function () {
        if (index === 0) {
          toggle.checked = true;
        } else if (index === 1) {
          toggle.checked = false;
        }
        updateTabs();
      });
    });

    toggle.addEventListener('change', updateTabs);

    updateTabs();
  });
}

//========================================================================================================================================================

//Спойлер
function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    }));
    if (spollersRegular.length) initSpollers(spollersRegular);

    spollersArray.forEach(spollersBlock => {
      const mediaQuery = spollersBlock.dataset.spollers;
      if (mediaQuery) {
        const [maxWidth, type] = mediaQuery.split(",");
        const width = parseInt(maxWidth);

        if (type === "max" && window.innerWidth <= width) {
          if (!spollersBlock.classList.contains("_spoller-init")) {
            initSpollers([spollersBlock]);
          }
        } else if (type === "max" && window.innerWidth > width) {
          if (spollersBlock.classList.contains("_spoller-init")) {
            spollersBlock.classList.remove("_spoller-init");
            initSpollerBody(spollersBlock, false);
            spollersBlock.removeEventListener("click", setSpollerAction);
          }
        }
      }
    });

    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init");
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction);

          initCloseButtons(spollersBlock);
        } else {
          spollersBlock.classList.remove("_spoller-init");
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener("click", setSpollerAction);
        }
      }));
    }

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
      if (spollerTitles.length) {
        spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
        spollerTitles.forEach((spollerTitle => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerTitle.classList.contains("_spoller-active")) {
              if (spollerTitle.nextElementSibling) {
                spollerTitle.nextElementSibling.hidden = true;
              }
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            if (spollerTitle.nextElementSibling) {
              spollerTitle.nextElementSibling.hidden = false;
            }
          }
        }));
      }
    }

    function initCloseButtons(spollersBlock) {
      const closeButtons = spollersBlock.querySelectorAll('.cabinet-orders-spollers__button');

      closeButtons.forEach(button => {
        button.removeEventListener('click', closeSpollerHandler);
        button.addEventListener('click', closeSpollerHandler);
      });
    }

    function closeSpollerHandler(e) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.currentTarget;
      const spollersBlock = button.closest('[data-spollers]');
      const spollerItem = button.closest('.cabinet-orders-spollers__item');

      if (spollersBlock && spollerItem) {
        const spollerTitle = spollerItem.querySelector('[data-spoller]');

        if (spollerTitle && spollerTitle.classList.contains('_spoller-active')) {
          const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

          spollerTitle.classList.remove('_spoller-active');
          spollerItem.classList.remove('_spoller-active');

          const contentBlock = spollerTitle.nextElementSibling;
          _slideUp(contentBlock, spollerSpeed);
        }
      }
    }

    function setSpollerAction(e) {
      const el = e.target;
      const spollerTitle = el.closest("[data-spoller]");
      if (!spollerTitle) return;

      if (el.closest('a') && !spollerTitle.closest('a')) {
        return;
      }

      const spollerItem = spollerTitle.closest(".spollers__item, .cabinet-orders-spollers__item, .menu-catalog__item");
      const spollersBlock = spollerTitle.closest("[data-spollers]");

      if (!spollersBlock) return;

      const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

      if (!spollersBlock.querySelectorAll("._slide").length) {
        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) {
          hideSpollersBody(spollersBlock);
        }

        spollerTitle.classList.toggle("_spoller-active");
        if (spollerItem) spollerItem.classList.toggle("_spoller-active");

        const contentBlock = spollerTitle.nextElementSibling;
        if (contentBlock) {
          _slideToggle(contentBlock, spollerSpeed);
        }

        e.preventDefault();
      }
    }

    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
      if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
        const spollerItem = spollerActiveTitle.closest(".spollers__item, .cabinet-orders-spollers__item, .menu-catalog__item");

        spollerActiveTitle.classList.remove("_spoller-active");
        if (spollerItem) spollerItem.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
      }
    }

    const spollersClose = document.querySelectorAll("[data-spoller-close]");
    if (spollersClose.length) {
      document.addEventListener("click", (function (e) {
        const el = e.target;
        if (!el.closest("[data-spollers]")) {
          spollersClose.forEach((spollerClose => {
            const spollersBlock = spollerClose.closest("[data-spollers]");
            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
            spollerClose.classList.remove("_spoller-active");

            const spollerItem = spollerClose.closest(".spollers__item, .cabinet-orders-spollers__item, .menu-catalog__item");
            if (spollerItem) spollerItem.classList.remove("_spoller-active");

            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
          }));
        }
      }));
    }
  }
}

spollers();
window.addEventListener('resize', function () {
  spollers();
});

//========================================================================================================================================================

//Табы
function tabs() {
  const tabs = document.querySelectorAll('[data-tabs]');
  let tabsActiveHash = [];

  if (tabs.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith('tab-')) {
      tabsActiveHash = hash.replace('tab-', '').split('-');
    }
    tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add('_tab-init');
      tabsBlock.setAttribute('data-tabs-index', index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
    });

    let mdQueriesArray = dataMediaQueries(tabs, "tabs");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }

  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach(tabsMediaItem => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
      let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
      let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
      tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add('_tab-spoller');
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove('_tab-spoller');
        }
      });
    });
  }

  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
      tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
    }
    if (tabsContent.length) {
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute('data-tabs-title', '');
        tabsContentItem.setAttribute('data-tabs-item', '');

        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add('_tab-active');
        }
        tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
      });
    }
    setTabsStatus(tabsBlock);
  }

  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;

    function isTabsAnimate(tabsBlock) {
      if (tabsBlock.hasAttribute('data-tabs-animate')) {
        return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
      }
      return false;
    }
    const tabsBlockAnimate = isTabsAnimate(tabsBlock);

    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute('data-tabs-hash');
      tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains('_tab-active')) {
          if (tabsBlockAnimate) {
            _slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest('.popup')) {
            setHash(`tab-${tabsBlockIndex}-${index}`);
          }
        } else {
          if (tabsBlockAnimate) {
            _slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }

  function setTabsAction(e) {
    const el = e.target;
    if (el.closest('[data-tabs-title]')) {
      const tabTitle = el.closest('[data-tabs-title]');
      const tabsBlock = tabTitle.closest('[data-tabs]');
      if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
        let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
        tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock);
        if (tabActiveTitle.length) tabActiveTitle[0].classList.remove('_tab-active');
        tabTitle.classList.add('_tab-active');
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
tabs();

//========================================================================================================================================================
/*

//========================================================================================================================================================

function activateCheckboxByDataCheck(checkValue) {
  if (!checkValue) return;

  const radio = document.querySelector(`.block-calculator input.options__input[data-check="${checkValue}"]`);
  if (!radio) {
    console.warn(`Radio with data-check="${checkValue}" not found`);
    return;
  }

  radio.checked = true;

  const changeEvent = new Event('change', { bubbles: true });
  radio.dispatchEvent(changeEvent);

  const label = radio.closest('.options__item');
  if (label) {
    const allLabels = label.closest('.options-package').querySelectorAll('.options__item');
    allLabels.forEach(item => item.classList.remove('active'));
    label.classList.add('active');
  }
}



const blockCalc = document.querySelector('.block-calc');
if (blockCalc) {
  function updateResultTitles() {
    const radioButtons = document.querySelectorAll('.options__input[type="radio"]:checked');
    if (!radioButtons.length) return;

    radioButtons.forEach(radio => {
      const targetId = radio.getAttribute('data-target');
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const label = radio.closest('.options__item');
      if (!label) return;

      const textElement = label.querySelector('.options__text');
      if (!textElement) return;

      const priceElement = label.querySelector('.options__price');
      if (priceElement) {
        const text = textElement.textContent.trim();
        const price = priceElement.textContent.trim();
        if (text && price) {
          targetElement.textContent = `${text}/${price}`;
        }
      } else {
        const text = textElement.textContent.trim();
        if (text) {
          targetElement.textContent = text;
        }
      }
    });
  }
  function initRadioHandlers() {
    const radios = document.querySelectorAll('.options__input[type="radio"]');
    if (!radios.length) return;

    radios.forEach(radio => {
      radio.addEventListener('change', function () {
        if (this.checked) {
          updateResultTitles();
        }
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initRadioHandlers();
      updateResultTitles();
    });
  } else {
    initRadioHandlers();
    updateResultTitles();
  }
}

//========================================================================================================================================================



if (document.querySelector('.block-reviews__slider')) {
  const swiperReviews = new Swiper('.block-reviews__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 16,
    speed: 800,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    navigation: {
      prevEl: '.block-reviews-arrow-prev',
      nextEl: '.block-reviews-arrow-next',
    },
    on: {
      init: function () {
        updateFraction(this);
      },
      slideChange: function () {
        updateFraction(this);
      },
    },
  });

  function updateFraction(swiper) {
    const currentEl = document.querySelector('.block-reviews-pagination-fraction .swiper-pagination-current');
    const totalEl = document.querySelector('.block-reviews-pagination-fraction .swiper-pagination-total');

    if (currentEl && totalEl) {
      let currentSlide;
      if (swiper.params.loop) {
        currentSlide = swiper.realIndex + 1;
      } else {
        currentSlide = swiper.activeIndex + 1;
      }
      currentEl.textContent = currentSlide.toString();

      let totalSlides;
      if (swiper.params.loop) {
        totalSlides = swiper.slides.length / 2;
      } else {
        totalSlides = swiper.slides.length;
      }

      totalEl.textContent = totalSlides.toString();
    }
  }
}

if (document.querySelector('.block-documents__slider')) {
  let swiperDocuments = null;
  const breakpoint = 768;

  function initSwiper() {
    const windowWidth = window.innerWidth;

    if (windowWidth <= breakpoint && !swiperDocuments) {
      swiperDocuments = new Swiper('.block-documents__slider', {
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 16,
        speed: 800,
        pagination: {
          el: '.block-documents-pagination',
          clickable: true,
        },
        on: {
        },
      });
    } else if (windowWidth > breakpoint && swiperDocuments) {
      swiperDocuments.destroy(true, true);
      swiperDocuments = null;
    }
  }

  initSwiper();

  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initSwiper, 200);
  });
}



//========================================================================================================================================================



//========================================================================================================================================================



*/

//========================================================================================================================================================
