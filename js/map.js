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

var initialData = {
  titleData: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  typeData: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  timeData: [
    '12:00',
    '13:00',
    '14:00'
  ],
  featuresData: {
    featuresList: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'
    ],


    getAvailaibleFeatures: function () {
      var featuresData = [];
      for (var i = 0; i < makeRandomInteger(0, this.featuresList.length); i++) {
        featuresData.push(this.featuresList[i]);
      }
      return featuresData;
    }
  },
  photoData: {
    photoList: [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ],


    getShuffledPhotoList: function () {
      var shuffledArray = this.photoList.slice();
      arrayShuffle(shuffledArray);
      return shuffledArray;
    }
  },
  coordinateData: {
    x: [],
    y: [],


    createCoordinates: function () {
      for (var i = 0; i < 8; i++) {
        this.x.push(makeRandomInteger(300, 900));
        this.y.push(makeRandomInteger(130, 630));
      }
    }
  }
};

initialData.coordinateData.createCoordinates();

var makeTestData = function (data) {
  var totals = [];

  for (var i = 0; i < 8; i++) {
    totals[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },

      offer: {
        title: data.titleData[i],
        address: data.coordinateData.x[i] + ', ' + data.coordinateData.y[i],
        price: makeRandomInteger(1000, 1000000),
        type: data.typeData[makeRandomInteger(0, data.typeData.length - 1)],
        rooms: makeRandomInteger(1, 5),
        guests: makeRandomInteger(1, 15),
        checkin: data.timeData[makeRandomInteger(0, data.timeData.length - 1)],
        checkout: data.timeData[makeRandomInteger(0, data.timeData.length - 1)],
        features: data.featuresData.getAvailaibleFeatures(),
        description: '',
        photos: data.photoData.getShuffledPhotoList()
      },

      location: {
        x: data.coordinateData.x[i],
        y: data.coordinateData.y[i]
      }
    };
  }
  return totals;
};

var makeMapPin = function (locationX, locationY, avatar, title) {
  var mapPinTemplate = document.querySelector('template')
      .content
      .querySelector('.map__pin');
  var mapPinTemplateClone = mapPinTemplate.cloneNode(true);

  mapPinTemplateClone.style = 'left:' + (locationX - 25) + 'px;' + 'top:'
      + (locationY - 70) + 'px;';
  mapPinTemplateClone.querySelector('img').src = avatar;
  mapPinTemplateClone.querySelector('img').alt = title;
  return mapPinTemplateClone;
};

var housingTypeData = {
  housingTypeList: {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  },

  getHousingType: function (housingType) {
    var type = this.housingTypeList[housingType];
    return type;
  }
};

var makeAvailableFeaturesList = function (length) {
  var featuresListTemplate = document.querySelector('template')
      .content
      .querySelector('.popup__features');
  var featuresListTemplateClone = featuresListTemplate.cloneNode(true);
  var featuresListTemplateCloneLength = featuresListTemplateClone.querySelectorAll('.popup__feature').length;
  var featuresListDataLength = length;

  for (var i = featuresListTemplateCloneLength; i > featuresListDataLength; i--) {
    featuresListTemplateClone.removeChild(featuresListTemplateClone.querySelector('.popup__feature:last-child'));
  }
  return featuresListTemplateClone;
};

var makePhotoList = function (data) {
  var photoListTemplate = document.querySelector('template')
      .content
      .querySelector('.popup__photos');
  var photoListTemplateClone = photoListTemplate.cloneNode(true);
  var photoListTemplateCloneFirstChild = photoListTemplateClone.querySelector('.popup__photo:first-child');

  for (var i = 0; i < 3; i++) {
    photoListTemplateCloneFirstChild.src = data[i];
    if (photoListTemplateClone.querySelectorAll('.popup__photo').length === data.length) {
      break;
    }
    photoListTemplateCloneFirstChild = photoListTemplateClone
        .querySelector('.popup__photo:first-child').cloneNode(true);
    photoListTemplateClone.insertBefore(photoListTemplateCloneFirstChild,
        photoListTemplateClone.querySelector('.popup__photo:first-child'));
  }
  return photoListTemplateClone;
};

var makeCard = function (cardData, arrayIndex) {
  var cardTemplate = document.querySelector('template')
      .content
      .querySelector('.map__card');
  var cardTemplateClone = cardTemplate.cloneNode(true);

  cardTemplateClone.querySelector('.popup__title').textContent =
      cardData[arrayIndex].offer.title;
  cardTemplateClone.querySelector('.popup__text--address').textContent =
      cardData[arrayIndex].offer.address;
  cardTemplateClone.querySelector('.popup__text--price').textContent =
      cardData[arrayIndex].offer.price + ' ₽/ночь';
  cardTemplateClone.querySelector('.popup__type').textContent =
      housingTypeData.getHousingType(cardData[arrayIndex].offer.type);
  cardTemplateClone.querySelector('.popup__text--capacity').textContent =
      cardData[arrayIndex].offer.rooms + ' комнаты для ' + cardData[arrayIndex].offer.guests + ' гостей';
  cardTemplateClone.querySelector('.popup__text--time').textContent =
     'Заезд после ' + cardData[arrayIndex].offer.checkin + ', выезд до ' + cardData[arrayIndex].offer.checkout;
  cardTemplateClone.querySelector('.popup__description').textContent =
      cardData[arrayIndex].offer.description;
  cardTemplateClone.querySelector('.popup__avatar').src =
      cardData[arrayIndex].author.avatar;

  var featuresListTemplate = cardTemplateClone.querySelector('.popup__features');
  var availableFeaturesList = makeAvailableFeaturesList(cardData[arrayIndex].offer.features.length);
  cardTemplateClone.replaceChild(availableFeaturesList, featuresListTemplate);

  var photoListTemplate = cardTemplateClone.querySelector('.popup__photos');
  var actualPhotoList = makePhotoList(cardData[arrayIndex].offer.photos);
  cardTemplateClone.replaceChild(actualPhotoList, photoListTemplate);

  return cardTemplateClone;
};


// --------------------------------------------------
var testData = (makeTestData(initialData));
var mapVisibility = document.querySelector('.map');
mapVisibility.classList.remove('map--faded');

var MapPinContainer = document.createDocumentFragment();
for (var i = 0; i < 8; i++) {
  MapPinContainer.appendChild(makeMapPin(testData[i].location.x, testData[i].location.y,
      testData[i].author.avatar, testData[i].offer.title));
}
var mapPinSection = document.querySelector('.map__pins');
mapPinSection.appendChild(MapPinContainer);

var cardsContainer = document.createDocumentFragment();
for (var j = 0; j < 8; j++) {
  cardsContainer.appendChild(makeCard(testData, j));
}
var cardsSection = document.querySelector('.map');
cardsSection.insertBefore(cardsContainer, document.querySelector('.map__filters-container'));
