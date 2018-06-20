var mapTumbler = document.querySelector('.map');

var makeTestData = function (numberOfObject) {
  var data = [];
  var initialData = [
  [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  [
    '12:00',
    '13:00',
    '14:00'
  ],
  [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]
  ];
  var coordinateX = 0;
  var coordinateY = 0;

  var makeRandomInteger = function (min, max) {
    var random = min + Math.random() * (max + 1 - min);
    random = Math.floor(random);
    return random;
  }

  var arrayShuffle = function(arrayForShuffle) {
    for (var i = arrayForShuffle.length - 1; i > 0; i--) {
        var num = Math.floor(Math.random() * (i + 1));
        var d = arrayForShuffle[num];
        arrayForShuffle[num] = arrayForShuffle[i];
        arrayForShuffle[i] = d;
    }
    return arrayForShuffle;
  }


  for (var i = 0; i < numberOfObject; i++) {
    coordinateX = makeRandomInteger(300, 900);
    coordinateY = makeRandomInteger(130, 630);

    var featuresData = [];
    for (var j = 0; j < makeRandomInteger(0, initialData[3].length); j++) {
      featuresData.push(initialData[3][j]);
    }

    arrayShuffle(initialData[4]);
    var photosData = [];
    for (var n = 0; n < initialData[4].length; n++) {
      photosData.push(initialData[4][n]);
    }

    data[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1 ) + '.png'
      },

      offer: {
        title: initialData[0][i],
        address: coordinateX + ', ' + coordinateY,
        price: makeRandomInteger(1000, 1000000),
        type: initialData[1][makeRandomInteger(0, initialData[1].length - 1)],
        rooms: makeRandomInteger(1, 5),
        guests: makeRandomInteger(1, 15),
        checkin: initialData[2][makeRandomInteger(0, initialData[2].length - 1)],
        checkout: initialData[2][makeRandomInteger(0, initialData[2].length - 1)],
        features: featuresData,
        description: '',
        photos: photosData
      },

      location: {
        x: coordinateX,
        y: coordinateY
      }
    }
  }
  return data;
}

var makeMapPin = function (mapPinData) {
  var mapPinSection = document.querySelector('.map__pins');
  var MapPinContainer = document.createDocumentFragment();
  var mapPinTemplate = document.querySelector('template')
      .content
      .querySelector('.map__pin');

  for (var i = 0; i < mapPinData.length; i++) {
    var mapPinTemplate = mapPinTemplate.cloneNode(true);

    mapPinTemplate.style = 'left:' + (mapPinData[i].location.x - 25) + 'px;' + 'top:' + (mapPinData[i].location.y - 70) +'px;';
    mapPinTemplate.querySelector('img').src = mapPinData[i].author.avatar;
    mapPinTemplate.querySelector('img').alt = mapPinData[i].offer.title;

    MapPinContainer.appendChild(mapPinTemplate);
  }
  mapPinSection.appendChild(MapPinContainer);
}

var makeCards = function (cardsData) {
  var cardsSection = document.querySelector('.map');
  var cardsContainer = document.createDocumentFragment();
  var cardTemplate = document.querySelector('template')
      .content
      .querySelector('.map__card');

  for (var i = 0; i < cardsData.length; i++) {
    var cardTemplateClone = cardTemplate.cloneNode(true);

    cardTemplateClone.querySelector('.popup__title').textContent = cardsData[i].offer.title;
    cardTemplateClone.querySelector('.popup__text--address').textContent = cardsData[i].offer.address;
    cardTemplateClone.querySelector('.popup__text--price').textContent = cardsData[i].offer.price + ' ₽/ночь';
    cardTemplateClone.querySelector('.popup__text--capacity').textContent = cardsData[i].offer.rooms
        + ' комнаты для ' + cardsData[i].offer.guests + ' гостей';
    cardTemplateClone.querySelector('.popup__text--time').textContent = 'Заезд после '
        + cardsData[i].offer.checkin + ', выезд до ' + cardsData[i].offer.checkout;
    cardTemplateClone.querySelector('.popup__description').textContent = cardsData[i].offer.description;
    cardTemplateClone.querySelector('.popup__avatar').src = cardsData[i].author.avatar

    if (cardsData[i].offer.type === 'flat') {
      cardTemplateClone.querySelector('.popup__type').textContent = 'Квартира';
    } else if (cardsData[i].offer.type === 'bungalo') {
        cardTemplateClone.querySelector('.popup__type').textContent = 'Бунгало';
      } else if (cardsData[i].offer.type === 'house') {
          cardTemplateClone.querySelector('.popup__type').textContent = 'Дом';
        } else {
          cardTemplateClone.querySelector('.popup__type').textContent = 'Дворец';
        }

    //расчет списка доступных удобств
    var featuresListLength = cardTemplateClone.querySelector('.popup__features')
        .querySelectorAll('.popup__feature').length;
    var featureDataLength = cardsData[i].offer.features.length;
    var featuresList = cardTemplateClone.querySelector('.popup__features');

    for (var j = featuresListLength; j > featureDataLength; j--) {
      featuresList.removeChild(featuresList.querySelector('.popup__feature:last-child'));
    }

    //добавление фото
    var photosList = cardTemplateClone.querySelector('.popup__photos');
    console.log(photosList);

    for (var n = 0; n < cardsData[i].offer.photos.length; n++) {
      cardTemplateClone.querySelector('.popup__photo:first-child').src = cardsData[i].offer.photos[n];
      if (photosList.querySelectorAll('.popup__photo').length === cardsData[i].offer.photos.length) break;
      var photosListElementClone = cardTemplateClone.querySelector('.popup__photo').cloneNode(true);
      photosList.insertBefore(photosListElementClone, cardTemplateClone.querySelector('.popup__photo:first-child'));
    }
    cardsContainer.appendChild(cardTemplateClone);
  }
  cardsSection.appendChild(cardsContainer);
}


mapTumbler.classList.remove('map--faded');

var testData = makeTestData(8);
makeMapPin(testData);
makeCards(testData);

console.log(testData);


