var makeData = function (numberOfObject) {
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

    arrayShuffle(initialData[4]);
    var photosData = [];
    for (var n = 0; n < initialData[4].length; n++) {
      photosData.push(initialData[4][n]);
    }

    var featuresData = [];
    for (var j = 0; j < initialData[3].length - makeRandomInteger(0, initialData[3].length); j++) {
      featuresData.push(initialData[3][j]);
    }

    data[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1 ) + '.png'
      },

      offer: {
        title: initialData[0][i],
        address: coordinateX + ', ' + coordinateY,
        price: makeRandomInteger(1000, 1000000),
        type: initialData[1][makeRandomInteger(0, initialData[1].lenght - 1)],
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

arrayData = makeData(8);
console.log(arrayData);

