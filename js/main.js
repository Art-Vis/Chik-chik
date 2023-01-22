const API_URL = 'https://knowing-blossom-notify.glitch.me/';

/*  Доступные методы:
GET /api - получить список услуг
GET /api?service={n} - получить список барберов
GET /api?spec={n} - получить список месяца работы барбера
GET /api?spec={n}&month={n} - получить список дней работы барбера
GET /api?spec={n}&month={n} - получить список свободных часов барбера
POST /api/order - оформить заказ
*/

const addPreload = (elem) => {
  elem.classList.add('preload');
}; // функция добавления класса preload

const removePreload = (elem) => {
  elem.classList.remove('preload');
}; // функция удаления класса preload

const startSlider = () => {
  const sliderItems = document.querySelectorAll('.slider__item'); // sliderItems = всем элементам с классом slider__item
  const sliderList = document.querySelector('.slider__list'); // sliderList получаем элемент slider__list
  const btnPrevSlide = document.querySelector('.slider__arrow_left');  // btnNextSlide получаем элемент slider__arrow_left
  const btnNextSlide = document.querySelector('.slider__arrow_right');  // btnNextSlide получаем элемент slider__arrow_right

  let activeSlide = 1; // указываем активный элемент (счет начинается с 0)
  let position = 0; // наша изначальная позиция

  const checkSlider = () => {
    if (
      (activeSlide + 2 === sliderItems.length &&
        document.documentElement.offsetWidth > 560) ||
      activeSlide === sliderItems.length
    ) {
      btnNextSlide.style.display = 'none';
    } else {
      btnNextSlide.style.display = '';
    }

    if (activeSlide === 1) {
      btnPrevSlide.style.display = 'none';
    } else {
      btnPrevSlide.style.display = '';
    }
  }; // функция защиты , что бы прокрут останавливался на крайнем и начальном slider__item

  checkSlider();

  const nextSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item_active');  // обращяемся к активному слайду и удаляем у него класс
    position = -sliderItems[0].clientWidth * activeSlide;

    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide += 1; // делаем активным следующий sliderItems
    sliderItems[activeSlide]?.classList.add('slider__item_active');  // обращяемся к активному слайду и добавлянем к нему класс
    checkSlider();
  }; // функция: переключение на следующий слайд

  const prevSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item_active');  // обращяемся к активному слайду и удаляем у него класс
    position = -sliderItems[0].clientWidth * (activeSlide - 2);

    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide -= 1; // делаем активным предыдущий sliderItems
    sliderItems[activeSlide]?.classList.add('slider__item_active');  // обращяемся к активному слайду и добавлянем к нему класс
    checkSlider();
  }; // функция: переключение на предыдущий слайд

  btnNextSlide.addEventListener('click', nextSlide); // вызываем функцию по клику
  btnPrevSlide.addEventListener('click', prevSlide); // вызываем функцию по клику

  window.addEventListener('resize', () => {
    if (
      activeSlide + 2 > sliderItems.length &&
      document.documentElement.offsetWidth > 560
    ) {
      activeSlide = sliderItems.length - 2;
      sliderItems[activeSlide]?.classList.add('slider__item_active')
    }

    position = -sliderItems[0].clientWidth * (activeSlide - 1);
    sliderList.style.transform = `translateX(${position}px)`;
    checkSlider();
  });
};

const initSlider = () => {
  const slider = document.querySelector('.slider'); // переменная  получает элемент слайдер
  const sliderContainer = document.querySelector('.slider__container'); // переменная  получает элемент слайдер контейнер

  sliderContainer.style.display = 'none'; // скрываем слайдер контейнер
  addPreload(slider); // добавляем слайдеру класс  preload

  window.addEventListener('load', () => { // событие load : функция запустится , когда загрузится страница
    sliderContainer.style.display = ''; // показываем слайдер контейнер после загрузки страницы
    removePreload(slider);

    startSlider(); // функция startSlider , removePreload(slider) удаляет класс preload у slider
  });
};

const renderPrice = (wrapper, data) => {
  data.forEach((item) => {
    const priceItem = document.createElement('li'); // создаем элемент <li>
    priceItem.classList.add('price__item'); // добавляем этому элементу класс price__item

    priceItem.innerHTML = `
            <span class="price__item-title">${item.name}</span>
            <span class="price__item-count">${item.price} руб</span>
        `;

    wrapper.append(priceItem); // в обертку вставляем priceItem
  }); // перебираем данные , будем получать название и стоимость. forEach (не возвращает элементы)
}; // wrapper это обертка , т.е  priceList


const renderService = (wrapper, data) => {
  const labels = data.map(item => {
    const label = document.createElement('label')
    label.classList.add('radio');
    label.innerHTML = `
            <input class="radio__input" type="radio" name="service" value="${item.id}">
            <span class="radio__label">${item.name}</span>
        `;
    return label; // возвращаем label и он попадает в переменную labels в виде массива
  }); // перебираем data c помощью map (map возвращает элементы)

  wrapper.append(...labels); // обязательно использовать спред оператор в данном случае
};


const initService = () => {
  const priceList = document.querySelector('.price__list');
  const reserveFieldsetService = document.querySelector('.reserve__fieldset_service');
  priceList.textContent = ''; // очищаем price__list и делаем его пустым
  addPreload(priceList); // ставим на место пустого price__list , прелоудер (кольцо загрузки)

  reserveFieldsetService.innerHTML = '<legend class="reserve__legend">Услуга</legend>';
  addPreload(reserveFieldsetService); // добавляем кольцо загрузки

  fetch(`${API_URL}/api`)
    .then(response => response.json()) // если аргумент один , скобки можно не использовать (response)
    .then(data => {
      renderPrice(priceList, data); // функция вызова списка и стоимости услуг , взятого с сервера
      removePreload(priceList); // удаляет кольцо загрузки , после добавления элементов в  priceList
      return data;
    }) // функция которая изначально есть в JS , функция (response) дает ответ который мы получаем в формате JSON
    .then(data => {
      renderService(reserveFieldsetService, data);
      removePreload(reserveFieldsetService);
    })
}; // функция будет получать список стоимости услуг и обновлять его


const addDisabled = (arr) => {
  arr.forEach(elem => {
    elem.disabled = true; // для каждого элемента
  });
};

const removeDisabled = (arr) => {
  arr.forEach(elem => {
    elem.disabled = false; // для каждого элемента
  });
};

const renderSpec = (wrapper, data) => {
  const labels = data.map(item => {
    const label = document.createElement('label')
    label.classList.add('radio');
    label.innerHTML = `
        <input class="radio__input" type="radio" name="spec" value="${item.id}">
        <span class="radio__label radio__label_spec" style="--bg-image: url(${API_URL}${item.img})">${item.name}</span>
        `;
    return label; // возвращаем label и он попадает в переменную labels в виде массива
  }); // перебираем data c помощью map (map возвращает элементы)

  wrapper.append(...labels); // обязательно использовать спред оператор в данном случае
};

const renderMonth = (wrapper, data) => { // data - данные , wrapper - обертка
  const labels = data.map(month => {
    const label = document.createElement('label') // создаем label
    label.classList.add('radio'); // добавляем класс  radio
    label.innerHTML = `
        <input class="radio__input" type="radio" name="month" value="${month}">
        <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', { // о методе  Intl(даты, числа , время) - читать в интернете
      month: 'long'
    }).format(new Date(month))}</span>
        `;  // .format(new Date(item)) - тут передаем дату
    return label; // возвращаем label и он попадает в переменную labels в виде массива
  }); // перебираем data c помощью map (map возвращает элементы)

  wrapper.append(...labels); // обязательно использовать спред оператор в данном случае
};

const renderDay = (wrapper, data, month) => { // data - данные , wrapper - обертка
  const labels = data.map(day => {
    const label = document.createElement('label') // создаем label
    label.classList.add('radio'); // добавляем класс  radio
    label.innerHTML = `
        <input class="radio__input" type="radio" name="day" value="${day}">
        <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', { // о методе  Intl(даты, числа , время) - читать в интернете
      month: 'long', day: 'numeric'
    }).format(new Date(`${month}/${day}`))}</span>
        `;  // .format(new Date(`${month}/${day}`)) - тут передаем дату (если она состоит только из месяца и дня)
    return label; // возвращаем label и он попадает в переменную labels в виде массива
  }); // перебираем data c помощью map (map возвращает элементы)

  wrapper.append(...labels); // обязательно использовать спред оператор в данном случае
};

const renderTime = (wrapper, data) => { // data - данные , wrapper - обертка
  const labels = data.map(time => {
    const label = document.createElement('label') // создаем label
    label.classList.add('radio'); // добавляем класс  radio
    label.innerHTML = `
        <input class="radio__input" type="radio" name="time" value="${time}">
        <span class="radio__label">${time}</span>
        `;  // .format(new Date(`${month}/${day}`)) - тут передаем дату (если она состоит только из месяца и дня)
    return label; // возвращаем label и он попадает в переменную labels в виде массива
  }); // перебираем data c помощью map (map возвращает элементы)

  wrapper.append(...labels); // обязательно использовать спред оператор в данном случае
};


const initReserve = () => {
  const reserveForm = document.querySelector('.reserve__form');
  const {
    fieldservice,
    fieldspec,
    fielddate,
    fieldmonth,
    fieldday,
    fieldtime,
    btn,
  } = reserveForm;  // {fieldspec, fielddate, fieldmonth, fieldday, fieldtime, btn} - имена полей , данного обьекта (ДЕСТРУКТУРИЗАЦИЯ)

  addDisabled([fieldspec, fielddate, fieldmonth, fieldday, fieldtime, btn]);

  reserveForm.addEventListener('change', async event => { // функция становится асинхронной , из за этого мы може использовать ключевое слово await
    const target = event.target;

    if (target.name === 'service') {
      addDisabled([fieldspec, fielddate, fieldmonth, fieldday, fieldtime, btn]); // блокируем выбор
      fieldspec.innerHTML = '<legend class="reserve__legend">Специалист</legend>'; // добавляем заголовок Специалист
      addPreload(fieldspec); // добавляем кольцо загрузки для fieldspec(Специалист)
      const response = await fetch(`${API_URL}/api?service=${target.value}`); // вызываем fetch через await. await дожидается выполнения запроса fetch
      const data = await response.json(); // получаем данные с сервера
      renderSpec(fieldspec, data); // выводим подходящих специалистов
      removePreload(fieldspec); // после вывода специалистов убираем кольцо загрузки
      removeDisabled([fieldspec]); // разблокируем выбор специалистов
    }

    if (target.name === 'spec') {
      addDisabled([fielddate, fieldmonth, fieldday, fieldtime, btn]); // блокируем выбор
      addPreload(fieldmonth); // добавляем кольцо загрузки для fieldmonth(Дата и время)
      const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}`); // вызываем fetch через await. await дожидается выполнения запроса fetch
      const data = await response.json(); // получаем данные с сервера
      fieldmonth.textContent = ''; // очищаем список месяцев
      renderMonth(fieldmonth, data); // выводим подходящee (Дата и время)
      removePreload(fieldmonth); // после вывода Дата и время убираем кольцо загрузки
      removeDisabled([fielddate, fieldmonth]); // разблокируем выбор Дата и время
    }

    if (target.name === 'month') {
      addDisabled([fieldday, fieldtime, btn]); // блокируем выбор
      addPreload(fieldday); // добавляем кольцо загрузки для fieldday(Дата и время)
      const response = await fetch(
        `${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}`); // получить список дней работы барбера
      const data = await response.json(); // получаем данные с сервера
      fieldday.textContent = ''; // очищаем список месяцев
      renderDay(fieldday, data, reserveForm.month.value); // выводим подходящee (Дата и время)
      removePreload(fieldday); // после вывода Дата и время убираем кольцо загрузки
      removeDisabled([fieldday]); // разблокируем выбор Дата и время
    }

    if (target.name === 'day') {
      addDisabled([fieldtime, btn]); // блокируем выбор
      addPreload(fieldtime); // добавляем кольцо загрузки для fielddate(Дата и время)
      const response = await fetch(
        `${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`); // получить список свободных часов барбера
      const data = await response.json(); // получаем данные с сервера
      fieldtime.textContent = ''; // очищаем список часов
      renderTime(fieldtime, data); // выводим подходящee (Дата и время)
      removePreload(fieldtime); // после вывода Дата и время убираем кольцо загрузки
      removeDisabled([fieldtime]); // разблокируем выбор Дата и время
    }

    if (target.name === 'time') {
      removeDisabled([btn]); // разблокируем кнопку записи
    }
  });

  reserveForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // отменяем перезагрузку сраницы

    const formData = new FormData(reserveForm); // формирует специально хранилище для данных из формы
    const json = JSON.stringify(Object.fromEntries(formData));

    const response = await fetch(`${API_URL}api/order`, {
      method: 'post', // метод отправки
      body: json, // тело запроса (данные которые отправляем)
    });

    const data = await response.json();
    console.log('data: ', data);

    addDisabled([
      fieldservice,
      fieldspec,
      fielddate,
      fieldmonth,
      fieldday,
      fieldtime,
      btn,
    ]);

    const p = document.createElement('p');
    p.classList.add('service__success');
    p.textContent = `
            Спасибо, ваш номер брони №${data.id}!
            Ждем вас ${new Intl.DateTimeFormat('ru-RU', {
      month: 'long',
      day: 'numeric'
    }).format(new Date(`${data.month}/${data.day}`))},
            время ${data.time};
        `;

    reserveForm.append(p);
  }); // отправляем данные на сервер
};

const init = () => {
  initSlider();
  initService();
  initReserve();
}; // функция для запуска

window.addEventListener('DOMContentLoaded', init);

