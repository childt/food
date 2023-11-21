window.addEventListener('DOMContentLoaded', () => {

    //Tabs

    const tabs = document.querySelectorAll('.tabheader__item'), // табы
          tabsContent = document.querySelectorAll('.tabcontent'), // Контент
          tabsParent = document.querySelector('.tabheader__items'); //Родитель

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide'); //срыть табы контента
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active'); //убираем класс активности
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade'); //показать табы контента
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');//добавляем класс активности
    }

    hideTabContent(); //скрываем все табы
    showTabContent(); //показываем первый таб и назначаем ему класс активности

    //используем делегирование событий и назначаем событие родителю
    tabsParent.addEventListener('click', (event) => { //обращаемся к родителю табов
        const target = event.target; //сокращаем просто чтобы не повторять event.target

        if (target && target.classList.contains('tabheader__item')) { // проверяем куда кликнули
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent(); //скрываем все табы
                    showTabContent(i); //показываем i-тый таб и назначаем ему класс активности
                }
            });
        }
    });

    // Timer

    const deadline = '2022-05-20'; // создаем в виде строки наш дедлайн

    function getTimeRemaining(endtime) { //определяет разницу между текущим временем и какой-то датой (дедлайном)
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date()); //количество милисекунд: конечное время (ДО) минус текущая дата
        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),//дней: количество милисекунд разделить на кол-во мс в сутках, и округляем
            hours = Math.floor((t / (1000 * 60 * 60) % 24)), //часов, оператор % возвращает остаток от деления, хвостик от деления
            minutes = Math.floor((t / (1000 / 60) % 60)), // минут. тоже хвостик
            seconds = Math.floor((t / 1000) % 60); // секунд. тоже хвостик от деления
        };
        
        return {  // возвращаем объект {}
            'total': t,   //на случай если дата дедлайн уже наступила, в таком случае там будет отрицательное значение
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) { //прибавление 0 к однозначным цифрам (0...9) в таймере: 01, 02,...09
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {  // установка таймера на страницу
        const timer = document.querySelector(selector), // selector - это будет тэг '.timer'
                days = timer.querySelector('#days'),
                hours = timer.querySelector('#hours'),
                minutes = timer.querySelector('#minutes'),
                seconds = timer.querySelector('#seconds'),
                timeInterval = setInterval(updateClock, 1000); //установить интервал 1 секунда
        updateClock();

        function updateClock() {  //обновление таймера каждую секунду
            const t = getTimeRemaining(endtime); //результат работы этой функции - объект

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) { //если время вышло то
                clearInterval(timeInterval);  // остановить таймер
            }
        } 
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'), //All
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-close]');

    function openModal() { // открыть модальное окно (повторяющийся участок кода)
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; // добавляем стиль для запрета скроллинга если открыто мод.окно
        clearInterval(modalTimerId); //очистка таймера (если пользователь уже открывал модалку, то она ему не покажется через время)
    };

    modalTrigger.forEach(btn => { //открытие модального окна, перебираем все кнопки
        btn.addEventListener('click', openModal); // открытие модального окна
        //Здесь мы пишем openModal без скобок потому что мы не вызываем функцию а передаем ее
        // Она будет выполнена только после клика
    });

    function closeModal() {   // закрытие модального окна (повторяющийся участок кода)
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // удаляем стиль для запрета скроллинга когда закрываем мод.окно
    };

    modalCloseBtn.addEventListener('click', closeModal); // закрытие модального окна
    //Здесь мы пишем closeModal без скобок потому что мы не вызываем функцию а передаем ее
    // Она будет выполнена только после клика

    modal.addEventListener('click', (e) => {  // закрываем мод.окно кликнув по подложке
        if (e.target === modal) {
            closeModal(); // А здесь мы уже вызываем функцию closeModal
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // const modalTimerId = setTimeout(openModal, 5000); //показать модальное окно через 5 секунд

    function showModalByScroll() { // функция проверки долистал ли пользователь до конца страницы
        // сравниваем положение на странице и высоту страницы
        // если видимая часть старницы + прокрутка справа <= полная прокрутка
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            // if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            // проверка долистал ли пользователь до конца страницы, точнее до -1 пиксель до конца в некоторых браузерах)
                openModal();
                window.removeEventListener('scroll', showModalByScroll);
        };
    }

    window.addEventListener('scroll', showModalByScroll); // вызов проверки долистал ли пользователь до конца страницы

    // Используем классы для карточек
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes; // это массив!
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH(); 
        }

        changeToUAH() {
            this.price = this.price * this.transfer; 
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) { // проверяем не пуст ли массив
                this.element = 'menu__item' // по дефолту будет класс menu__item (это правильно так писать)
                element.classList.add(this.element); // либо другой если вдруг что-то потом изменится
            } else {
                this.classes.forEach(className => element.classList.add(className)); //перебираем массив classes
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div> 
            `;
            this.parent.append(element);
        }
    }    

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container",
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        ".menu .container",
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        ".menu .container",
        'menu__item'
    ).render();

    

});



