'use strict';

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

var INITIALDATA = {
  AVATAR: [
    'img/avatars/user01.png',
    'img/avatars/user02.png',
    'img/avatars/user03.png',
    'img/avatars/user04.png',
    'img/avatars/user05.png',
    'img/avatars/user06.png',
    'img/avatars/user07.png',
    'img/avatars/user08.png'
  ],
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

var priceData = makeRandomInteger(1000, 1000000);
var coordinateDataX = makeRandomInteger(300, 900);
var coordinateDataY = makeRandomInteger(130, 630);
var roomsData = makeRandomInteger(1, 5);
var guestData = makeRandomInteger(1, 15);

var makeAvailaibleFeatures = function () {
  var featuresList = [];
  for (var i = 0; i < makeRandomInteger(0, INITIALDATA.FEATURES_DATA.length); i++) {
    featuresList.push(INITIALDATA.FEATURES_DATA[i]);
  }
  return featuresList;
};

var makeShuffledPhotoList = function () {
  var shuffledArray = INITIALDATA.PHOTO_DATA.slice();
  arrayShuffle(shuffledArray);
  return shuffledArray;
};


var makeCardData = function (data, count) {
  var total = {
    author: {
      avatar: data.AVATAR[count]
    },

    offer: {
      title: data.TITLE_DATA[count],
      address: coordinateDataX + ', ' + coordinateDataY,
      price: priceData,
      type: data.TYPE_DATA[makeRandomInteger(0, data.TYPE_DATA.length - 1)],
      rooms: roomsData,
      guests: guestData,
      checkin: data.TIME_DATA[makeRandomInteger(0, data.TIME_DATA.length - 1)],
      checkout: data.TIME_DATA[makeRandomInteger(0, data.TIME_DATA.length - 1)],
      features: makeAvailaibleFeatures(),
      description: '',
      photos: makeShuffledPhotoList()
    },

    location: {
      x: coordinateDataX,
      y: coordinateDataY
    }
  };
  return total;
};

var cardsData = [];
for (var i = 0; i < 8; i++) {
  priceData = makeRandomInteger(1000, 1000000);
  coordinateDataX = makeRandomInteger(300, 900);
  coordinateDataY = makeRandomInteger(130, 630);
  roomsData = makeRandomInteger(1, 5);
  guestData = makeRandomInteger(1, 15);

  cardsData.push(makeCardData(INITIALDATA, i));
}


var mapVisibility = document.querySelector('.map');
mapVisibility.classList.remove('map--faded');


var pinHalfWidth = 25;
var pinHeight = 70;

var mapPinTemplate = document.querySelector('template')
      .content
      .querySelector('.map__pin');

var makeMapPin = function (pinData) {
  var elementClone = mapPinTemplate.cloneNode(true);

  elementClone.style = 'left:' + (pinData.location.x - pinHalfWidth) + 'px;' + 'top:'
      + (pinData.location.y - pinHeight) + 'px;';
  elementClone.querySelector('img').src = pinData.author.avatar;
  elementClone.querySelector('img').alt = pinData.author.title;
  return elementClone;
};

var mapPinContainer = document.createDocumentFragment();
for (var j = 0; j < 8; j++) {
  mapPinContainer.appendChild(makeMapPin(cardsData[j]));
}
var mapPinSection = document.querySelector('.map__pins');
mapPinSection.appendChild(mapPinContainer);


var housingTypeData = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var getHousingType = function (housingType) {
  var type = housingTypeData[housingType];
  return type;
};

var cardTemplate = document.querySelector('template')
      .content
      .querySelector('.map__card');

var makeCard = function (cardData) {
  var elementClone = cardTemplate.cloneNode(true);

  elementClone.querySelector('.popup__title').textContent = cardData.offer.title;
  elementClone.querySelector('.popup__text--address').textContent = cardData.offer.address;
  elementClone.querySelector('.popup__text--price').textContent = cardData.offer.price + ' ₽/ночь';
  elementClone.querySelector('.popup__type').textContent = getHousingType(cardData.offer.type);
  elementClone.querySelector('.popup__text--capacity').textContent = cardData.offer.rooms + ' комнаты для '
      + cardData.offer.guests + ' гостей';
  elementClone.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardData.offer.checkin
      + ', выезд до ' + cardData.offer.checkout;
  elementClone.querySelector('.popup__description').textContent = cardData.offer.description;
  elementClone.querySelector('.popup__avatar').src = cardData.author.avatar;

  // список доступных удобств
  var featuresList = elementClone.querySelector('.popup__features');
  var initialLength = elementClone.querySelector('.popup__features')
      .querySelectorAll('.popup__feature').length;
  var currentlistLength = cardData.offer.features.length;

  for (;initialLength > currentlistLength; initialLength--) {
    featuresList.removeChild(featuresList.querySelector('.popup__feature:last-child'));
  }

  // добавление фото
  var photoList = elementClone.querySelector('.popup__photos');
  var firstChild = elementClone.querySelector('.popup__photo:first-child');

  for (var c = 0; c < cardData.offer.photos.length; c++) {
    firstChild.src = cardData.offer.photos[c];
    if (elementClone.querySelectorAll('.popup__photo').length === cardData.offer.photos.length) {
      break;
    }
    firstChild = elementClone.querySelector('.popup__photo:first-child').cloneNode(true);
    photoList.insertBefore(firstChild, elementClone.querySelector('.popup__photo:first-child'));
  }
  return elementClone;
};

var cardsSection = document.querySelector('.map');

for (var k = 0; k < 8; k++) {
  cardsSection.insertBefore(makeCard(cardsData[k]), document.querySelector('.map__filters-container'));
}
