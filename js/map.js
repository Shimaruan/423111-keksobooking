'use strict';

var dataStore = {
  TITLE_DATA: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  TYPE_DATA: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  TIME_DATA: [
    '12:00',
    '13:00',
    '14:00'
  ],
  FEATURES_DATA: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  PHOTO_DATA: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]
};

var housingTypeData = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var cardsData = [];
var CARDS_DATA_AMOUNT = 8;
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var cardSection = document.querySelector('.map');

var PIN_HALF_WIDTH = 25;
var PIN_HALF_HEIGHT = 70;
var PINS_AMOUNT = 8;
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapPinSection = document.querySelector('.map__pins');
var ATRIBUTE_WIDTH = cardTemplate.querySelector('.popup__photo').width;
var ATRIBUTE_HEIGHT = cardTemplate.querySelector('.popup__photo').height;
var ATRIBUTE_ALT = cardTemplate.querySelector('.popup__photo').alt;
var ATRIBUTE_CLASS = cardTemplate.querySelector('.popup__photo').classList;

var mapVisibility = document.querySelector('.map');

var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var GUESTS_MIN = 1;
var GUESTS_MAX = 15;
var MAP_WIDTH_MIN = 300;
var MAP_WIDTH_MAX = 900;
var MAP_HEIGHT_MIN = 130;
var MAP_HEIGHT_MAX = 630;

var makePrice = function () {
  var price = makeRandomInteger(PRICE_MIN, PRICE_MAX);

  return price;
};

var makeRooms = function () {
  var rooms = makeRandomInteger(ROOMS_MIN, ROOMS_MAX);

  return rooms;
};

var makeGuests = function () {
  var guests = makeRandomInteger(GUESTS_MIN, GUESTS_MAX);

  return guests;
};

var makeCoordinates = function () {
  var coordinates = {
    x: makeRandomInteger(MAP_WIDTH_MIN, MAP_WIDTH_MAX),
    y: makeRandomInteger(MAP_HEIGHT_MIN, MAP_HEIGHT_MAX)
  };

  return coordinates;
};

var makeRandomInteger = function (min, max) {
  var random = min + Math.random() * (max + 1 - min);
  random = Math.floor(random);
  return random;
};

var arrayShuffle = function (arrayForShuffle) {
  for (var i = arrayForShuffle.length - 1; i > 0; i--) {
    var num = Math.floor(Math.random() * (i + 1));
    var d = arrayForShuffle[num];
    arrayForShuffle[num] = arrayForShuffle[i];
    arrayForShuffle[i] = d;
  }
  return arrayForShuffle;
};

var makeFeatures = function () {
  var featuresList = dataStore.FEATURES_DATA.slice();
  arrayShuffle(featuresList);
  featuresList.length = makeRandomInteger(0, dataStore.FEATURES_DATA.length);

  return featuresList;
};

var makeShuffledPhotoList = function () {
  var shuffledArray = dataStore.PHOTO_DATA.slice();
  arrayShuffle(shuffledArray);

  return shuffledArray;
};


var makeCardData = function (data, count) {
  var coordinates = makeCoordinates();

  var cardData = {
    author: {
      avatar: 'img/avatars/user0' + (count + 1) + '.png',
    },

    offer: {
      title: data.TITLE_DATA[count],
      address: coordinates.x + ', ' + coordinates.y,
      price: makePrice(),
      type: data.TYPE_DATA[makeRandomInteger(0, data.TYPE_DATA.length - 1)],
      rooms: makeRooms(),
      guests: makeGuests(),
      checkin: data.TIME_DATA[makeRandomInteger(0, data.TIME_DATA.length - 1)],
      checkout: data.TIME_DATA[makeRandomInteger(0, data.TIME_DATA.length - 1)],
      features: makeFeatures(),
      description: '',
      photos: makeShuffledPhotoList()
    },

    location: {
      x: coordinates.x,
      y: coordinates.y
    }
  };
  return cardData;
};

var makeCardsData = function (amount) {
  var array = [];
  for (var i = 0; i < amount; i++) {
    array.push(makeCardData(dataStore, i));
  }
  return array;
};


var makePin = function (pinData) {
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = pinData.location.x - PIN_HALF_WIDTH + 'px';
  pin.style.top = pinData.location.y - PIN_HALF_HEIGHT + 'px';
  pin.querySelector('img').src = pinData.author.avatar;
  pin.querySelector('img').alt = pinData.author.title;

  return pin;
};

var makePins = function (count) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < count; i++) {
    fragment.appendChild(makePin(cardsData[i]));
  }
  return fragment;
};


var makeFeature = function (modifier) {
  var element = document.createElement('li');
  element.classList = 'popup__feature';
  element.classList.add(modifier);

  return element;
};

var makePopupPhoto = function (srcData) {
  var element = document.createElement('img');
  element.src = srcData;
  element.classList = ATRIBUTE_CLASS;
  element.width = ATRIBUTE_WIDTH;
  element.height = ATRIBUTE_HEIGHT;
  element.alt = ATRIBUTE_ALT;

  return element;
};

var makeCard = function (cardData) {
  var card = cardTemplate.cloneNode(true);

  card.querySelector('.popup__title').textContent = cardData.offer.title;
  card.querySelector('.popup__text--address').textContent = cardData.offer.address;
  card.querySelector('.popup__text--price').textContent = cardData.offer.price + ' ₽/ночь';
  card.querySelector('.popup__type').textContent = housingTypeData[cardData.offer.type];
  card.querySelector('.popup__text--capacity').textContent = cardData.offer.rooms + ' комнаты для '
      + cardData.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardData.offer.checkin
      + ', выезд до ' + cardData.offer.checkout;
  card.querySelector('.popup__description').textContent = cardData.offer.description;
  card.querySelector('.popup__avatar').src = cardData.author.avatar;

  card.querySelector('.popup__photo').remove();
  for (var i = 0; i < cardData.offer.photos.length; i++) {
    card.querySelector('.popup__photos').appendChild(makePopupPhoto(cardData.offer.photos[i]));
  }

  for (i = 0; i < cardData.offer.features.length; i++) {
    card.querySelector('.popup__features').appendChild(
        makeFeature('popup__feature--' + cardData.offer.features[i]));
  }
  return card;
};


mapVisibility.classList.remove('map--faded');

cardsData = makeCardsData(CARDS_DATA_AMOUNT);

mapPinSection.appendChild(makePins(PINS_AMOUNT));

cardSection.insertBefore(makeCard(cardsData[0]), document.querySelector('.map__filters-container'));
